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
import { useLang } from "@/lib/i18n";
import type { AllocationSlice, MarketPoint, MonthlyPoint, Opportunity } from "@/lib/finance-api";

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    borderRadius: "0.75rem",
    border: "1px solid var(--color-border)",
    background: "var(--color-card)",
    color: "var(--color-card-foreground)",
    fontSize: "12px",
  },
} as const;

export function PersonalChart({ data }: { data: MonthlyPoint[] }) {
  const { lang, t } = useLang();
  const rows = data.map((d) => ({ ...d, name: lang === "ar" ? d.month : d.monthEn }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="gSavings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gEmergency" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="name" {...axis} />
        <YAxis yAxisId="left" {...axis} width={56} />
        <YAxis yAxisId="right" orientation="right" {...axis} width={52} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
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
        <Line yAxisId="right" type="monotone" dataKey="income" name={t("income")} stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
        <Line
          type="monotone"
          yAxisId="right"
          dataKey="expenses"
          name={t("expenses")}
          stroke="var(--color-destructive)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
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
  const rows = data.map((d) => ({ ...d, name: t(d.key) }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="name" innerRadius={58} outerRadius={95} paddingAngle={3}>
          {rows.map((r) => (
            <Cell key={r.key} fill={sliceColors[r.key]} stroke="var(--color-card)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}%`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MarketChart({ data }: { data: MarketPoint[] }) {
  const { t } = useLang();
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} width={44} domain={[80, "dataMax + 10"]} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="gold" name={t("gold")} stroke="var(--color-accent)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="stocks" name={t("stocks")} stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="bitcoin" name={t("bitcoin")} stroke="var(--color-chart-4)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="oil" name={t("oil")} stroke="var(--color-chart-5)" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OpportunityChart({ data }: { data: Opportunity[] }) {
  const { t } = useLang();
  const best = [...data].sort((a, b) => b.suitability - a.suitability)[0];
  const rows = data.map((d) => ({
    name: t(d.key),
    suitability: d.suitability,
    estReturn: d.estReturn,
    isBest: d.key === best?.key,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="name" {...axis} />
        <YAxis {...axis} width={44} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="suitability" name={t("suitability")} radius={[8, 8, 0, 0]} barSize={28}>
          {rows.map((r) => (
            <Cell key={r.name} fill={r.isBest ? "var(--color-primary)" : "var(--color-primary)"} fillOpacity={r.isBest ? 1 : 0.35} />
          ))}
        </Bar>
        <Bar dataKey="estReturn" name={t("estReturn")} radius={[8, 8, 0, 0]} barSize={28} fill="var(--color-accent)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
