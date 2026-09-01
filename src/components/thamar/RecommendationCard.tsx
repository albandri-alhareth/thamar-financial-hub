import { Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/finance-api";

export function RecommendationCard({ item, best }: { item: Opportunity; best: boolean }) {
  const { lang, t } = useLang();
  const riskLabel = t(item.risk);
  const riskTone =
    item.risk === "low"
      ? "bg-primary-soft text-primary-strong"
      : item.risk === "medium"
        ? "bg-accent/15 text-accent"
        : "bg-destructive/10 text-destructive";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border bg-card p-4 sm:p-5",
        best ? "border-primary/50 bg-primary-soft/30" : "border-border",
      )}
    >
      <div className="flex min-h-7 items-center justify-between gap-2">
        <h3 className="truncate text-base font-semibold">{t(item.key)}</h3>
        {best ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-strong">
            <Sparkles className="size-3.5" aria-hidden />
            {t("bestNow")}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">{t("suitability")}</span>
          <span className="font-bold tabular-nums">{item.suitability}/100</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${item.suitability}%` }} />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-secondary/60 p-3">
          <dt className="text-xs text-muted-foreground">{t("risk")}</dt>
          <dd className={cn("mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium", riskTone)}>
            {riskLabel}
          </dd>
        </div>
        <div className="rounded-xl bg-secondary/60 p-3">
          <dt className="text-xs text-muted-foreground">{t("estReturn")}</dt>
          <dd className="mt-1 font-semibold tabular-nums">~{item.estReturn}%</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">{t("why")}: </span>
        {lang === "ar" ? item.reasonAr : item.reasonEn}
      </p>
    </article>
  );
}
