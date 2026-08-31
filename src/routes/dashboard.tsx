import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Coins,
  Gauge,
  LogOut,
  PiggyBank,
  Shield,
  Sprout,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/thamar/LangToggle";
import { StatCard } from "@/components/thamar/StatCard";
import { RecommendationCard } from "@/components/thamar/RecommendationCard";
import {
  AllocationChart,
  MarketChart,
  OpportunityChart,
  PersonalChart,
} from "@/components/thamar/Charts";
import {
  getAllocation,
  getExternalIndicators,
  getMarketTrends,
  getOpportunities,
  getPersonalHistory,
  getPersonalProfile,
} from "@/lib/finance-api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة المؤشرات — ثمار Thamar" },
      {
        name: "description",
        content: "مؤشراتك المالية الشخصية، اتجاهات السوق للذهب والأسهم والبيتكوين والنفط، وتوصيات استثمارية استرشادية.",
      },
      { property: "og:title", content: "لوحة المؤشرات — ثمار Thamar" },
      {
        property: "og:description",
        content: "دخل، مصروفات، ادخار، صندوق طوارئ، ومؤشر استدامة مالية مع مقارنة فرص الاستثمار.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-64 w-full rounded-2xl" /></div>}>
      <Dashboard />
    </Suspense>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Dashboard() {
  const { t, lang } = useLang();
  const nf = new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 0 });
  const money = (v: number) => `${nf.format(v)} ${t("currency")}`;

  const { data: profile } = useSuspenseQuery({ queryKey: ["profile"], queryFn: getPersonalProfile });
  const { data: history } = useSuspenseQuery({ queryKey: ["history"], queryFn: getPersonalHistory });
  const { data: allocation } = useSuspenseQuery({ queryKey: ["allocation"], queryFn: getAllocation });
  const { data: market } = useSuspenseQuery({ queryKey: ["market"], queryFn: getMarketTrends });
  const { data: external } = useSuspenseQuery({ queryKey: ["external"], queryFn: getExternalIndicators });
  const { data: opportunities } = useSuspenseQuery({ queryKey: ["opportunities"], queryFn: getOpportunities });

  const best = [...opportunities].sort((a, b) => b.suitability - a.suitability)[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sprout className="size-5" aria-hidden />
            </span>
            {t("brand")}
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {t("demoBadge")}
            </span>
            <LangToggle />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent/20"
            >
              <LogOut className="size-4 rtl:rotate-180" aria-hidden />
              {t("logout")}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{t("dashboard")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("overview")} · {t("demoBadge")}</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={t("income")} value={money(profile.income)} hint={t("monthly")} icon={<Wallet className="size-4" />} />
          <StatCard label={t("expenses")} value={money(profile.expenses)} hint={t("monthly")} icon={<Banknote className="size-4" />} />
          <StatCard label={t("savings")} value={money(profile.savings)} icon={<PiggyBank className="size-4" />} />
          <StatCard
            label={t("emergency")}
            value={money(profile.emergencyFund)}
            icon={<Shield className="size-4" />}
            progress={(profile.emergencyFund / profile.monthlyEmergencyTarget) * 100}
            hint={`${Math.round((profile.emergencyFund / profile.monthlyEmergencyTarget) * 100)}% / ${money(profile.monthlyEmergencyTarget)}`}
          />
          <StatCard label={t("investable")} value={money(profile.investable)} icon={<Coins className="size-4" />} accent />
          <StatCard label={t("savingRate")} value={`${profile.savingRate}%`} progress={profile.savingRate} icon={<TrendingUp className="size-4" />} />
          <StatCard
            label={t("sustainability")}
            value={`${profile.sustainability}/100`}
            progress={profile.sustainability}
            hint={t("sustainabilityHint")}
            icon={<Gauge className="size-4" />}
          />
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
            <div className="flex items-center gap-2 text-accent-foreground">
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              <p className="text-sm font-semibold">{t("disclaimer")}</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("disclaimerBody")}</p>
          </div>
        </div>

        {/* Personal charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Section title={t("personalChart")} subtitle={t("personalChartSub")}>
              <PersonalChart data={history} />
            </Section>
          </div>
          <Section title={t("allocation")}>
            <AllocationChart data={allocation} />
          </Section>
        </div>

        {/* Market */}
        <Section title={t("market")} subtitle={t("marketSub")}>
          <MarketChart data={market} />
        </Section>

        {/* External indicators */}
        <Section title={t("externalIdx")}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {external.map((ind) => {
              const up = ind.changePct > 0;
              const flat = ind.changePct === 0;
              return (
                <div key={ind.key} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">{t(ind.key)}</p>
                  <p className="mt-1 font-semibold tabular-nums">{ind.value}</p>
                  <p
                    className={`mt-1 inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
                      flat ? "text-muted-foreground" : up ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {!flat &&
                      (up ? (
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      ) : (
                        <ArrowDownRight className="size-3.5" aria-hidden />
                      ))}
                    {ind.changePct > 0 ? "+" : ""}
                    {ind.changePct}%
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Opportunities */}
        <Section title={t("opportunities")} subtitle={t("opportunitiesSub")}>
          <OpportunityChart data={opportunities} />
        </Section>

        {/* Recommendations */}
        <Section title={t("recommendations")} subtitle={t("recommendationsSub")}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {opportunities.map((o) => (
              <RecommendationCard key={o.key} item={o} best={o.key === best?.key} />
            ))}
          </div>
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 text-xs text-muted-foreground">
          <p>{t("disclaimerBody")}</p>
          <Link to="/privacy" className="font-medium text-primary underline underline-offset-4">
            {t("privacy")}
          </Link>
        </div>
      </main>
    </div>
  );
}
