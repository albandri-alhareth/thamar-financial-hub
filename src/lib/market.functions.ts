/**
 * Live market data layer for Thamar.
 *
 * Public market quotes are fetched server-side (no API key required) and
 * normalised into the same shapes the demo layer in `finance-api.ts` uses,
 * so the UI keeps working if the upstream source is unavailable.
 */
import { createServerFn } from "@tanstack/react-start";
import {
  getExternalIndicators,
  getMarketTrends,
  getOpportunities,
  type ExternalIndicator,
  type MarketPoint,
  type Opportunity,
} from "./finance-api";

type AssetId = "gold" | "stocks" | "bitcoin" | "oil" | "diamond";

const SYMBOLS: Record<AssetId, string> = {
  gold: "GC=F", // COMEX gold futures, $/oz
  stocks: "^GSPC", // S&P 500 index
  bitcoin: "BTC-USD",
  oil: "CL=F", // WTI crude, $/bbl
  diamond: "PDL.L", // diamond-sector proxy (Petra Diamonds)
};

const UNITS: Record<AssetId, (v: number) => string> = {
  gold: (v) => `${v.toLocaleString("en-US", { maximumFractionDigits: 0 })} $/oz`,
  stocks: (v) => `${v.toLocaleString("en-US", { maximumFractionDigits: 0 })} pts`,
  bitcoin: (v) => `${v.toLocaleString("en-US", { maximumFractionDigits: 0 })} $`,
  oil: (v) => `${v.toLocaleString("en-US", { maximumFractionDigits: 1 })} $/bbl`,
  diamond: (v) => `${v.toLocaleString("en-US", { maximumFractionDigits: 1 })} idx`,
};

type Quote = {
  price: number;
  changePct: number;
  monthly: { t: number; close: number }[];
};

async function fetchQuote(symbol: string): Promise<Quote | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1mo`,
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as any;
    const r = json?.chart?.result?.[0];
    const price = r?.meta?.regularMarketPrice;
    if (typeof price !== "number") return null;
    const stamps: number[] = r?.timestamp ?? [];
    const closes: (number | null)[] = r?.indicators?.quote?.[0]?.close ?? [];
    const monthly = stamps
      .map((t, i) => ({ t, close: closes[i] }))
      .filter((p): p is { t: number; close: number } => typeof p.close === "number");
    return { price, changePct: Number(r?.meta?.regularMarketChangePercent ?? 0), monthly };
  } catch {
    return null;
  }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type LiveMarket = {
  live: boolean;
  updatedAt: string;
  indicators: ExternalIndicator[];
  trends: MarketPoint[];
  opportunities: Opportunity[];
};

const RISK: Record<AssetId, Opportunity["risk"]> = {
  gold: "low",
  stocks: "medium",
  bitcoin: "high",
  oil: "high",
  diamond: "high",
};

const NAMES: Record<AssetId, { ar: string; en: string }> = {
  gold: { ar: "الذهب", en: "gold" },
  stocks: { ar: "الأسهم", en: "stocks" },
  bitcoin: { ar: "العملات الرقمية", en: "crypto" },
  oil: { ar: "النفط", en: "oil" },
  diamond: { ar: "الألماس", en: "diamonds" },
};

export const getLiveMarket = createServerFn({ method: "GET" }).handler(async (): Promise<LiveMarket> => {
  const ids = Object.keys(SYMBOLS) as AssetId[];
  const quotes = await Promise.all(ids.map((id) => fetchQuote(SYMBOLS[id])));
  const map = new Map<AssetId, Quote>();
  ids.forEach((id, i) => {
    const q = quotes[i];
    if (q) map.set(id, q);
  });

  if (map.size === 0) {
    const [indicators, trends, opportunities] = await Promise.all([
      getExternalIndicators(),
      getMarketTrends(),
      getOpportunities(),
    ]);
    return { live: false, updatedAt: new Date().toISOString(), indicators, trends, opportunities };
  }

  // Indicators
  const indicators: ExternalIndicator[] = ids
    .filter((id) => map.has(id))
    .map((id) => {
      const q = map.get(id)!;
      return {
        key: id,
        value: UNITS[id](q.price),
        changePct: Math.round(q.changePct * 10) / 10,
      };
    });

  const tnx = await fetchQuote("^TNX");
  if (tnx) {
    indicators.push({
      key: "interest",
      value: `${tnx.price.toFixed(2)}%`,
      changePct: Math.round(tnx.changePct * 10) / 10,
    });
  }

  // 12-month relative performance, indexed to 100
  const base = ids.find((id) => map.has(id))!;
  const length = Math.min(...ids.filter((id) => map.has(id)).map((id) => map.get(id)!.monthly.length));
  const trends: MarketPoint[] = [];
  for (let i = 0; i < length; i++) {
    const offset = (id: AssetId) => {
      const series = map.get(id)!.monthly;
      return series.slice(series.length - length);
    };
    const point: any = {
      month: MONTHS[new Date(offset(base)[i]!.t * 1000).getUTCMonth()],
    };
    for (const id of ids) {
      if (!map.has(id)) continue;
      const series = offset(id);
      const first = series[0]!.close;
      point[id] = Math.round((series[i]!.close / first) * 1000) / 10;
    }
    trends.push(point as MarketPoint);
  }

  // Estimated annual return from the live 12-month performance
  const perf = (id: AssetId) => {
    const series = map.get(id)?.monthly ?? [];
    if (series.length < 2) return 0;
    return ((series[series.length - 1]!.close / series[0]!.close - 1) * 100);
  };

  const riskPenalty: Record<Opportunity["risk"], number> = { low: 0, medium: 12, high: 30 };
  const opportunities: Opportunity[] = ids
    .filter((id) => map.has(id))
    .map((id) => {
      const p = perf(id);
      const estReturn = Math.round(Math.max(-20, Math.min(30, p)) * 10) / 10;
      const suitability = Math.max(
        5,
        Math.min(95, Math.round(50 + estReturn * 1.4 - riskPenalty[RISK[id]])),
      );
      const dir = p >= 0 ? { ar: "صاعد", en: "an upward" } : { ar: "هابط", en: "a downward" };
      return {
        key: id as Opportunity["key"],
        suitability,
        estReturn,
        risk: RISK[id],
        reasonAr: `أداء ${NAMES[id].ar} خلال ١٢ شهرًا ${dir.ar} بنحو ${p.toFixed(1)}٪ من بيانات السوق الحالية، ودرجة الملاءمة تجمع هذا الأداء مع مستوى المخاطر ووضعك المالي.`,
        reasonEn: `Live data shows ${dir.en} 12-month move of ${p.toFixed(1)}% for ${NAMES[id].en}; suitability blends that with its risk level and your financial position.`,
      };
    })
    .sort((a, b) => b.suitability - a.suitability);

  return { live: true, updatedAt: new Date().toISOString(), indicators, trends, opportunities };
});
