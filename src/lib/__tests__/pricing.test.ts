import { describe, it, expect } from "vitest";
import {
  calculateAccountingCost,
  formatUSD,
  formatTHB,
  PRICING,
  AUDIT_REVENUE_BANDS,
  AccountingInputs,
  CORPORATE_PRICING,
  CONSULTING_PRICING,
  USD_TO_THB,
} from "../pricing";

const BASE_INPUTS: AccountingInputs = {
  accountingIntent: "full",
  revenueRange: "5k-50k",
  vatRegistered: "no",
  employeeCount: 0,
  employeePurpose: "operations",
  payrollNeeded: false,
  transactionVolume: "low",
  recurringWHT: "no",
  yearEndStatements: "yes",
  auditRequired: "no",
  catchupBacklog: "no",
};

function calc(overrides: Partial<AccountingInputs> = {}) {
  return calculateAccountingCost({ ...BASE_INPUTS, ...overrides });
}

describe("calculateAccountingCost", () => {
  describe("base case — minimal inputs", () => {
    it("returns $300/mo base with no addons", () => {
      const r = calc();
      expect(r.monthlyBase).toBe(300);
      expect(r.monthlyAddons).toHaveLength(0);
      expect(r.totalMonthly).toBe(300);
      expect(r.isCustomQuote).toBe(false);
    });

    it("includes year-end statements as annual addon", () => {
      const r = calc();
      expect(r.annualAddons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: expect.stringContaining("Year-end"), amount: 800, isFrom: true }),
        ])
      );
    });

    it("calculates correct annual total (monthly × 12 + annual addons)", () => {
      const r = calc();
      expect(r.totalAnnual).toBe(300 * 12 + 800);
    });
  });

  describe("VAT addon", () => {
    it("adds $100/mo when VAT registered", () => {
      const r = calc({ vatRegistered: "yes" });
      expect(r.monthlyAddons).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining("VAT"), amount: 100 })])
      );
      expect(r.totalMonthly).toBe(400);
    });

    it("shows VAT as potential when not sure", () => {
      const r = calc({ vatRegistered: "not-sure" });
      expect(r.potentialMonthly).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining("VAT"), amount: 100 })])
      );
      expect(r.totalMonthly).toBe(300);
      expect(r.totalMonthlyMax).toBe(400);
    });
  });

  describe("recurring WHT addon", () => {
    it("adds $100/mo when WHT is yes", () => {
      const r = calc({ recurringWHT: "yes" });
      expect(r.monthlyAddons).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining("WHT"), amount: 100 })])
      );
      expect(r.totalMonthly).toBe(400);
    });

    it("shows WHT as potential when not sure", () => {
      const r = calc({ recurringWHT: "not-sure" });
      expect(r.potentialMonthly).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 100 })])
      );
    });
  });

  describe("payroll — block model ($100 per 5 employees)", () => {
    it("1 employee = 1 block = $100", () => {
      const r = calc({ employeeCount: 1, payrollNeeded: true });
      expect(r.monthlyAddons).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining("Payroll"), amount: 100 })])
      );
    });

    it("5 employees = 1 block = $100", () => {
      const r = calc({ employeeCount: 5, payrollNeeded: true });
      const payroll = r.monthlyAddons.find((a) => a.name.includes("Payroll"));
      expect(payroll?.amount).toBe(100);
    });

    it("6 employees = 2 blocks = $200", () => {
      const r = calc({ employeeCount: 6, payrollNeeded: true });
      const payroll = r.monthlyAddons.find((a) => a.name.includes("Payroll"));
      expect(payroll?.amount).toBe(200);
    });

    it("12 employees = 3 blocks = $300", () => {
      const r = calc({ employeeCount: 12, payrollNeeded: true });
      const payroll = r.monthlyAddons.find((a) => a.name.includes("Payroll"));
      expect(payroll?.amount).toBe(300);
    });

    it("no payroll addon when payrollNeeded is false even with employees", () => {
      const r = calc({ employeeCount: 5, payrollNeeded: false });
      expect(r.monthlyAddons.find((a) => a.name.includes("Payroll"))).toBeUndefined();
    });
  });

  describe("transaction volume", () => {
    it("medium adds $200/mo surcharge", () => {
      const r = calc({ transactionVolume: "medium" });
      expect(r.monthlyAddons).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining("Medium"), amount: 200 })])
      );
      expect(r.totalMonthly).toBe(500);
    });

    it("high triggers custom quote", () => {
      const r = calc({ transactionVolume: "high" });
      expect(r.isCustomQuote).toBe(true);
    });

    it("low has no surcharge", () => {
      const r = calc({ transactionVolume: "low" });
      expect(r.monthlyAddons.find((a) => a.name.includes("volume"))).toBeUndefined();
      expect(r.isCustomQuote).toBe(false);
    });
  });

  describe("audit with revenue bands", () => {
    it("defaults to $1,000 when no band specified", () => {
      const r = calc({ auditRequired: "yes" });
      const audit = r.annualAddons.find((a) => a.name.includes("audit"));
      expect(audit?.amount).toBe(1000);
    });

    it.each([
      ["under-2m", 1000],
      ["2m-5m", 1500],
      ["5m-10m", 2000],
      ["10m-30m", 3000],
      ["30m-100m", 5000],
    ] as const)("revenue band %s → $%i audit fee", (band, expected) => {
      const r = calc({ auditRequired: "yes", auditRevenueBand: band });
      const audit = r.annualAddons.find((a) => a.name.includes("audit"));
      expect(audit?.amount).toBe(expected);
    });

    it("over-100m band uses fallback fee with isFrom flag", () => {
      const r = calc({ auditRequired: "yes", auditRevenueBand: "over-100m" });
      const audit = r.annualAddons.find((a) => a.name.includes("audit"));
      expect(audit?.amount).toBe(PRICING.AUDIT_ADDON);
      expect(audit?.isFrom).toBe(true);
    });

    it("not-sure audit goes to potential", () => {
      const r = calc({ auditRequired: "not-sure" });
      expect(r.potentialAnnual).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining("audit") })])
      );
    });
  });

  describe("combined scenario — full stack", () => {
    it("VAT + WHT + 7 employees + medium volume + audit ฿5M-10M", () => {
      const r = calc({
        vatRegistered: "yes",
        recurringWHT: "yes",
        employeeCount: 7,
        payrollNeeded: true,
        transactionVolume: "medium",
        yearEndStatements: "yes",
        auditRequired: "yes",
        auditRevenueBand: "5m-10m",
      });

      // Monthly: 300 base + 100 VAT + 100 WHT + 200 payroll (2 blocks) + 200 medium = 900
      expect(r.totalMonthly).toBe(900);
      // Annual: 900 × 12 + 800 year-end + 2000 audit = 13,600
      expect(r.totalAnnual).toBe(900 * 12 + 800 + 2000);
      expect(r.isCustomQuote).toBe(false);
    });
  });

  describe("rush fee (+30%)", () => {
    it("adds 30% surcharge to base monthly total", () => {
      const r = calc({ rushFee: true });
      // 300 base * 0.30 = 90 surcharge
      expect(r.rushFee).toBe(true);
      expect(r.rushSurcharge).toBe(90);
      expect(r.totalMonthly).toBe(390);
    });

    it("applies 30% to base + all monthly addons", () => {
      const r = calc({ vatRegistered: "yes", recurringWHT: "yes", rushFee: true });
      // (300 + 100 + 100) * 0.30 = 150
      expect(r.rushSurcharge).toBe(150);
      expect(r.totalMonthly).toBe(500 + 150);
    });

    it("rush surcharge propagates to annual total", () => {
      const r = calc({ rushFee: true });
      // (300 + 90) * 12 + 800 year-end
      expect(r.totalAnnual).toBe(390 * 12 + 800);
    });

    it("no surcharge when rushFee is false", () => {
      const r = calc({ rushFee: false });
      expect(r.rushFee).toBe(false);
      expect(r.rushSurcharge).toBe(0);
      expect(r.totalMonthly).toBe(300);
    });

    it("no surcharge when rushFee is undefined", () => {
      const r = calc();
      expect(r.rushFee).toBe(false);
      expect(r.rushSurcharge).toBe(0);
    });
  });

  describe("year-end statements", () => {
    it("not-sure puts it in potential annual", () => {
      const r = calc({ yearEndStatements: "not-sure" });
      expect(r.annualAddons.find((a) => a.name.includes("Year-end"))).toBeUndefined();
      expect(r.potentialAnnual).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining("Year-end"), amount: 800 })])
      );
    });

    it("no removes year-end from both addons and potential", () => {
      const r = calc({ yearEndStatements: "no" });
      expect(r.annualAddons.find((a) => a.name.includes("Year-end"))).toBeUndefined();
      expect(r.potentialAnnual.find((a) => a.name.includes("Year-end"))).toBeUndefined();
    });
  });
});

describe("formatUSD", () => {
  it("formats with dollar sign and comma separators", () => {
    expect(formatUSD(1000)).toBe("$1,000");
    expect(formatUSD(300)).toBe("$300");
    expect(formatUSD(13600)).toBe("$13,600");
  });
});

describe("formatTHB", () => {
  it("converts USD to THB at rate 35", () => {
    expect(formatTHB(100)).toBe("฿3,500");
    expect(formatTHB(300)).toBe("฿10,500");
  });
});

  describe("catch-up / backlog (§4.2: from 1,000 USD/year)", () => {
    it("yes adds $1,000 annual addon with isFrom", () => {
      const r = calc({ catchupBacklog: "yes" });
      const item = r.annualAddons.find((a) => a.name.includes("Catch-up"));
      expect(item).toBeDefined();
      expect(item!.amount).toBe(1000);
      expect(item!.isFrom).toBe(true);
      expect(r.catchupBacklog).toBe(true);
    });

    it("not-sure adds to potentialAnnual", () => {
      const r = calc({ catchupBacklog: "not-sure" });
      const item = r.potentialAnnual.find((a) => a.name.includes("Catch-up"));
      expect(item).toBeDefined();
      expect(item!.amount).toBe(1000);
    });

    it("no adds nothing", () => {
      const r = calc({ catchupBacklog: "no" });
      expect(r.annualAddons.find((a) => a.name.includes("Catch-up"))).toBeUndefined();
      expect(r.catchupBacklog).toBe(false);
    });

    it("catch-up + year-end both appear when both yes", () => {
      const r = calc({ yearEndStatements: "yes", catchupBacklog: "yes" });
      expect(r.annualAddons.find((a) => a.name.includes("Year-end"))).toBeDefined();
      expect(r.annualAddons.find((a) => a.name.includes("Catch-up"))).toBeDefined();
      expect(r.totalAnnual).toBe(300 * 12 + 800 + 1000);
    });
  });

  describe("monthly formula (§3.2) — matches source exactly", () => {
    it("300 + VAT + WHT + payroll(1 block) + medium = 900", () => {
      const r = calc({
        vatRegistered: "yes",
        recurringWHT: "yes",
        employeeCount: 3,
        payrollNeeded: true,
        transactionVolume: "medium",
      });
      expect(r.totalMonthly).toBe(300 + 100 + 100 + 100 + 200);
    });

    it("rush: final_monthly_total = monthly_total * 1.30", () => {
      const r = calc({
        vatRegistered: "yes",
        recurringWHT: "yes",
        employeeCount: 3,
        payrollNeeded: true,
        transactionVolume: "medium",
        rushFee: true,
      });
      const base = 300 + 100 + 100 + 100 + 200; // 800
      expect(r.totalMonthly).toBe(base + Math.round(base * 0.3));
    });
  });

  describe("full end-to-end scenario with all features", () => {
    it("VAT + WHT + 11 employees + medium + rush + year-end + catch-up + audit ฿10M-30M", () => {
      const r = calc({
        vatRegistered: "yes",
        recurringWHT: "yes",
        employeeCount: 11,
        payrollNeeded: true,
        transactionVolume: "medium",
        rushFee: true,
        yearEndStatements: "yes",
        catchupBacklog: "yes",
        auditRequired: "yes",
        auditRevenueBand: "10m-30m",
      });
      // Monthly: 300 + 100(VAT) + 100(WHT) + 300(3 blocks) + 200(medium) = 1000
      // Rush: 1000 * 0.30 = 300
      // Monthly total: 1300
      expect(r.totalMonthly).toBe(1300);
      // Annual: 1300 * 12 + 800(year-end) + 1000(catch-up) + 3000(audit) = 20,400
      expect(r.totalAnnual).toBe(1300 * 12 + 800 + 1000 + 3000);
    });
  });
});

describe("constants match pricing policy source (.md)", () => {
  describe("§3.1 Monthly accounting constants", () => {
    it("base bookkeeping = 300 USD", () => expect(PRICING.BASE_ACCOUNTING).toBe(300));
    it("VAT addon = 100 USD", () => expect(PRICING.VAT_ADDON).toBe(100));
    it("recurring WHT addon = 100 USD", () => expect(PRICING.RECURRING_WHT_ADDON).toBe(100));
    it("payroll block = 100 USD per 5 employees", () => {
      expect(PRICING.PAYROLL_BLOCK).toBe(100);
      expect(PRICING.PAYROLL_BLOCK_SIZE).toBe(5);
    });
    it("medium volume surcharge = 200 USD", () => expect(PRICING.TX_MEDIUM_ADDON).toBe(200));
    it("rush fee = 30%", () => expect(PRICING.RUSH_FEE_PERCENT).toBe(30));
  });

  describe("§4 Annual accounting constants", () => {
    it("year-end statements from 800 USD", () => expect(PRICING.YEAR_END_STATEMENTS).toBe(800));
    it("catch-up/backlog from 1,000 USD", () => expect(PRICING.CATCHUP_BACKLOG).toBe(1000));
    it("audit from 1,000 USD", () => expect(PRICING.AUDIT_ADDON).toBe(1000));
  });

  describe("§5 Corporate services constants", () => {
    it("incorporation = 2,000 USD", () => expect(CORPORATE_PRICING.INCORPORATION).toBe(2000));
    it("registered office from 2,000 USD/yr", () => expect(CORPORATE_PRICING.REGISTERED_OFFICE).toBe(2000));
    it("virtual office = 1,000 USD/yr", () => expect(CORPORATE_PRICING.VIRTUAL_OFFICE_ASSISTANCE).toBe(1000));
    it("company review = 1,000 USD", () => expect(CORPORATE_PRICING.COMPANY_REVIEW).toBe(1000));
    it("review financial addon = 500 USD", () => expect(CORPORATE_PRICING.COMPANY_REVIEW_FINANCIAL).toBe(500));
    it("review English addon = 500 USD", () => expect(CORPORATE_PRICING.COMPANY_REVIEW_ENGLISH).toBe(500));
    it("review financial+English addon = 1,000 USD", () => expect(CORPORATE_PRICING.COMPANY_REVIEW_FINANCIAL_ENGLISH).toBe(1000));
    it("structural change = 800 USD", () => expect(CORPORATE_PRICING.STRUCTURAL_CHANGE).toBe(800));
    it("corporate documents from 300 USD", () => expect(CORPORATE_PRICING.CORPORATE_DOCUMENTS).toBe(300));
    it("certified translation from 300 USD", () => expect(CORPORATE_PRICING.CERTIFIED_TRANSLATION).toBe(300));
    it("notarized translation from 500 USD", () => expect(CORPORATE_PRICING.NOTARIZED_TRANSLATION).toBe(500));
    it("full legalization from 2,000 USD", () => expect(CORPORATE_PRICING.LEGALIZATION).toBe(2000));
    it("tax residency certificate = 400 USD", () => expect(CORPORATE_PRICING.TAX_RESIDENCY).toBe(400));
    it("MOFA + consulate legalization = 400 USD", () => expect(CORPORATE_PRICING.MOFA_CONSULATE_LEGALIZATION).toBe(400));
  });

  describe("§6 Consulting services constants", () => {
    it("reduce costs from 2,000 USD", () => {
      expect(CONSULTING_PRICING.REDUCE_COSTS.price).toBe(2000);
      expect(CONSULTING_PRICING.REDUCE_COSTS.isFrom).toBe(true);
    });
    it("new market entry = 5,000 USD", () => {
      expect(CONSULTING_PRICING.NEW_MARKET.price).toBe(5000);
      expect(CONSULTING_PRICING.NEW_MARKET.isFrom).toBe(false);
    });
    it("due diligence from 2,000 USD", () => {
      expect(CONSULTING_PRICING.DUE_DILIGENCE.price).toBe(2000);
      expect(CONSULTING_PRICING.DUE_DILIGENCE.isFrom).toBe(true);
    });
    it("structure & strategy = 3,000 USD", () => {
      expect(CONSULTING_PRICING.STRUCTURE_STRATEGY.price).toBe(3000);
      expect(CONSULTING_PRICING.STRUCTURE_STRATEGY.isFrom).toBe(false);
    });
    it("bank & compliance urgent = 500 USD", () => {
      expect(CONSULTING_PRICING.BANK_COMPLIANCE.price).toBe(500);
      expect(CONSULTING_PRICING.BANK_COMPLIANCE.isFrom).toBe(false);
    });
  });

  describe("§1 Currency rules", () => {
    it("primary currency is USD (THB conversion rate exists)", () => {
      expect(USD_TO_THB).toBe(35);
    });
  });
});