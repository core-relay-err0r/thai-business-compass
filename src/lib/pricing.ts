// PND50 Pricing Constants - Easily editable

// Monthly fees (USD)
export const PRICING = {
  // Base accounting fee
  BASE_ACCOUNTING: 170, // ~6,000 THB
  
  // VAT addon (if VAT registered)
  VAT_ADDON: 70, // ~2,500 THB
  
  // Payroll
  PAYROLL_BASE: 45, // ~1,500 THB
  PAYROLL_PER_EMPLOYEE: 7, // ~250 THB
  
  // Transaction complexity
  TX_MEDIUM_ADDON: 45, // ~1,500 THB
  TX_HIGH_ADDON: 100, // ~3,500 THB
  
  // International payments
  INTL_PAYMENTS_ADDON: 35, // ~1,200 THB
  
  // Annual fees (USD)
  YEAR_END_STATEMENTS: 350, // ~12,000 THB
  AUDIT_ADDON: 700, // ~25,000 THB
} as const;

// Corporate Services - One-time fees (USD)
export const CORPORATE_PRICING = {
  INCORPORATION: 1500,
  STRUCTURAL_CHANGE: 500,
  ADDRESS_UPDATE: 300,
  ADDRESS_UPDATE_VAT: 1000,
  ADDRESS_UPDATE_OUTSIDE_BKK: 100,
  COMPANY_REVIEW: 500,
  COMPANY_REVIEW_FINANCIAL: 500,
  COMPANY_REVIEW_ENGLISH: 500,
  COMPANY_REVIEW_FINANCIAL_ENGLISH: 1000,
  OFFICE_VIRTUAL: 300,
  OFFICE_PHYSICAL: 1000,
} as const;

// Approximate THB conversion rate (for reference display)
export const USD_TO_THB = 35;

// Consulting price ranges (THB)
export const CONSULTING_PRICING = {
  REDUCE_COSTS: { min: 30000, max: 80000, timeline: "5-10 working days" },
  NEW_MARKET: { min: 50000, max: 120000, timeline: "7-14 working days" },
  DUE_DILIGENCE: { min: 40000, max: 100000, timeline: "5-10 working days" },
  STRUCTURE_STRATEGY: { min: 35000, max: 90000, timeline: "3-7 working days" },
  BANK_COMPLIANCE: { min: 25000, max: 60000, timeline: "3-5 working days" },
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
  internationalPayments: boolean;
  yearEndStatements: "yes" | "no" | "not-sure";
  auditRequired: "yes" | "no" | "not-sure";
}

export interface AccountingResult {
  monthlyBase: number;
  monthlyAddons: { name: string; amount: number; required: boolean }[];
  annualBase: number;
  annualAddons: { name: string; amount: number; required: boolean }[];
  potentialMonthly: { name: string; amount: number }[];
  potentialAnnual: { name: string; amount: number }[];
  totalMonthly: number;
  totalMonthlyMax: number;
  totalAnnual: number;
  totalAnnualMax: number;
  requiredItems: string[];
  recommendedItems: string[];
  notNeededItems: string[];
}

export function calculateAccountingCost(inputs: AccountingInputs): AccountingResult {
  const monthlyAddons: { name: string; amount: number; required: boolean }[] = [];
  const annualAddons: { name: string; amount: number; required: boolean }[] = [];
  const potentialMonthly: { name: string; amount: number }[] = [];
  const potentialAnnual: { name: string; amount: number }[] = [];
  const requiredItems: string[] = ["Monthly bookkeeping", "Tax filings"];
  const recommendedItems: string[] = [];
  const notNeededItems: string[] = [];

  // VAT
  if (inputs.vatRegistered === "yes") {
    monthlyAddons.push({ name: "VAT reporting", amount: PRICING.VAT_ADDON, required: true });
    requiredItems.push("VAT reporting & filings");
  } else if (inputs.vatRegistered === "not-sure") {
    potentialMonthly.push({ name: "VAT reporting", amount: PRICING.VAT_ADDON });
  } else {
    notNeededItems.push("VAT reporting");
  }

  // Payroll
  if (inputs.payrollNeeded && inputs.employeeCount > 0) {
    const payrollCost = PRICING.PAYROLL_BASE + (inputs.employeeCount * PRICING.PAYROLL_PER_EMPLOYEE);
    monthlyAddons.push({ name: `Payroll (${inputs.employeeCount} employees)`, amount: payrollCost, required: true });
    requiredItems.push("Payroll processing", "Social security filings");
  } else if (inputs.employeeCount > 0) {
    recommendedItems.push("Payroll processing");
  } else {
    notNeededItems.push("Payroll processing");
  }

  // Transaction complexity
  if (inputs.transactionVolume === "medium") {
    monthlyAddons.push({ name: "Medium transaction volume", amount: PRICING.TX_MEDIUM_ADDON, required: false });
    recommendedItems.push("Enhanced reconciliation");
  } else if (inputs.transactionVolume === "high") {
    monthlyAddons.push({ name: "High transaction volume", amount: PRICING.TX_HIGH_ADDON, required: false });
    requiredItems.push("Advanced reconciliation");
  }

  // International payments
  if (inputs.internationalPayments) {
    monthlyAddons.push({ name: "International payments handling", amount: PRICING.INTL_PAYMENTS_ADDON, required: false });
    recommendedItems.push("FX transaction tracking");
  } else {
    notNeededItems.push("International payment handling");
  }

  // Year-end statements
  if (inputs.yearEndStatements === "yes") {
    annualAddons.push({ name: "Annual financial statements", amount: PRICING.YEAR_END_STATEMENTS, required: true });
    requiredItems.push("Annual financial statements");
  } else if (inputs.yearEndStatements === "not-sure") {
    potentialAnnual.push({ name: "Annual financial statements", amount: PRICING.YEAR_END_STATEMENTS });
  }

  // Audit
  if (inputs.auditRequired === "yes") {
    annualAddons.push({ name: "Annual audit", amount: PRICING.AUDIT_ADDON, required: true });
    requiredItems.push("Annual audit");
  } else if (inputs.auditRequired === "not-sure") {
    potentialAnnual.push({ name: "Annual audit", amount: PRICING.AUDIT_ADDON });
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
