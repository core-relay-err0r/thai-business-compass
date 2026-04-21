import { describe, it, expect } from "vitest";
import {
  calculateAccountingCost,
  formatUSD,
  formatTHB,
  PRICING,
  AUDIT_REVENUE_BANDS,
  AccountingInputs,
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