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
  
  // Annual fees (USD) — displayed as "From X"
  YEAR_END_STATEMENTS: 800,
  CATCHUP_BACKLOG: 1000,
  AUDIT_ADDON: 1000,
} as const;

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

// Approximate THB conversion rate (for reference display)
export const USD_TO_THB = 35;

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
}

export function calculateAccountingCost(inputs: AccountingInputs): AccountingResult {
  const monthlyAddons: { name: string; amount: number; required: boolean }[] = [];
  const annualAddons: { name: string; amount: number; required: boolean; isFrom?: boolean }[] = [];
  const potentialMonthly: { name: string; amount: number }[] = [];
  const potentialAnnual: { name: string; amount: number; isFrom?: boolean }[] = [];
  const requiredItems: string[] = ["Monthly bookkeeping", "Tax filings"];
  const recommendedItems: string[] = [];
  const notNeededItems: string[] = [];
  let isCustomQuote = false;

  // VAT
  if (inputs.vatRegistered === "yes") {
    monthlyAddons.push({ name: "VAT reporting (PP.30)", amount: PRICING.VAT_ADDON, required: true });
    requiredItems.push("VAT reporting & filings");
  } else if (inputs.vatRegistered === "not-sure") {
    potentialMonthly.push({ name: "VAT reporting (PP.30)", amount: PRICING.VAT_ADDON });
  } else {
    notNeededItems.push("VAT reporting");
  }

  // Recurring WHT
  if (inputs.recurringWHT === "yes") {
    monthlyAddons.push({ name: "Recurring WHT (PND3/PND53)", amount: PRICING.RECURRING_WHT_ADDON, required: true });
    requiredItems.push("Withholding tax filings");
  } else if (inputs.recurringWHT === "not-sure") {
    potentialMonthly.push({ name: "Recurring WHT (PND3/PND53)", amount: PRICING.RECURRING_WHT_ADDON });
  } else {
    notNeededItems.push("Recurring WHT filings");
  }

  // Payroll (block model)
  if (inputs.payrollNeeded && inputs.employeeCount > 0) {
    const blocks = Math.ceil(inputs.employeeCount / PRICING.PAYROLL_BLOCK_SIZE);
    const payrollCost = blocks * PRICING.PAYROLL_BLOCK;
    monthlyAddons.push({ name: `Payroll & social security (${inputs.employeeCount} employees)`, amount: payrollCost, required: true });
    requiredItems.push("Payroll processing", "Social security filings");
  } else if (inputs.employeeCount > 0) {
    recommendedItems.push("Payroll processing");
  } else {
    notNeededItems.push("Payroll processing");
  }

  // Transaction complexity
  if (inputs.transactionVolume === "medium") {
    monthlyAddons.push({ name: "Medium volume surcharge", amount: PRICING.TX_MEDIUM_ADDON, required: false });
    recommendedItems.push("Enhanced reconciliation");
  } else if (inputs.transactionVolume === "high") {
    isCustomQuote = true;
  }

  // Year-end statements
  if (inputs.yearEndStatements === "yes") {
    annualAddons.push({ name: "Year-end financial statements", amount: PRICING.YEAR_END_STATEMENTS, required: true, isFrom: true });
    requiredItems.push("Annual financial statements");
  } else if (inputs.yearEndStatements === "not-sure") {
    potentialAnnual.push({ name: "Year-end financial statements", amount: PRICING.YEAR_END_STATEMENTS, isFrom: true });
  }

  // Audit
  if (inputs.auditRequired === "yes") {
    annualAddons.push({ name: "Annual audit", amount: PRICING.AUDIT_ADDON, required: true, isFrom: true });
    requiredItems.push("Annual audit");
  } else if (inputs.auditRequired === "not-sure") {
    potentialAnnual.push({ name: "Annual audit", amount: PRICING.AUDIT_ADDON, isFrom: true });
  } else {
    notNeededItems.push("Annual audit");
  }

  // Calculate totals
  const monthlyBase = PRICING.BASE_ACCOUNTING;
  const annualBase = 0;
  
  const totalMonthlyAddons = monthlyAddons.reduce((sum, addon) => sum + addon.amount, 0);
  const totalAnnualAddons = annualAddons.reduce((sum, addon) => sum + addon.amount, 0);
  const totalPotentialMonthly = potentialMonthly.reduce((sum, p) => sum + p.amount, 0);
  const totalPotentialAnnual = potentialAnnual.reduce((sum, p) => sum + p.amount, 0);

  return {
    monthlyBase,
    monthlyAddons,
    annualBase,
    annualAddons,
    potentialMonthly,
    potentialAnnual,
    totalMonthly: monthlyBase + totalMonthlyAddons,
    totalMonthlyMax: monthlyBase + totalMonthlyAddons + totalPotentialMonthly,
    totalAnnual: (monthlyBase + totalMonthlyAddons) * 12 + totalAnnualAddons,
    totalAnnualMax: (monthlyBase + totalMonthlyAddons + totalPotentialMonthly) * 12 + totalAnnualAddons + totalPotentialAnnual,
    requiredItems,
    recommendedItems,
    notNeededItems,
    isCustomQuote,
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return `$${formatPrice(amount)}`;
}

export function formatTHB(amount: number): string {
  return `฿${formatPrice(Math.round(amount * USD_TO_THB))}`;
}
