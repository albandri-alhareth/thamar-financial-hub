import {
  Area,
  ComposedChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AllocationSlice, MarketPoint, MonthlyPoint, Opportunity } from "@/lib/finance-api";

const axis = {
  stroke: "var(--color-muted-foreground)",
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11, fill: "var(--color-muted-foreground)" },
} as const;

const tooltipStyle = {
  contentStyle: {
    borderRadius: "0.75rem",
    border: "1px solid var(--color-border)",
    background: "var(--color-card)",
    color: "var(--color-card-foreground)",
    fontSize: "12px",
    boxShadow: "var(--shadow-soft)",
  },
  labelStyle: { color: "var(--color-foreground)", fontWeight: 600, marginBottom: 4 },
  cursor: { stroke: "var(--color-border)" },
} as const;

const legendStyle = { fontSize: 12, paddingTop: 8 } as const;

/** Keeps every chart inside its card on small screens. */
function ChartBox({ height, children }: { height: number; children: React.ReactElement }) {
  return (
    <div className="w-full min-w-0" style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function PersonalChart({ data }: { data: MonthlyPoint[] }) {
  const { lang, t } = useLang();
  const isMobile = useIsMobile();
  const rows = data.map((d) => ({ ...d, name: lang === "ar" ? d.month : d.monthEn }));
  return (
    <ChartBox height={isMobile ? 260 : 300}>
      <ComposedChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gSavings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gEmergency" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="name" {...axis} interval="preserveStartEnd" minTickGap={8} />
        <YAxis
          yAxisId="left"
          {...axis}
          width={isMobile ? 36 : 48}
          tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          {...axis}
          width={isMobile ? 32 : 44}
          tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
        />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} iconType="plainline" />
        <Area
          type="monotone"
          yAxisId="left"
          dataKey="savings"
          name={t("savings")}
          stroke="var(--color-primary)"
          fill="url(#gSavings)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          yAxisId="left"
          dataKey="emergencyFund"
          name={t("emergency")}
          stroke="var(--color-accent)"
          fill="url(#gEmergency)"
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="income"
          name={t("income")}
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          yAxisId="right"
          dataKey="expenses"
          name={t("expenses")}
          stroke="var(--color-destructive)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ChartBox>
  );
}

const sliceColors: Record<string, string> = {
  cash: "var(--color-chart-2)",
  gold: "var(--color-accent)",
  stocks: "var(--color-primary)",
  bitcoin: "var(--color-chart-4)",
  oil: "var(--color-chart-5)",
};

export function AllocationChart({ data }: { data: AllocationSlice[] }) {
  const { t } = useLang();
  const [active, setActive] = useState<string | null>(null);
  const rows = data.map((d) => ({ ...d, name: t(d.key) }));
  const current = rows.find((r) => r.key === active) ?? null;

  return (
    <div>
      <div className="relative">
        <ChartBox height={220}>
          <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={3}
              isAnimationActive
              onMouseEnter={(_, i) => setActive(rows[i]?.key ?? null)}
              onMouseLeave={() => setActive(null)}
            >
              {rows.map((r) => (
                <Cell
                  key={r.key}
                  fill={sliceColors[r.key]}
                  stroke="var(--color-card)"
                  strokeWidth={2}
                  fillOpacity={active && active !== r.key ? 0.35 : 1}
                  style={{ cursor: "pointer", transition: "fill-opacity 150ms ease" }}
                />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}%`} />
          </PieChart>
        </ChartBox>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular-nums">
            {current ? `${current.value}%` : `${rows.reduce((s, r) => s + r.value, 0)}%`}
          </span>
          <span className="max-w-[7rem] truncate text-xs text-muted-foreground">
            {current ? current.name : t("allocation")}
          </span>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.key}>
            <button
              type="button"
              onMouseEnter={() => setActive(r.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(r.key)}
              onBlur={() => setActive(null)}
              className={cn(
                "flex w-full min-w-0 items-center gap-2 rounded-lg px-1.5 py-1 text-start transition-colors",
                active === r.key ? "bg-secondary" : "hover:bg-secondary/60",
              )}
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: sliceColors[r.key] }}
                aria-hidden
              />
              <span className="truncate text-muted-foreground">{r.name}</span>
              <span className="ms-auto font-medium tabular-nums">{r.value}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketChart({ data }: { data: MarketPoint[] }) {
  const { t } = useLang();
  const isMobile = useIsMobile();
  return (
    <ChartBox height={isMobile ? 260 : 320}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" {...axis} interval="preserveStartEnd" minTickGap={8} />
        <YAxis {...axis} width={isMobile ? 32 : 44} domain={[80, "dataMax + 10"]} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} iconType="plainline" />
        <Line type="monotone" dataKey="gold" name={t("gold")} stroke="var(--color-accent)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="stocks" name={t("stocks")} stroke="var(--color-primary)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="bitcoin" name={t("bitcoin")} stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="oil" name={t("oil")} stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartBox>
  );
}

export function OpportunityChart({ data }: { data: Opportunity[] }) {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const best = [...data].sort((a, b) => b.suitability - a.suitability)[0];
  const rows = data.map((d) => ({
    name: t(d.key),
    suitability: d.suitability,
    estReturn: d.estReturn,
    isBest: d.key === best?.key,
  }));
  return (
    <ChartBox height={isMobile ? 260 : 300}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="name" {...axis} interval={0} />
        <YAxis {...axis} width={isMobile ? 30 : 40} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-secondary)", opacity: 0.5 }} />
        <Legend wrapperStyle={legendStyle} iconType="circle" />
        <Bar dataKey="suitability" name={t("suitability")} radius={[6, 6, 0, 0]} barSize={isMobile ? 16 : 26}>
          {rows.map((r) => (
            <Cell key={r.name} fill="var(--color-primary)" fillOpacity={r.isBest ? 1 : 0.45} />
          ))}
        </Bar>
        <Bar
          dataKey="estReturn"
          name={t("estReturn")}
          radius={[6, 6, 0, 0]}
          barSize={isMobile ? 16 : 26}
          fill="var(--color-accent)"
          fillOpacity={0.75}
        />
      </BarChart>
    </ChartBox>
  );
}
