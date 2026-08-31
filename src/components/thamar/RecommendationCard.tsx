import { Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/finance-api";

export function RecommendationCard({ item, best }: { item: Opportunity; best: boolean }) {
  const { lang, t } = useLang();
  const riskLabel = t(item.risk);
  const riskTone =
    item.risk === "low"
      ? "bg-primary/10 text-primary"
      : item.risk === "medium"
        ? "bg-accent/20 text-accent-foreground"
        : "bg-destructive/10 text-destructive";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border bg-card p-5",
        best ? "border-primary shadow-[var(--shadow-soft)] ring-1 ring-primary/20" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{t(item.key)}</h3>
        {best ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
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
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
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
