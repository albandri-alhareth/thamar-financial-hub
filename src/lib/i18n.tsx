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
  brand: { ar: "ثَمَر", en: "Thamar" },
  portfolio: { ar: "محفظتك المستقبلية", en: "Your Future Portfolio" },
  portfolioSub: {
    ar: "صورة شاملة لوضعك المالي الحالي والتوصيات المناسبة له",
    en: "A complete picture of your finances and the recommendations that fit it",
  },
  todayInvest: { ar: "استثمار اليوم", en: "Invest Today" },
  todayInvestSub: {
    ar: "حالة السوق اليوم ومقارنة الفرص الاستثمارية ببيانات تجريبية",
    en: "Today's market snapshot and an opportunity comparison, on demo data",
  },
  bestForYou: { ar: "أفضل التوصيات الاستثمارية لك", en: "Best investment picks for you" },
  aboutTitle: { ar: "ما هي ثَمَر؟", en: "What is Thamar?" },
  aboutBody: {
    ar: "ثَمَر منصة مالية تساعدك على فهم استدامتك المالية قبل الاستثمار: تقرأ دخلك ومصروفاتك ومدخراتك وصندوق طوارئك، ثم تقارنها بحالة السوق لتعرض لك فرصًا استثمارية مرتّبة حسب ملاءمتها لوضعك أنت — لا حسب سعر الأصل فقط.",
    en: "Thamar helps you understand your financial sustainability before investing: it reads your income, expenses, savings and emergency fund, compares them with market conditions, and ranks investment options by how well they fit your situation — not by asset price alone.",
  },
  aboutPoint1: { ar: "استدامة مالية أولًا", en: "Sustainability first" },
  aboutPoint1Body: {
    ar: "نقيس قدرتك على تغطية مصروفاتك وبناء صندوق طوارئ قبل أي توصية استثمارية.",
    en: "We measure your ability to cover expenses and build an emergency fund before any recommendation.",
  },
  aboutPoint2: { ar: "قرار مبني على بيانتين", en: "Two-sided decisions" },
  aboutPoint2Body: {
    ar: "التوصيات تجمع بياناتك الشخصية مع مؤشرات السوق معًا.",
    en: "Recommendations blend your personal data with market indicators.",
  },
  aboutPoint3: { ar: "وضوح لا تعقيد", en: "Clarity, not complexity" },
  aboutPoint3Body: {
    ar: "مؤشرات ورسوم مبسّطة بالعربية والإنجليزية، بدون مصطلحات غامضة.",
    en: "Simple indicators and charts in Arabic and English, without jargon.",
  },
  getStarted: { ar: "ابدأ الاستخدام", en: "Get started" },
  assistant: { ar: "المساعد المالي الذكي", en: "Smart financial assistant" },
  assistantSub: {
    ar: "يشرح المؤشرات والمخاطر وأنواع الاستثمار بأسلوب تعليمي عام، دون أي ضمان للربح أو توصية مؤكدة.",
    en: "Explains indicators, risk and investment types in general educational terms — no profit guarantees or confirmed advice.",
  },
  assistantPh: { ar: "اسأل عن الاستدامة المالية أو معنى مؤشر معين…", en: "Ask about financial sustainability or an indicator…" },
  send: { ar: "إرسال", en: "Send" },
  thinking: { ar: "جارٍ التفكير…", en: "Thinking…" },
  assistantError: { ar: "تعذّر الحصول على رد الآن، حاول مرة أخرى.", en: "Could not get a reply right now, please try again." },
  assistantIntro: {
    ar: "مرحبًا! أنا مساعد ثَمَر التعليمي. اسألني عن الاستدامة المالية، معنى التضخم والفائدة، الفرق بين الذهب والأسهم والبيتكوين والنفط، أو كيف تقرأ نتائج المنصة.",
    en: "Hi! I'm Thamar's educational assistant. Ask me about financial sustainability, what inflation and interest mean, how gold, stocks, bitcoin and oil differ, or how to read the platform's results.",
  },
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
