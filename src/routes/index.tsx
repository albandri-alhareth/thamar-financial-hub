import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Sprout, TrendingUp, LineChart } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/thamar/LangToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ثمار Thamar — ابدأ رحلتك المالية" },
      {
        name: "description",
        content: "ادخل إلى تجربة ثمار: مؤشرات مالية شخصية، اتجاهات السوق، وتوصيات استثمارية استرشادية ببيانات تجريبية.",
      },
      { property: "og:title", content: "ثمار Thamar — ابدأ رحلتك المالية" },
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

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <section
        className="relative flex flex-col justify-between overflow-hidden p-8 text-primary-foreground lg:p-12"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-foreground/15">
            <Sprout className="size-5" aria-hidden />
          </span>
          <span className="text-xl font-bold">{t("brand")}</span>
        </div>

        <div className="my-12 max-w-md">
          <h1 className="text-3xl leading-tight font-extrabold lg:text-4xl">{t("tagline")}</h1>
          <ul className="mt-8 space-y-4 text-sm/relaxed opacity-90">
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

        <p className="text-xs opacity-75">© {new Date().getFullYear()} Thamar — {t("demoBadge")}</p>
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

          <h2 className="text-2xl font-bold">{t("signIn")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("noBank")}</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
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
              {t("signIn")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link to="/privacy" className="font-medium text-primary underline underline-offset-4">
              {t("privacy")}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
