import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageShell, Disclaimer } from "@/components/thamar/Brand";
import { MarketChart, OpportunityChart } from "@/components/thamar/Charts";
import { AdvisorChat } from "@/components/thamar/AdvisorChat";
import { getExternalIndicators, getMarketTrends, getOpportunities } from "@/lib/finance-api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "استثمار اليوم — ثَمَر Thamar" },
      {
        name: "description",
        content:
          "مؤشرات السوق اليوم في ثَمَر: الذهب والأسهم والبيتكوين والنفط والتضخم والفائدة، مع مقارنة الفرص ومساعد مالي تعليمي.",
      },
      { property: "og:title", content: "استثمار اليوم — ثَمَر Thamar" },
      {
        property: "og:description",
        content: "اتجاهات السوق ومقارنة العوائد التقديرية والمخاطر مع مساعد ذكي يشرح المؤشرات.",
      },
    ],
  }),
  component: () => (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-64 w-full rounded-2xl" /></div>}>
      <MarketPage />
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

function MarketPage() {
  const { t } = useLang();
  const { data: market } = useSuspenseQuery({ queryKey: ["market"], queryFn: getMarketTrends });
  const { data: external } = useSuspenseQuery({ queryKey: ["external"], queryFn: getExternalIndicators });
  const { data: opportunities } = useSuspenseQuery({
    queryKey: ["opportunities"],
    queryFn: getOpportunities,
  });

  return (
    <PageShell>
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{t("todayInvest")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("todayInvestSub")} · {t("demoBadge")}</p>
      </div>

      <Section title={t("externalIdx")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {external.map((ind) => {
            const up = ind.changePct > 0;
            const flat = ind.changePct === 0;
            return (
              <div key={ind.key} className="rounded-xl border border-border bg-primary-soft/50 p-4">
                <p className="text-xs text-muted-foreground">{t(ind.key)}</p>
                <p className="mt-1 font-semibold tabular-nums">{ind.value}</p>
                <p
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
                    flat ? "text-muted-foreground" : up ? "text-primary-strong" : "text-destructive"
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

      <Section title={t("market")} subtitle={t("marketSub")}>
        <MarketChart data={market} />
      </Section>

      <Section title={t("opportunities")} subtitle={t("opportunitiesSub")}>
        <OpportunityChart data={opportunities} />
        <Disclaimer className="mt-4" />
      </Section>

      <Section title={t("assistant")} subtitle={t("assistantSub")}>
        <AdvisorChat />
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
