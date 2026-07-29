// PND50 Pricing Constants - Easily editable

// Monthly fees (USD)
export const PRICING = {
  // Base accounting fee (up to 50 transactions/month)
  BASE_ACCOUNTING: 300,
  
  // VAT addon (PP.30)
  VAT_ADDON: 100,
  
  // Recurring withholding filings (PND3/PND53)
  RECURRING_WHT_ADDON: 100,
  
  // Payroll (block model)
  PAYROLL_BLOCK: 100, // per block of up to 5 employees
  PAYROLL_BLOCK_SIZE: 5,
  
  // Transaction complexity
  TX_MEDIUM_ADDON: 200, // >50 transactions/month
  // High volume = custom quote (no fixed constant)

  // Rush fee multiplier (30%)
  RUSH_FEE_PERCENT: 30,

  // Annual fees (USD) — displayed as "From X"
  YEAR_END_STATEMENTS: 800,
  CATCHUP_BACKLOG: 1000,
  AUDIT_ADDON: 2000,
  ANNUAL_PREPARATION_PERCENT: 30,
} as const;

// Audit revenue band pricing (USD)
export const AUDIT_REVENUE_BANDS = [
  { id: "under-2m", label: "Under ฿2M", auditFee: 2000 },
  { id: "2m-5m", label: "฿2M – ฿5M", auditFee: 3000 },
  { id: "5m-10m", label: "฿5M – ฿10M", auditFee: 4000 },
  { id: "10m-30m", label: "฿10M – ฿30M", auditFee: 6000 },
  { id: "30m-100m", label: "฿30M – ฿100M", auditFee: 10000 },
  { id: "over-100m", label: "Over ฿100M", auditFee: null },
] as const;

export function calculateAnnualPreparationFee(auditFee: number): number {
  return Math.round(auditFee * PRICING.ANNUAL_PREPARATION_PERCENT / 100);
}

export type AuditRevenueBand = typeof AUDIT_REVENUE_BANDS[number]["id"] | "not-sure";

// Corporate Services - Fixed-fee turnkey (USD)
export const CORPORATE_PRICING = {
  // Setup & Office
  INCORPORATION: 2000,
  REGISTERED_OFFICE: 2000, // per year, displayed as "From"
  VIRTUAL_OFFICE_ASSISTANCE: 1000, // per year
  
  // Reviews & Changes
  COMPANY_REVIEW: 1000,
  COMPANY_REVIEW_FINANCIAL: 500,
  COMPANY_REVIEW_ENGLISH: 500,
  COMPANY_REVIEW_FINANCIAL_ENGLISH: 1000,
  STRUCTURAL_CHANGE: 800,
  
  // Documents & Legalization
  CORPORATE_DOCUMENTS: 300, // displayed as "From"
  CERTIFIED_TRANSLATION: 300, // displayed as "From"
  NOTARIZED_TRANSLATION: 500, // displayed as "From"
  LEGALIZATION: 2000, // full package, displayed as "From"
  TAX_RESIDENCY: 400,
  MOFA_CONSULATE_LEGALIZATION: 400,
} as const;

// Simple fixed commercial conversion used consistently across the site.
// Legacy price constants remain USD-denominated internally; every public price is rendered in THB.
export const USD_TO_THB = 33;

// Consulting services (USD)
export const CONSULTING_PRICING = {
  REDUCE_COSTS: { price: 2000, isFrom: true, timeline: "5–10 working days" },
  NEW_MARKET: { price: 5000, isFrom: false, timeline: "7–14 working days" },
  DUE_DILIGENCE: { price: 2000, isFrom: true, timeline: "5–30 working days" },
  STRUCTURE_STRATEGY: { price: 3000, isFrom: false, timeline: "3–7 working days" },
  BANK_COMPLIANCE: { price: 500, isFrom: false, timeline: "1 working day", note: "For urgent stuck payment issues. Complex situations quoted separately." },
} as const;

// Calculate accounting cost based on user inputs
export interface AccountingInputs {
  accountingIntent: "full" | "year-end-only";
  revenueRange: "0-5k" | "5k-50k" | "50k-100k" | "100k-1m" | "1m+";
  vatRegistered: "yes" | "no" | "not-sure";
  employeeCount: number;
  employeePurpose: "operations" | "visa" | "not-sure";
  payrollNeeded: boolean;
  transactionVolume: "low" | "medium" | "high";
  recurringWHT: "yes" | "no" | "not-sure";
  yearEndStatements: "yes" | "no" | "not-sure";
  auditRequired: "yes" | "no" | "not-sure";
  auditRevenueBand?: AuditRevenueBand;
  rushFee?: boolean;
  catchupBacklog: "yes" | "no" | "not-sure";
}

export interface AccountingResult {
  monthlyBase: number;
  monthlyAddons: { name: string; amount: number; required: boolean }[];
  annualBase: number;
  annualAddons: { name: string; amount: number; required: boolean; isFrom?: boolean }[];
  potentialMonthly: { name: string; amount: number }[];
  potentialAnnual: { name: string; amount: number; isFrom?: boolean }[];
  totalMonthly: number;
  totalMonthlyMax: number;
  totalAnnual: number;
  totalAnnualMax: number;
  requiredItems: string[];
  recommendedItems: string[];
  notNeededItems: string[];
  isCustomQuote: boolean;
  rushFee: boolean;
  rushSurcharge: number;
  catchupBacklog: boolean;
}

export function calculateAccountingCost(inputs: AccountingInputs): AccountingResult {
  const monthlyAddons: { name: string; amount: number; required: boolean }[] = [];
  const annualAddons: { name: string; amount: number; required: boolean; isFrom?: boolean }[] = [];
  const potentialMonthly: { name: string; amount: number }[] = [];
  const potentialAnnual: { name: string; amount: number; isFrom?: boolean }[] = [];
  const isMonthlyEngagement = inputs.accountingIntent === "full";
  const requiredItems: string[] = isMonthlyEngagement ? ["Monthly bookkeeping", "Tax filings"] : [];
  const recommendedItems: string[] = [];
  const notNeededItems: string[] = [];
  let isCustomQuote = false;

  // Monthly obligations only apply to a full accounting engagement.
  if (isMonthlyEngagement && inputs.vatRegistered === "yes") {
    monthlyAddons.push({ name: "VAT reporting (PP.30)", amount: PRICING.VAT_ADDON, required: true });
    requiredItems.push("VAT reporting & filings");
  } else if (isMonthlyEngagement && inputs.vatRegistered === "not-sure") {
    potentialMonthly.push({ name: "VAT reporting (PP.30)", amount: PRICING.VAT_ADDON });
  } else if (isMonthlyEngagement) {
    notNeededItems.push("VAT reporting");
  }

  // Recurring WHT
  if (isMonthlyEngagement && inputs.recurringWHT === "yes") {
    monthlyAddons.push({ name: "Recurring WHT (PND3/PND53)", amount: PRICING.RECURRING_WHT_ADDON, required: true });
    requiredItems.push("Withholding tax filings");
  } else if (isMonthlyEngagement && inputs.recurringWHT === "not-sure") {
    potentialMonthly.push({ name: "Recurring WHT (PND3/PND53)", amount: PRICING.RECURRING_WHT_ADDON });
  } else if (isMonthlyEngagement) {
    notNeededItems.push("Recurring WHT filings");
  }

  // Payroll (block model)
  if (isMonthlyEngagement && inputs.payrollNeeded && inputs.employeeCount > 0) {
    const blocks = Math.ceil(inputs.employeeCount / PRICING.PAYROLL_BLOCK_SIZE);
    const payrollCost = blocks * PRICING.PAYROLL_BLOCK;
    monthlyAddons.push({ name: `Payroll & social security (${inputs.employeeCount} employees)`, amount: payrollCost, required: true });
    requiredItems.push("Payroll processing", "Social security filings");
  } else if (isMonthlyEngagement && inputs.employeeCount > 0) {
    recommendedItems.push("Payroll processing");
  } else if (isMonthlyEngagement) {
    notNeededItems.push("Payroll processing");
  }

  // Transaction complexity
  if (isMonthlyEngagement && inputs.transactionVolume === "medium") {
    monthlyAddons.push({ name: "Medium volume surcharge", amount: PRICING.TX_MEDIUM_ADDON, required: false });
    recommendedItems.push("Enhanced reconciliation");
  } else if (isMonthlyEngagement && inputs.transactionVolume === "high") {
    isCustomQuote = true;
  }

  if (!isMonthlyEngagement) {
    const band = inputs.auditRevenueBand && inputs.auditRevenueBand !== "not-sure"
      ? AUDIT_REVENUE_BANDS.find((item) => item.id === inputs.auditRevenueBand)
      : undefined;
    const auditFee = band?.auditFee ?? (band ? 0 : PRICING.AUDIT_ADDON);

    if (band?.auditFee === null) {
      isCustomQuote = true;
      annualAddons.push({ name: "Accounting reconstruction & financial statements", amount: 0, required: true });
      annualAddons.push({ name: "Independent annual audit", amount: 0, required: true });
    } else {
      annualAddons.push({
        name: "Accounting reconstruction & financial statements",
        amount: calculateAnnualPreparationFee(auditFee),
        required: true,
        isFrom: true,
      });
      annualAddons.push({ name: "Independent annual audit", amount: auditFee, required: true, isFrom: !band });
    }
    requiredItems.push("Accounting reconstruction & financial statements", "Independent annual audit");
  } else {
    // Existing monthly clients only need the annual services selected below; no reconstruction is added.
    if (inputs.yearEndStatements === "yes") {
      annualAddons.push({ name: "Year-end financial statements", amount: PRICING.YEAR_END_STATEMENTS, required: true, isFrom: true });
      requiredItems.push("Annual financial statements");
    } else if (inputs.yearEndStatements === "not-sure") {
      potentialAnnual.push({ name: "Year-end financial statements", amount: PRICING.YEAR_END_STATEMENTS, isFrom: true });
    }

    if (inputs.auditRequired === "yes") {
      const band = inputs.auditRevenueBand && inputs.auditRevenueBand !== "not-sure"
        ? AUDIT_REVENUE_BANDS.find((item) => item.id === inputs.auditRevenueBand)
        : undefined;
      const auditFee = band?.auditFee ?? (band ? 0 : PRICING.AUDIT_ADDON);
      if (band?.auditFee === null) isCustomQuote = true;
      annualAddons.push({ name: "Independent annual audit", amount: auditFee, required: true, isFrom: !band });
      requiredItems.push("Independent annual audit");
    } else if (inputs.auditRequired === "not-sure") {
      potentialAnnual.push({ name: "Independent annual audit", amount: PRICING.AUDIT_ADDON, isFrom: true });
    } else {
      notNeededItems.push("Independent annual audit");
    }

    if (inputs.catchupBacklog === "yes") {
      annualAddons.push({ name: "Catch-up / backlog year-end work", amount: PRICING.CATCHUP_BACKLOG, required: true, isFrom: true });
      requiredItems.push("Catch-up / backlog work");
    } else if (inputs.catchupBacklog === "not-sure") {
      potentialAnnual.push({ name: "Catch-up / backlog year-end work", amount: PRICING.CATCHUP_BACKLOG, isFrom: true });
    } else {
      notNeededItems.push("Catch-up / backlog work");
    }
  }

  // Calculate totals
  const monthlyBase = isMonthlyEngagement ? PRICING.BASE_ACCOUNTING : 0;
  const annualBase = 0;
  
  const totalMonthlyAddons = monthlyAddons.reduce((sum, addon) => sum + addon.amount, 0);
  const totalAnnualAddons = annualAddons.reduce((sum, addon) => sum + addon.amount, 0);
  const totalPotentialMonthly = potentialMonthly.reduce((sum, p) => sum + p.amount, 0);
  const totalPotentialAnnual = potentialAnnual.reduce((sum, p) => sum + p.amount, 0);

  const baseMonthlyTotal = monthlyBase + totalMonthlyAddons;
  const rushActive = inputs.rushFee === true;
  const rushSurcharge = rushActive ? Math.round(baseMonthlyTotal * PRICING.RUSH_FEE_PERCENT / 100) : 0;

  return {
    monthlyBase,
    monthlyAddons,
    annualBase,
    annualAddons,
    potentialMonthly,
    potentialAnnual,
    totalMonthly: baseMonthlyTotal + rushSurcharge,
    totalMonthlyMax: baseMonthlyTotal + rushSurcharge + totalPotentialMonthly,
    totalAnnual: (baseMonthlyTotal + rushSurcharge) * 12 + totalAnnualAddons,
    totalAnnualMax: (baseMonthlyTotal + rushSurcharge + totalPotentialMonthly) * 12 + totalAnnualAddons + totalPotentialAnnual,
    requiredItems,
    recommendedItems,
    notNeededItems,
    isCustomQuote,
    rushFee: rushActive,
    rushSurcharge,
    catchupBacklog: inputs.catchupBacklog === "yes",
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTHB(amountInUSD: number): string {
  return `฿${formatPrice(Math.round(amountInUSD * USD_TO_THB))}`;
}

export function formatUSD(amountInUSD: number): string {
  return `$${formatPrice(amountInUSD)} (approx. ${formatTHB(amountInUSD)})`;
}
