import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Services from "./Services";

vi.mock("@/components/layout/Layout", () => ({
  Layout: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/components/seo/SEOHead", () => ({ SEOHead: () => null }));
vi.mock("@/components/seo/StructuredData", () => ({
  FAQSchema: () => null,
  ServiceSchema: () => null,
}));
vi.mock("@/components/corporate/CorporateServices", () => ({
  CorporateServicesContent: () => <p>Corporate service details</p>,
}));
vi.mock("@/components/consulting/ConsultingServices", () => ({
  ConsultingServices: () => <p>Consulting service details</p>,
}));
// Keep the real SubscriptionSection wiring, but do not initialize its API form.
vi.mock("@/components/subscription/SubscriptionForm", () => ({
  SubscriptionForm: ({ signupLocation, interest }: { signupLocation: string; interest: string }) => (
    <form aria-label="Service subscription" data-location={signupLocation} data-interest={interest} />
  ),
}));

describe("Services page", () => {
  it("renders the service sections and embedded subscription without crashing", () => {
    render(<MemoryRouter initialEntries={["/services"]}><Services /></MemoryRouter>);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Describe the problem.");
    for (const id of ["corporate", "accounting", "consulting"]) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Get an estimate" })).toHaveAttribute("href", "/tools/cost-estimator");
    expect(screen.getByRole("form", { name: "Service subscription" })).toHaveAttribute("data-location", "service_corporate");
    expect(screen.getByRole("form", { name: "Service subscription" })).toHaveAttribute("data-interest", "company_registration");
  });
});
