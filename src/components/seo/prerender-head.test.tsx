import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { HelmetProvider } from "react-helmet-async";
import { LocalBusinessSchema } from "./StructuredData";
import { SEOHead } from "./SEOHead";

afterEach(() => {
  cleanup();
  document.head.querySelectorAll('[data-rh="true"]').forEach((node) => node.remove());
});

it("replaces prerendered JSON-LD rather than duplicating the business", async () => {
  const initial = document.createElement("script");
  initial.type = "application/ld+json";
  initial.dataset.rh = "true";
  initial.textContent = JSON.stringify({ "@type": "AccountingService", "@id": "https://www.pnd50.com/#accounting-service", priceRange: "$" });
  document.head.append(initial);
  render(<HelmetProvider><LocalBusinessSchema /></HelmetProvider>);
  await waitFor(() => {
    const schemas = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas).toHaveLength(1);
    expect(JSON.parse(schemas[0].textContent!)).toMatchObject({ priceRange: "$$" });
  });
});

it("does not carry a prerendered noindex tag onto an indexable route", async () => {
  const initial = document.createElement("meta");
  initial.name = "robots";
  initial.content = "noindex, nofollow";
  initial.dataset.rh = "true";
  document.head.append(initial);
  render(<HelmetProvider><SEOHead title="Contact PND50" description="Contact" path="/contact" /></HelmetProvider>);
  await waitFor(() => expect(document.head.querySelector('meta[name="robots"]')).toBeNull());
});
