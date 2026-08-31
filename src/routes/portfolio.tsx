import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Banknote, Coins, Gauge, PiggyBank, Shield, TrendingUp, Wallet } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageShell, Disclaimer } from "@/components/thamar/Brand";
import { StatCard } from "@/components/thamar/StatCard";
import { RecommendationCard } from "@/components/thamar/RecommendationCard";
import { AllocationChart, PersonalChart } from "@/components/thamar/Charts";
import {
  getAllocation,
  getOpportunities,
  getPersonalHistory,
  getPersonalProfile,
} from "@/lib/finance-api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "محفظتك المستقبلية — ثَمَر Thamar" },
      {
        name: "description",
        content:
          "لوحة شخصية في ثَمَر: الدخل والمصروفات والمدخرات وصندوق الطوارئ وتوزيع الأصول ومعدل الادخار مع أفضل التوصيات الاستثمارية لك.",
      },
      { property: "og:title", content: "محفظتك المستقبلية — ثَمَر Thamar" },
      {
        property: "og:description",
        content: "مؤشراتك المالية الشخصية وتوصيات استثمارية استرشادية مبنية على وضعك وحالة السوق.",
      },
    ],
  }),
  component: () => (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-64 w-full rounded-2xl" /></div>}>
      <PortfolioPage />
    </Suspense>
  ),
});

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
        <h2 className="text-lg font-semibold text-primary-strong">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function PortfolioPage() {
  const { t, lang } = useLang();
  const nf = new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 0 });
  const money = (v: number) => `${nf.format(v)} ${t("currency")}`;

  const { data: profile } = useSuspenseQuery({ queryKey: ["profile"], queryFn: getPersonalProfile });
  const { data: history } = useSuspenseQuery({ queryKey: ["history"], queryFn: getPersonalHistory });
  const { data: allocation } = useSuspenseQuery({ queryKey: ["allocation"], queryFn: getAllocation });
  const { data: opportunities } = useSuspenseQuery({
    queryKey: ["opportunities"],
    queryFn: getOpportunities,
  });

  const best = [...opportunities].sort((a, b) => b.suitability - a.suitability)[0];
  const emergencyPct = (profile.emergencyFund / profile.monthlyEmergencyTarget) * 100;

  return (
    <PageShell>
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{t("portfolio")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("portfolioSub")} · {t("demoBadge")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("income")} value={money(profile.income)} hint={t("monthly")} icon={<Wallet className="size-4" />} />
        <StatCard label={t("expenses")} value={money(profile.expenses)} hint={t("monthly")} icon={<Banknote className="size-4" />} />
        <StatCard label={t("savings")} value={money(profile.savings)} icon={<PiggyBank className="size-4" />} />
        <StatCard
          label={t("emergency")}
          value={money(profile.emergencyFund)}
          icon={<Shield className="size-4" />}
          progress={emergencyPct}
          hint={`${Math.round(emergencyPct)}% / ${money(profile.monthlyEmergencyTarget)}`}
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
        <Disclaimer />
      </div>

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

      <Section title={t("bestForYou")} subtitle={t("recommendationsSub")}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {opportunities.map((o) => (
            <RecommendationCard key={o.key} item={o} best={o.key === best?.key} />
          ))}
        </div>
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 text-xs text-muted-foreground">
        <p>{t("disclaimerBody")}</p>
        <Link to="/privacy" className="font-medium text-primary-strong underline underline-offset-4">
          {t("privacy")}
        </Link>
      </div>
    </PageShell>
  );
}
