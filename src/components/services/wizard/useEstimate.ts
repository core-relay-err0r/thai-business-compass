import { useMemo, useState } from "react";
import {
  AUDIT_BANDS, AuditBandKey, Cadence, CONSULTING_SERVICES, CORPORATE_SERVICES,
  DOCUMENT_SERVICES, OFFICE_PRICES, PriceMode, clampInt, getMonthlyBand,
  transactionFee, vatOf,
} from "./data";

export interface Line {
  label: string;
  usd: number;
  mode: PriceMode;
  cadence: Cadence;
  note?: string;
}

export interface Block {
  title: string;
  enabled: boolean;
  lines: Line[];
  customItems: string[];
  subtotal: number;
  vat: number;
  total: number;
  from: boolean;
}

export type OfficeContract = "annual" | "short";

export interface WizardState {
  // Monthly
  monthlyEnabled: boolean;
  transactions: number;
  employees: number;
  vatReporting: boolean;
  vatTransactions: number;
  vendorWht: boolean;
  whtTransactions: number;
  rushHandling: boolean;
  // Annual
  fiscalYears: number;
  revenueBand: AuditBandKey;
  catchUpNeeded: boolean;
  backlogYears: number;
  // Corporate
  corporate: Record<string, boolean>;
  registeredOffice: boolean;
  registeredOfficeContract: OfficeContract;
  virtualOffice: boolean;
  virtualOfficeContract: OfficeContract;
  companyReview: boolean;
  reviewFinancial: boolean;
  reviewEnglish: boolean;
  // Documents
  docFullPackage: boolean;
  docCertifiedTranslation: boolean;
  docNotarizedTranslation: boolean;
  docCountryLegalization: boolean;
  taxResidenceQuantity: number;
  taxResidenceLegalization: boolean;
  deepCompanyCheck: boolean;
  // Consulting
  consulting: Record<string, boolean>;
  // FX
  fxRate: number;
}

export const initialWizardState: WizardState = {
  monthlyEnabled: true,
  transactions: 45,
  employees: 0,
  vatReporting: false,
  vatTransactions: 50,
  vendorWht: false,
  whtTransactions: 50,
  rushHandling: false,
  fiscalYears: 0,
  revenueBand: "zero",
  catchUpNeeded: false,
  backlogYears: 1,
  corporate: {},
  registeredOffice: false,
  registeredOfficeContract: "annual",
  virtualOffice: false,
  virtualOfficeContract: "annual",
  companyReview: false,
  reviewFinancial: false,
  reviewEnglish: false,
  docFullPackage: false,
  docCertifiedTranslation: false,
  docNotarizedTranslation: false,
  docCountryLegalization: false,
  taxResidenceQuantity: 0,
  taxResidenceLegalization: false,
  deepCompanyCheck: false,
  consulting: {},
  fxRate: 32,
};

function line(label: string, usd: number, mode: PriceMode = "fixed", cadence: Cadence = "oneTime", note = ""): Line {
  return { label, usd, mode, cadence, note };
}

function makeBlock(title: string, lines: Line[], customItems: string[] = []): Block {
  const subtotal = lines.reduce((s, l) => s + l.usd, 0);
  const vat = vatOf(subtotal);
  return {
    title,
    enabled: lines.length > 0 || customItems.length > 0,
    lines, customItems, subtotal, vat, total: subtotal + vat,
    from: lines.some((l) => l.mode === "from"),
  };
}

function emptyBlock(title: string): Block {
  return { title, enabled: false, lines: [], customItems: [], subtotal: 0, vat: 0, total: 0, from: false };
}

function calcMonthly(s: WizardState): Block {
  if (!s.monthlyEnabled) return emptyBlock("Monthly accounting");
  const lines: Line[] = [];
  const customItems: string[] = [];
  const band = getMonthlyBand(s.transactions);
  if (band) {
    lines.push(line(`Monthly accounting base: ${band.label}`, band.usd, "fixed", "monthly",
      "$300/mo for 0-50 transactions, then +$100/mo per additional 50."));
  } else {
    customItems.push("Monthly accounting base for more than 1,000 commercial transactions");
  }
  if (s.vatReporting) {
    lines.push(line(`VAT filing PP.30: ${s.vatTransactions} VAT transaction${s.vatTransactions === 1 ? "" : "s"}`,
      transactionFee(s.vatTransactions), "fixed", "monthly"));
  }
  if (s.vendorWht) {
    lines.push(line(`Withholding tax on payments: ${s.whtTransactions} local payment${s.whtTransactions === 1 ? "" : "s"}`,
      transactionFee(s.whtTransactions), "fixed", "monthly"));
  }
  if (s.employees > 0) {
    const blocks = Math.ceil(s.employees / 5);
    lines.push(line(`Payroll, PND1, and social security: ${blocks} block${blocks === 1 ? "" : "s"}`,
      blocks * 100, "fixed", "monthly", "Each block covers up to 5 workers."));
  }
  if (s.rushHandling && lines.length > 0) {
    const rushBase = lines.reduce((sum, l) => sum + l.usd, 0);
    lines.push(line("Rush / late documents surcharge (+30%)", Math.round(rushBase * 0.3), "fixed", "monthly"));
  }
  return makeBlock("Monthly accounting", lines, customItems);
}

function calcAnnual(s: WizardState): Block {
  if (s.fiscalYears <= 0) return emptyBlock("Year-end report and audit");
  const lines: Line[] = [];
  const customItems: string[] = [];
  lines.push(line(`Year-end financial statements: ${s.fiscalYears} fiscal year${s.fiscalYears === 1 ? "" : "s"}`,
    800 * s.fiscalYears, "from", "yearly"));
  const band = AUDIT_BANDS[s.revenueBand];
  if (band.mode === "custom") {
    customItems.push(`Annual audit for ${band.label}`);
  } else {
    lines.push(line(`Annual audit: ${band.label}`, band.usd * s.fiscalYears, "fixed", "yearly"));
  }
  if (s.catchUpNeeded) {
    lines.push(line(`Catch-up accounting review: ${s.backlogYears} year${s.backlogYears === 1 ? "" : "s"}`,
      s.backlogYears * 1000, "from", "yearly"));
  }
  return makeBlock("Year-end report and audit", lines, customItems);
}

function calcCorporate(s: WizardState): Block {
  const lines: Line[] = [];
  for (const id of Object.keys(s.corporate)) {
    if (!s.corporate[id]) continue;
    const svc = CORPORATE_SERVICES[id];
    if (svc) lines.push(line(svc.label, svc.usd, svc.mode, svc.cadence, svc.note));
  }
  if (s.registeredOffice) {
    const o = OFFICE_PRICES.registered[s.registeredOfficeContract];
    lines.push(line(o.label, o.usd, o.mode, o.cadence, o.note));
  }
  if (s.virtualOffice) {
    const o = OFFICE_PRICES.virtual[s.virtualOfficeContract];
    lines.push(line(o.label, o.usd, o.mode, o.cadence, o.note));
  }
  if (s.companyReview) {
    lines.push(line("Company structural review", 1000, "fixed", "oneTime"));
    if (s.reviewFinancial) lines.push(line("Company review: financial add-on", 500, "fixed", "oneTime"));
    if (s.reviewEnglish) lines.push(line("Company review: English version add-on", 500, "fixed", "oneTime"));
  }
  if (s.docFullPackage) {
    const d = DOCUMENT_SERVICES.fullPackage; lines.push(line(d.label, d.usd, d.mode, d.cadence, d.note));
  }
  if (s.docCertifiedTranslation) {
    const d = DOCUMENT_SERVICES.certifiedTranslation; lines.push(line(d.label, d.usd, d.mode, d.cadence));
  }
  if (s.docNotarizedTranslation) {
    const d = DOCUMENT_SERVICES.notarizedTranslation; lines.push(line(d.label, d.usd, d.mode, d.cadence));
  }
  if (s.docCountryLegalization) {
    const d = DOCUMENT_SERVICES.countryLegalization; lines.push(line(d.label, d.usd, d.mode, d.cadence, d.note));
  }
  if (s.taxResidenceQuantity > 0) {
    const q = s.taxResidenceQuantity;
    lines.push(line(`Tax residency certificate: ${q} certificate${q === 1 ? "" : "s"}`, q * 400, "fixed", "oneTime", "$400 per certificate."));
    if (s.taxResidenceLegalization) {
      lines.push(line(`Tax residency certificate consulate legalization: ${q} certificate${q === 1 ? "" : "s"}`,
        q * DOCUMENT_SERVICES.taxResidenceLegalization.usd, "fixed", "oneTime"));
    }
  }
  if (s.deepCompanyCheck) {
    const d = DOCUMENT_SERVICES.deepCompanyCheck; lines.push(line(d.label, d.usd, d.mode, d.cadence, d.note));
  }
  return makeBlock("Corporate services", lines);
}

function calcConsulting(s: WizardState): Block {
  const lines: Line[] = [];
  const customItems: string[] = [];
  for (const id of Object.keys(s.consulting)) {
    if (!s.consulting[id]) continue;
    const svc = CONSULTING_SERVICES[id];
    if (!svc) continue;
    if (svc.mode === "custom") customItems.push(svc.label);
    else lines.push(line(svc.label, svc.usd, svc.mode, svc.cadence, svc.note));
  }
  return makeBlock("Consulting services", lines, customItems);
}

export interface Totals {
  monthly: { total: number; from: boolean; customItems: string[] };
  yearly: { total: number; from: boolean; customItems: string[] };
  oneTime: { total: number; from: boolean; customItems: string[] };
  dueNow: { total: number; from: boolean; customItems: string[] };
  firstYear: { total: number; from: boolean; customItems: string[] };
}

function bucket(lines: Line[], customItems: string[]) {
  const subtotal = lines.reduce((s, l) => s + l.usd, 0);
  return {
    total: subtotal + vatOf(subtotal),
    from: lines.some((l) => l.mode === "from"),
    customItems,
  };
}

function calcTotals(blocks: Block[]): Totals {
  const [monthly, annual, corporate, consulting] = blocks;
  const allLines = blocks.flatMap((b) => b.lines);
  const m = bucket(allLines.filter((l) => l.cadence === "monthly"), monthly.customItems);
  const y = bucket(allLines.filter((l) => l.cadence === "yearly"), annual.customItems);
  const o = bucket(allLines.filter((l) => l.cadence === "oneTime"), [...corporate.customItems, ...consulting.customItems]);
  const dueNow = {
    total: m.total + y.total + o.total,
    from: m.from || y.from || o.from,
    customItems: [...m.customItems, ...y.customItems, ...o.customItems],
  };
  const firstYear = {
    total: m.total * 12 + y.total + o.total,
    from: dueNow.from,
    customItems: dueNow.customItems,
  };
  return { monthly: m, yearly: y, oneTime: o, dueNow, firstYear };
}

export function useEstimate() {
  const [state, setStateRaw] = useState<WizardState>(initialWizardState);

  const setState = (patch: Partial<WizardState> | ((s: WizardState) => Partial<WizardState>)) => {
    setStateRaw((prev) => {
      const p = typeof patch === "function" ? patch(prev) : patch;
      return { ...prev, ...p };
    });
  };

  // Sanitize derived fields each render
  const safeState: WizardState = useMemo(() => ({
    ...state,
    transactions: clampInt(state.transactions, 0, 100000),
    employees: clampInt(state.employees, 0, 10000),
    vatTransactions: clampInt(state.vatTransactions, 0, 100000),
    whtTransactions: clampInt(state.whtTransactions, 0, 100000),
    fiscalYears: clampInt(state.fiscalYears, 0, 5),
    backlogYears: clampInt(state.backlogYears, 1, 5),
    taxResidenceQuantity: clampInt(state.taxResidenceQuantity, 0, 100),
    fxRate: Math.max(1, Number(state.fxRate) || 32),
  }), [state]);

  const blocks = useMemo(() => [
    calcMonthly(safeState), calcAnnual(safeState), calcCorporate(safeState), calcConsulting(safeState),
  ], [safeState]);

  const totals = useMemo(() => calcTotals(blocks), [blocks]);

  const reset = () => setStateRaw(initialWizardState);

  return { state: safeState, setState, blocks, totals, reset };
}