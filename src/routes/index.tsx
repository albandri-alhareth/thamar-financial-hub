import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, TrendingUp, LineChart, Sprout, Scale, Eye } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/thamar/LangToggle";
import { LogoMark, Watermark, Wordmark } from "@/components/thamar/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ثَمَر Thamar — ابدأ رحلتك المالية" },
      {
        name: "description",
        content:
          "ثَمَر: منصة استدامة مالية واستثمار ببيانات تجريبية — مؤشرات شخصية، اتجاهات السوق، وتوصيات استثمارية استرشادية بالعربية والإنجليزية.",
      },
      { property: "og:title", content: "ثَمَر Thamar — ابدأ رحلتك المالية" },
      {
        property: "og:description",
        content: "منصة مالية تجريبية بلغة عربية وإنجليزية: مؤشرات شخصية، سوق، وتوصيات استرشادية.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const points = [
    { icon: Sprout, title: t("aboutPoint1"), body: t("aboutPoint1Body") },
    { icon: Scale, title: t("aboutPoint2"), body: t("aboutPoint2Body") },
    { icon: Eye, title: t("aboutPoint3"), body: t("aboutPoint3Body") },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <Watermark />

      <div className="lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <section
          className="relative flex flex-col justify-between overflow-hidden p-8 text-primary-foreground lg:p-12"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-background/70 px-3 py-2 backdrop-blur w-fit">
            <Wordmark />
          </div>

          <div className="my-10 max-w-md">
            <LogoMark className="mb-6 w-40 shadow-[var(--shadow-soft)]" />
            <h1 className="text-3xl leading-tight font-extrabold lg:text-4xl">{t("tagline")}</h1>
            <ul className="mt-8 space-y-4 text-sm/relaxed">
              <li className="flex items-center gap-3">
                <LineChart className="size-5 shrink-0" aria-hidden />
                {lang === "ar"
                  ? "مؤشرات شخصية: دخل، مصروفات، ادخار، صندوق طوارئ"
                  : "Personal indicators: income, expenses, savings, emergency fund"}
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp className="size-5 shrink-0" aria-hidden />
                {lang === "ar"
                  ? "اتجاهات السوق: ذهب، أسهم، بيتكوين، نفط"
                  : "Market trends: gold, stocks, bitcoin, oil"}
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-5 shrink-0" aria-hidden />
                {t("noBank")}
              </li>
            </ul>
          </div>

          <p className="text-xs opacity-80">
            © {new Date().getFullYear()} Thamar — {t("demoBadge")}
          </p>
        </section>

        {/* Auth panel */}
        <section className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {t("demoBadge")}
              </span>
              <LangToggle />
            </div>

            <h2 className="text-2xl font-bold text-primary-strong">{t("signIn")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("noBank")}</p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/portfolio" });
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="demo-name">{t("emailLabel")}</Label>
                <Input
                  id="demo-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("emailPh")}
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                {t("getStarted")}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm">
              <Link to="/privacy" className="font-medium text-primary-strong underline underline-offset-4">
                {t("privacy")}
              </Link>
            </p>
          </div>
        </section>
      </div>

      {/* About Thamar */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-2xl font-bold text-primary-strong">{t("aboutTitle")}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t("aboutBody")}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {points.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary-strong">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link to="/portfolio">{t("portfolio")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/market">{t("todayInvest")}</Link>
          </Button>
          <Link to="/privacy" className="text-sm font-medium text-primary-strong underline underline-offset-4">
            {t("privacy")}
          </Link>
        </div>

        <p className="mt-8 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-accent">{t("disclaimer")}: </span>
          {t("disclaimerBody")}
        </p>
      </section>
    </div>
  );
}
