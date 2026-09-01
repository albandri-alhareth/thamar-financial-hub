import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Info } from "lucide-react";
import wordmarkMono from "@/assets/thamar-wordmark-mono.png";
import logo from "@/assets/thamar-logo.jpg.asset.json";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/thamar/LangToggle";
import { cn } from "@/lib/utils";

export const thamarWordmarkUrl = wordmarkMono;
export const thamarLogoUrl = logo.url;

/** Monochrome text logo used in the page corner / header. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <img
      src={wordmarkMono}
      alt="ثَمَر | THAMAR"
      width={1137}
      height={218}
      className={cn("h-6 w-auto object-contain sm:h-7", className)}
      loading="eager"
      decoding="async"
    />
  );
}

/** Full illustrated logo (plant growing out of coins) — login & hero use. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="شعار ثَمَر"
      className={cn("rounded-2xl object-contain", className)}
      loading="eager"
      decoding="async"
    />
  );
}

/** Very light background watermark; purely decorative. */
export function Watermark() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img
        src={logo.url}
        alt=""
        className="absolute top-1/2 left-1/2 w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.035] mix-blend-multiply"
      />
    </div>
  );
}

export function AppHeader() {
  const { t } = useLang();
  const link =
    "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary-strong";
  const active = "bg-primary-soft text-primary-strong";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex shrink-0 items-center" aria-label={t("brand")}>
          <Wordmark />
        </Link>

        <nav className="col-span-3 row-start-2 -mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-0.5 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-center sm:overflow-visible sm:pb-0">
          <Link to="/portfolio" className={link} activeProps={{ className: cn(link, active) }}>
            {t("portfolio")}
          </Link>
          <Link to="/market" className={link} activeProps={{ className: cn(link, active) }}>
            {t("todayInvest")}
          </Link>
          <Link to="/privacy" className={link} activeProps={{ className: cn(link, active) }}>
            {t("privacy")}
          </Link>
        </nav>

        <div className="col-start-3 row-start-1 flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground lg:inline">
            {t("demoBadge")}
          </span>
          <LangToggle />
        </div>
      </div>
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      <Watermark />
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:py-6">{children}</main>
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <div
      className={cn(
        "flex h-full items-start gap-3 rounded-2xl border border-accent/30 bg-accent/[0.07] p-4",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-accent">{t("disclaimer")}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("disclaimerBody")}</p>
      </div>
    </div>
  );
}

/** Shared card section used across pages for consistent radius/spacing. */
export function Section({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-4 sm:p-5", className)}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-primary-strong sm:text-lg">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
