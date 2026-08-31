import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sprout } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/thamar/LangToggle";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية — ثمار Thamar" },
      {
        name: "description",
        content: "كيف تتعامل منصة ثمار مع بياناتك: بيانات تجريبية فقط، دون هوية أو حسابات بنكية أو بطاقات.",
      },
      { property: "og:title", content: "سياسة الخصوصية — ثمار Thamar" },
      {
        property: "og:description",
        content: "ثمار لا تجمع هوية أو بيانات بنكية أو بطاقات؛ التجربة تعمل ببيانات تجريبية فقط.",
      },
    ],
  }),
  component: Privacy,
});

const sections = {
  ar: [
    ["ما الذي نجمعه", "لا تجمع النسخة التجريبية من ثمار أي بيانات هوية أو حسابات بنكية أو أرقام بطاقات أو كلمات مرور. جميع الأرقام المعروضة داخل التطبيق بيانات تجريبية ثابتة."],
    ["كيف تُستخدم البيانات", "تُستخدم الأرقام التجريبية لعرض المؤشرات والرسوم البيانية والتوصيات الاسترشادية داخل متصفحك فقط."],
    ["التخزين المحلي", "نحفظ تفضيل اللغة (عربي/إنجليزي) في متصفحك فقط، ويمكن حذفه بمسح بيانات الموقع."],
    ["أطراف ثالثة", "لا تتم مشاركة أي بيانات مع أطراف ثالثة، ولا تُستخدم مفاتيح أو أسرار داخل التطبيق."],
    ["الطبيعة الاسترشادية", "المؤشرات والعوائد المعروضة تقديرية لأغراض استرشادية فقط وليست ضمانًا أو توصية استثمارية مؤكدة."],
  ],
  en: [
    ["What we collect", "The Thamar demo collects no identity data, bank accounts, card numbers, or passwords. Every figure shown in the app is static demo data."],
    ["How data is used", "Demo figures power the indicators, charts, and guidance cards inside your browser only."],
    ["Local storage", "We store only your language preference (Arabic/English) in your browser; clearing site data removes it."],
    ["Third parties", "No data is shared with third parties, and no API keys or secrets are used in the app."],
    ["Guidance only", "Indicators and returns are estimates for guidance only — not a guarantee nor a confirmed investment recommendation."],
  ],
} as const;

function Privacy() {
  const { lang, t } = useLang();
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary">
            <Sprout className="size-5" aria-hidden />
            {t("brand")}
          </Link>
          <LangToggle />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">{t("privacy")}</h1>
        <div className="mt-8 space-y-6">
          {sections[lang].map(([title, body]) => (
            <section key={title} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </section>
          ))}
        </div>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
        >
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
