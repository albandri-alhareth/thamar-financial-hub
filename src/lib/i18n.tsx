import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";

const dict = {
  brand: { ar: "ثمار", en: "Thamar" },
  tagline: {
    ar: "منصة مالية ذكية تحوّل بياناتك إلى قرارات استثمارية واضحة",
    en: "A smart finance platform turning your data into clear investment decisions",
  },
  signIn: { ar: "الدخول للتجربة", en: "Enter the demo" },
  emailLabel: { ar: "الاسم أو البريد (تجريبي)", en: "Name or email (demo)" },
  emailPh: { ar: "demo@thamar.app", en: "demo@thamar.app" },
  noBank: {
    ar: "لا نطلب هوية أو حساب بنكي أو بطاقات أو كلمات مرور. البيانات تجريبية بالكامل.",
    en: "No ID, bank account, cards, or passwords required. All data is demo data.",
  },
  privacy: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  backHome: { ar: "العودة للرئيسية", en: "Back home" },
  dashboard: { ar: "لوحة المؤشرات", en: "Dashboard" },
  overview: { ar: "نظرة عامة", en: "Overview" },
  income: { ar: "الدخل الشهري", en: "Monthly income" },
  expenses: { ar: "المصروفات", en: "Expenses" },
  savings: { ar: "المدخرات", en: "Savings" },
  emergency: { ar: "صندوق الطوارئ", en: "Emergency fund" },
  investable: { ar: "المبلغ المراد استثماره", en: "Amount to invest" },
  savingRate: { ar: "معدل الادخار", en: "Saving rate" },
  sustainability: { ar: "مؤشر الاستدامة المالية", en: "Financial sustainability" },
  personalChart: { ar: "المؤشرات الشخصية", en: "Personal indicators" },
  personalChartSub: {
    ar: "دخل ومصروفات وادخار وصندوق طوارئ خلال ٦ أشهر",
    en: "Income, expenses, savings and emergency fund over 6 months",
  },
  allocation: { ar: "توزيع الأصول", en: "Asset allocation" },
  market: { ar: "اتجاهات السوق", en: "Market trends" },
  marketSub: {
    ar: "أداء نسبي (مُعاير 100) للذهب والأسهم والبيتكوين والنفط خلال ١٢ شهرًا",
    en: "Relative performance (indexed to 100) for gold, stocks, bitcoin and oil over 12 months",
  },
  opportunities: { ar: "مقارنة فرص الاستثمار", en: "Investment opportunities" },
  opportunitiesSub: {
    ar: "العائد التقديري السنوي مقابل درجة الملاءمة",
    en: "Estimated annual return vs. suitability score",
  },
  externalIdx: { ar: "المؤشرات الخارجية", en: "External indicators" },
  recommendations: { ar: "توصيات استثمارية", en: "Investment recommendations" },
  recommendationsSub: {
    ar: "الملاءمة محسوبة من بياناتك الشخصية ومؤشرات السوق معًا، وليست من سعر الأصل فقط.",
    en: "Suitability blends your personal data with market indicators — not asset price alone.",
  },
  bestNow: { ar: "الأفضل حاليًا", en: "Best right now" },
  suitability: { ar: "الملاءمة", en: "Suitability" },
  risk: { ar: "المخاطر", en: "Risk" },
  estReturn: { ar: "العائد التقديري", en: "Est. return" },
  why: { ar: "السبب", en: "Why" },
  disclaimer: { ar: "تنبيه استثماري", en: "Investment disclaimer" },
  disclaimerBody: {
    ar: "جميع الأرقام والمؤشرات تجريبية وتقديرية لأغراض استرشادية فقط، ولا تمثل ضمانًا للعائد ولا توصية استثمارية مؤكدة. القرار ومسؤوليته على المستخدم.",
    en: "All figures and indicators are demo and estimated, for guidance only. They are not a guarantee of returns nor a confirmed investment recommendation. Decisions remain the user's responsibility.",
  },
  low: { ar: "منخفضة", en: "Low" },
  medium: { ar: "متوسطة", en: "Medium" },
  high: { ar: "مرتفعة", en: "High" },
  gold: { ar: "الذهب", en: "Gold" },
  stocks: { ar: "الأسهم", en: "Stocks" },
  bitcoin: { ar: "البيتكوين", en: "Bitcoin" },
  oil: { ar: "النفط", en: "Oil" },
  inflation: { ar: "التضخم", en: "Inflation" },
  interest: { ar: "الفائدة", en: "Interest rate" },
  cash: { ar: "نقد", en: "Cash" },
  demoBadge: { ar: "بيانات تجريبية", en: "Demo data" },
  logout: { ar: "خروج", en: "Sign out" },
  monthly: { ar: "شهريًا", en: "monthly" },
  currency: { ar: "ر.س", en: "SAR" },
  sustainabilityHint: {
    ar: "يقيس قدرة دخلك على تغطية المصروفات وبناء مدخرات مستدامة",
    en: "Measures how well income covers expenses while building sustainable savings",
  },
} as const;

export type Key = keyof typeof dict;

type Ctx = { lang: Lang; dir: "rtl" | "ltr"; t: (k: Key) => string; toggle: () => void };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const saved = window.localStorage.getItem("thamar-lang");
    if (saved === "ar" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("thamar-lang", lang);
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: (k: Key) => dict[k][lang],
      toggle: () => setLang((l) => (l === "ar" ? "en" : "ar")),
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
