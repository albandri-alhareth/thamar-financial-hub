/**
 * Demo data layer for Thamar.
 *
 * Every function here mimics an async API call so the UI is already wired for a
 * real backend later: swap the body for a fetch()/server-function call and keep
 * the same return shapes. No API keys or secrets belong in this file.
 */

export type AssetKey = "gold" | "stocks" | "bitcoin" | "oil";
export type RiskLevel = "low" | "medium" | "high";

export type PersonalProfile = {
  income: number;
  expenses: number;
  savings: number;
  emergencyFund: number;
  investable: number;
  savingRate: number; // 0-100
  sustainability: number; // 0-100
  monthlyEmergencyTarget: number;
};

export type MonthlyPoint = {
  month: string;
  monthEn: string;
  income: number;
  expenses: number;
  savings: number;
  emergencyFund: number;
};

export type AllocationSlice = { key: AssetKey | "cash"; value: number };

export type MarketPoint = {
  month: string;
  gold: number;
  stocks: number;
  bitcoin: number;
  oil: number;
};

export type ExternalIndicator = {
  key: AssetKey | "inflation" | "interest";
  value: string;
  changePct: number;
};

export type Opportunity = {
  key: AssetKey;
  suitability: number; // 0-100
  estReturn: number; // % annual
  risk: RiskLevel;
  reasonAr: string;
  reasonEn: string;
};

const delay = <T,>(data: T) => Promise.resolve(data);

export const getPersonalProfile = () =>
  delay<PersonalProfile>({
    income: 18500,
    expenses: 11200,
    savings: 62400,
    emergencyFund: 33600,
    investable: 4500,
    savingRate: 39,
    sustainability: 72,
    monthlyEmergencyTarget: 67200,
  });

export const getPersonalHistory = () =>
  delay<MonthlyPoint[]>([
    { month: "مارس", monthEn: "Mar", income: 17200, expenses: 12100, savings: 44300, emergencyFund: 24000 },
    { month: "أبريل", monthEn: "Apr", income: 17200, expenses: 11800, savings: 48200, emergencyFund: 26400 },
    { month: "مايو", monthEn: "May", income: 18000, expenses: 12600, savings: 51400, emergencyFund: 28100 },
    { month: "يونيو", monthEn: "Jun", income: 18000, expenses: 11000, savings: 55600, emergencyFund: 30200 },
    { month: "يوليو", monthEn: "Jul", income: 18500, expenses: 11500, savings: 59100, emergencyFund: 31900 },
    { month: "أغسطس", monthEn: "Aug", income: 18500, expenses: 11200, savings: 62400, emergencyFund: 33600 },
  ]);

export const getAllocation = () =>
  delay<AllocationSlice[]>([
    { key: "cash", value: 38 },
    { key: "gold", value: 24 },
    { key: "stocks", value: 26 },
    { key: "bitcoin", value: 7 },
    { key: "oil", value: 5 },
  ]);

export const getMarketTrends = () =>
  delay<MarketPoint[]>([
    { month: "Sep", gold: 100, stocks: 100, bitcoin: 100, oil: 100 },
    { month: "Oct", gold: 102, stocks: 101, bitcoin: 112, oil: 97 },
    { month: "Nov", gold: 105, stocks: 104, bitcoin: 128, oil: 94 },
    { month: "Dec", gold: 107, stocks: 106, bitcoin: 141, oil: 96 },
    { month: "Jan", gold: 111, stocks: 105, bitcoin: 133, oil: 99 },
    { month: "Feb", gold: 114, stocks: 108, bitcoin: 149, oil: 101 },
    { month: "Mar", gold: 118, stocks: 110, bitcoin: 138, oil: 98 },
    { month: "Apr", gold: 121, stocks: 112, bitcoin: 152, oil: 95 },
    { month: "May", gold: 124, stocks: 115, bitcoin: 161, oil: 93 },
    { month: "Jun", gold: 127, stocks: 117, bitcoin: 147, oil: 96 },
    { month: "Jul", gold: 130, stocks: 120, bitcoin: 158, oil: 99 },
    { month: "Aug", gold: 134, stocks: 122, bitcoin: 166, oil: 97 },
  ]);

export const getExternalIndicators = () =>
  delay<ExternalIndicator[]>([
    { key: "gold", value: "2,480 $/oz", changePct: 1.8 },
    { key: "stocks", value: "5,610 pts", changePct: 0.9 },
    { key: "bitcoin", value: "64,300 $", changePct: -2.4 },
    { key: "oil", value: "78.4 $/bbl", changePct: -1.1 },
    { key: "inflation", value: "2.3%", changePct: -0.2 },
    { key: "interest", value: "4.75%", changePct: 0.0 },
  ]);

export const getOpportunities = () =>
  delay<Opportunity[]>([
    {
      key: "gold",
      suitability: 86,
      estReturn: 7.5,
      risk: "low",
      reasonAr: "اتجاه صاعد مستقر وتضخم منخفض، ويناسب صندوق طوارئك القريب من الاكتمال ومعدل ادخارك الجيد.",
      reasonEn: "Steady uptrend with cooling inflation; fits your near-complete emergency fund and healthy saving rate.",
    },
    {
      key: "stocks",
      suitability: 74,
      estReturn: 9.2,
      risk: "medium",
      reasonAr: "نمو تدريجي مع تقلب معتدل، مناسب لجزء من المبلغ المتاح للاستثمار على مدى متوسط.",
      reasonEn: "Gradual growth with moderate volatility; suits part of your investable amount over the medium term.",
    },
    {
      key: "bitcoin",
      suitability: 41,
      estReturn: 18.0,
      risk: "high",
      reasonAr: "عائد محتمل مرتفع لكن تقلبه يفوق قدرة محفظتك الحالية على الامتصاص، يُقترح وزن صغير فقط.",
      reasonEn: "High potential return, but volatility exceeds what your current buffer absorbs — small weight only.",
    },
    {
      key: "oil",
      suitability: 38,
      estReturn: 4.1,
      risk: "high",
      reasonAr: "اتجاه متذبذب وضعيف نسبيًا مع ضغط على الطلب، ملاءمته محدودة لأهدافك الحالية.",
      reasonEn: "Choppy, relatively weak trend with demand pressure — limited fit for your current goals.",
    },
  ]);
