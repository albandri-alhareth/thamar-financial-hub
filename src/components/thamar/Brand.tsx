import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import wordmark from "@/assets/thamar-wordmark.png.asset.json";
import logo from "@/assets/thamar-logo.jpg.asset.json";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/thamar/LangToggle";
import { cn } from "@/lib/utils";

export const thamarWordmarkUrl = wordmark.url;
export const thamarLogoUrl = logo.url;

/** Small gold text logo used in the page corner / header. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <img
      src={wordmark.url}
      alt="ثَمَر | THAMAR"
      className={cn("h-8 w-auto object-contain sm:h-9", className)}
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
        className="absolute top-1/2 left-1/2 w-[min(70vw,620px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.045] mix-blend-multiply"
      />
    </div>
  );
}

export function AppHeader() {
  const { t } = useLang();
  const link =
    "rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary-strong";
  const active = "bg-primary-soft text-primary-strong";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" aria-label={t("brand")}>
          <Wordmark />
        </Link>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto sm:order-none sm:w-auto">
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

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground sm:inline">
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
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">{children}</main>
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <div className={cn("rounded-2xl border border-accent/40 bg-accent/10 p-4", className)}>
      <p className="text-sm font-semibold text-accent">{t("disclaimer")}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("disclaimerBody")}</p>
    </div>
  );
}
