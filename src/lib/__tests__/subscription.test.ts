import {
  captureSubscriptionAttribution,
  inferSubscriptionInterest,
  markSubscriptionDismissed,
  markSubscriptionSuccessful,
  POPUP_DISMISSAL_MS,
  resolveSubscriptionLanguage,
  shouldSuppressPopup,
  SUBSCRIPTION_STORAGE_KEYS,
} from "@/lib/subscription";

describe("subscription segmentation", () => {
  it.each([
    ["/blog/bookkeeping-thailand-foreign-owned-company-monthly-workflow", "bookkeeping"],
    ["/blog/pnd50-vs-pnd51-thailand-corporate-income-tax", "tax_filing"],
    ["/blog/vat-registration-thailand-1-8-million-threshold-pp30", "vat"],
    ["/blog/thai-withholding-tax-companies-pnd1-pnd3-pnd53", "withholding_tax"],
    ["/blog/payroll-social-security-thailand", "payroll"],
    ["/blog/thailand-company-registration-foreign-founders", "company_registration"],
    ["/blog/director-change-thailand", "corporate_changes"],
    ["/services#accounting", "bookkeeping"],
    ["/services#corporate", "company_registration"],
    ["/", "general_thailand_compliance"],
  ])("maps %s to %s", (page, expected) => {
    expect(inferSubscriptionInterest(page)).toBe(expected);
  });

  it("uses the page language rather than browser locale", () => {
    expect(resolveSubscriptionLanguage("/services", "en-US")).toBe("en");
    expect(resolveSubscriptionLanguage("/ru/services", "en-US")).toBe("ru");
    expect(resolveSubscriptionLanguage("/services", "ru")).toBe("ru");
  });

  it("captures campaign attribution without the email address", () => {
    expect(
      captureSubscriptionAttribution(
        {
          pathname: "/blog/vat-registration",
          search: "?utm_source=google&utm_medium=cpc&utm_campaign=vat",
          hash: "#checklist",
        } as Location,
        "https://www.google.com/search?q=thai+vat",
      ),
    ).toEqual({
      source_page: "/blog/vat-registration?utm_source=google&utm_medium=cpc&utm_campaign=vat#checklist",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "vat",
      referrer: "https://www.google.com/search?q=thai+vat",
    });
  });
});

describe("subscription popup persistence", () => {
  beforeEach(() => window.localStorage.clear());

  it("hides a dismissed popup for 14 days", () => {
    const now = Date.UTC(2026, 7, 2);
    markSubscriptionDismissed(window.localStorage, now);

    expect(shouldSuppressPopup(window.localStorage, "/", now + POPUP_DISMISSAL_MS - 1)).toBe(true);
    expect(shouldSuppressPopup(window.localStorage, "/", now + POPUP_DISMISSAL_MS)).toBe(false);
  });

  it("keeps the popup hidden after successful subscription", () => {
    markSubscriptionDismissed(window.localStorage, 1);
    markSubscriptionSuccessful(window.localStorage);

    expect(window.localStorage.getItem(SUBSCRIPTION_STORAGE_KEYS.subscribed)).toBe("true");
    expect(window.localStorage.getItem(SUBSCRIPTION_STORAGE_KEYS.dismissedAt)).toBeNull();
    expect(shouldSuppressPopup(window.localStorage, "/")).toBe(true);
  });

  it("never shows on conversion, legal, or preference pages", () => {
    expect(shouldSuppressPopup(window.localStorage, "/contact")).toBe(true);
    expect(shouldSuppressPopup(window.localStorage, "/submit")).toBe(true);
    expect(shouldSuppressPopup(window.localStorage, "/privacy")).toBe(true);
    expect(shouldSuppressPopup(window.localStorage, "/unsubscribe")).toBe(true);
  });
});
