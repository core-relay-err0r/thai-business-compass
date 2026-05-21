// Pricing & catalog constants for the /services wizard.
// Mirrors the uploaded reference (thai-accounting-calculator-test-main).

export const VAT_RATE = 0.07;

export type Cadence = "monthly" | "yearly" | "oneTime";
export type PriceMode = "fixed" | "from" | "custom";

export interface CatalogItem {
  label: string;
  usd: number;
  mode: PriceMode;
  cadence: Cadence;
  note?: string;
}

export const AUDIT_BANDS = {
  zero: { label: "Zero income", thb: 25000, usd: 781, mode: "fixed" as PriceMode },
  up_to_1m: { label: "Up to 1 million THB", thb: 30000, usd: 938, mode: "fixed" as PriceMode },
  "1m_to_5m": { label: "1+ million to 5 million THB", thb: 35000, usd: 1094, mode: "fixed" as PriceMode },
  "5m_to_10m": { label: "5+ million to 10 million THB", thb: 40000, usd: 1250, mode: "fixed" as PriceMode },
  "10m_to_15m": { label: "10+ million to 15 million THB", thb: 60000, usd: 1875, mode: "fixed" as PriceMode },
  "15m_to_20m": { label: "15+ million to 20 million THB", thb: 70000, usd: 2188, mode: "fixed" as PriceMode },
  "20m_to_30m": { label: "20+ million to 30 million THB", thb: 80000, usd: 2500, mode: "fixed" as PriceMode },
  "30m_to_50m": { label: "30+ million to 50 million THB", thb: 90000, usd: 2813, mode: "fixed" as PriceMode },
  "50m_to_70m": { label: "50+ million to 70 million THB", thb: 100000, usd: 3125, mode: "fixed" as PriceMode },
  "70m_to_100m": { label: "70+ million to 100 million THB", thb: 155000, usd: 4844, mode: "fixed" as PriceMode },
  "100m_to_200m": { label: "100+ million to 200 million THB", thb: 300000, usd: 9375, mode: "fixed" as PriceMode },
  "200m_to_300m": { label: "200+ million to 300 million THB", thb: 400000, usd: 12500, mode: "fixed" as PriceMode },
  more_than_300m: { label: "More than 300 million THB", thb: 0, usd: 0, mode: "custom" as PriceMode },
} as const;

export type AuditBandKey = keyof typeof AUDIT_BANDS;

export const CORPORATE_SERVICES: Record<string, CatalogItem> = {
  incorporation: { label: "Company incorporation", usd: 2000, mode: "from", cadence: "oneTime", note: "Base setup for a new Thai company." },
  incorporationVat: { label: "VAT registration add-on", usd: 300, mode: "fixed", cadence: "oneTime", note: "Register the new company for VAT after incorporation." },
  incorporationSocialSecurity: { label: "Social Security registration add-on", usd: 300, mode: "fixed", cadence: "oneTime", note: "Employer registration for payroll and social security filings." },
  directorChange: { label: "Director change", usd: 300, mode: "fixed", cadence: "oneTime" },
  shareholderNoShareChange: { label: "Shareholder change without share structure change", usd: 300, mode: "fixed", cadence: "oneTime" },
  shareholderStructureChange: { label: "Shareholder change with share structure change", usd: 500, mode: "fixed", cadence: "oneTime" },
  addressChangeNonVat: { label: "Company address change: non-VAT company", usd: 300, mode: "fixed", cadence: "oneTime" },
  addressChangeVat: { label: "Company address change: VAT registered company", usd: 1000, mode: "fixed", cadence: "oneTime" },
};

export const OFFICE_PRICES = {
  registered: {
    annual: { label: "Registered office: annual contract", usd: 6000, mode: "from" as PriceMode, cadence: "yearly" as Cadence, note: "$500/mo effective, $6,000/year." },
    short: { label: "Registered office: contract under 1 year", usd: 700, mode: "from" as PriceMode, cadence: "monthly" as Cadence, note: "$700/mo." },
  },
  virtual: {
    annual: { label: "Virtual office: annual contract", usd: 3600, mode: "from" as PriceMode, cadence: "yearly" as Cadence, note: "$300/mo effective, $3,600/year." },
    short: { label: "Virtual office: contract under 1 year", usd: 350, mode: "from" as PriceMode, cadence: "monthly" as Cadence, note: "$350/mo." },
  },
};

export const DOCUMENT_SERVICES: Record<string, CatalogItem> = {
  fullPackage: { label: "Thai company full document package", usd: 300, mode: "fixed", cadence: "oneTime", note: "Financials, shareholder list, memorandum, certificates, affidavit." },
  certifiedTranslation: { label: "Certified translator translation", usd: 300, mode: "fixed", cadence: "oneTime" },
  notarizedTranslation: { label: "Notary translation / notarized support", usd: 500, mode: "fixed", cadence: "oneTime" },
  countryLegalization: { label: "Country legalization via consulate", usd: 1700, mode: "from", cadence: "oneTime", note: "Consulate fees and route vary by country." },
  taxResidenceLegalization: { label: "Tax residency certificate: consulate legalization", usd: 400, mode: "fixed", cadence: "oneTime", note: "$400 per certificate." },
  deepCompanyCheck: { label: "Deep company document check", usd: 2000, mode: "fixed", cadence: "oneTime", note: "Public-source request and AI-assisted risk analysis." },
};

export const CONSULTING_SERVICES: Record<string, CatalogItem> = {
  reduceCosts: { label: "Reduce costs", usd: 2000, mode: "from", cadence: "oneTime", note: "Find compliance and accounting costs that can be reduced safely." },
  newMarket: { label: "New market entry", usd: 5000, mode: "fixed", cadence: "oneTime", note: "Entity, tax, banking, licensing path before spending on expansion." },
  dueDiligence: { label: "Due diligence", usd: 2000, mode: "from", cadence: "oneTime", note: "Corporate check before acquisition, partner, or investment." },
  structureStrategy: { label: "Structure and strategy", usd: 3000, mode: "fixed", cadence: "oneTime", note: "Shareholders, tax, banking, and next actions in one plan." },
  bankUrgent: { label: "Urgent stuck payment issue", usd: 500, mode: "fixed", cadence: "oneTime", note: "For blocked, frozen, or compliance-held payments." },
  bankSmall: { label: "Bank login, activation, or small issue", usd: 300, mode: "fixed", cadence: "oneTime" },
  bankComplex: { label: "Complex bank / compliance case", usd: 0, mode: "custom", cadence: "oneTime" },
};

// ---------- helpers ----------

const usdFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const thbFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

export function clampInt(value: number | string, min: number, max = Infinity) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function vatOf(subtotal: number) {
  return Math.round(subtotal * VAT_RATE);
}
export function totalWithVat(subtotal: number) {
  return subtotal + vatOf(subtotal);
}
export function formatUsd(value: number, prefix = "") {
  return `${prefix}${usdFmt.format(Math.round(value))}`;
}
export function formatThbFromUsd(usd: number, fx: number, prefix = "") {
  return `${prefix}${thbFmt.format(Math.round(usd * fx))} reference`;
}
export function priceImpactText(usd: number, opts: { mode?: PriceMode; period?: string } = {}) {
  const { mode = "fixed", period = "" } = opts;
  if (mode === "custom") return "Custom quote";
  const prefix = mode === "from" ? "From +" : "+";
  return `${prefix}${usdFmt.format(Math.round(usd))}${period} before VAT | ${prefix}${usdFmt.format(totalWithVat(usd))}${period} incl. VAT`;
}

export function transactionFee(count: number) {
  return Math.max(1, Math.ceil(Math.max(0, count) / 50)) * 100;
}
export function transactionRangeLabel(blocks: number) {
  if (blocks <= 1) return "0-50 transactions";
  const min = (blocks - 1) * 50 + 1;
  const max = blocks * 50;
  return `${min}-${max} transactions`;
}
export function getMonthlyBand(transactions: number) {
  if (transactions > 1000) return null;
  const blocks = Math.max(1, Math.ceil(Math.max(0, transactions) / 50));
  return { blocks, usd: 300 + (blocks - 1) * 100, label: transactionRangeLabel(blocks) };
}