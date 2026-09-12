import { beforeEach, describe, expect, it, vi } from "vitest";
import { sanitizeContactAttribution } from "../../supabase/functions/_shared/contact-attribution";

describe("contact attribution", () => {
  beforeEach(() => vi.resetModules());

  it("keeps the first landing source through SPA navigation without persistent storage", async () => {
    window.history.replaceState({}, "", "/?utm_source=themanifest.com&utm_medium=referral&email=private%40example.com");
    const { captureContactAttribution } = await import("./contact-attribution");
    const first = captureContactAttribution();
    window.history.replaceState({}, "", "/contact");
    expect(captureContactAttribution()).toEqual(first);
    expect(first).toMatchObject({ landing_path: "/", utm_source: "themanifest.com", utm_medium: "referral" });
    expect(JSON.stringify(first)).not.toContain("private");
  });

  it("discards unapproved fields and unsafe values; strips referrer query", () => {
    expect(sanitizeContactAttribution({
      landing_path: "/services", referrer_origin: "https://www.google.com/search?q=private",
      utm_campaign: "<script>", utm_content: "client@example.com", utm_term: "a".repeat(121),
      email: "private@example.com", gclid: "private", utm_source: "google",
    })).toEqual({ landing_path: "/services", referrer_origin: "https://www.google.com", utm_source: "google" });
    expect(sanitizeContactAttribution(null)).toEqual({});
    expect(sanitizeContactAttribution({ referrer_origin: "javascript:alert(1)" })).toEqual({});
  });

  it("emits no contact fields and tolerates failed optional analytics", async () => {
    const { trackContactEvent } = await import("./contact-attribution");
    window.clarity = vi.fn(() => { throw new Error("blocked"); });
    window.dataLayer = [];
    expect(() => trackContactEvent("contact_form_success")).not.toThrow();
    expect(window.dataLayer).toEqual([{ event: "contact_form_success", form_id: "pnd50_contact" }]);
    delete window.clarity;
    delete window.dataLayer;
  });
});
