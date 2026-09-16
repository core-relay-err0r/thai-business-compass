import type { ReactNode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, useNavigate } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  const originalScrollIntoView = Object.getOwnPropertyDescriptor(Element.prototype, "scrollIntoView");
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (originalScrollIntoView) {
      Object.defineProperty(Element.prototype, "scrollIntoView", originalScrollIntoView);
    } else {
      delete Element.prototype.scrollIntoView;
    }
  });

  function Navigation() {
    const navigate = useNavigate();
    return <nav>
      <Link to="/services#accounting">Accounting navigation</Link>
      <Link to="/services#corporate">Corporate navigation</Link>
      <button onClick={() => navigate(-1)}>Back</button>
    </nav>;
  }

  function setupNavigation() {
    vi.useFakeTimers();
    const scroll = vi.fn();
    Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: scroll });
    render(<MemoryRouter initialEntries={["/services#accounting"]}><Navigation /><Services /></MemoryRouter>);
    act(() => { vi.advanceTimersByTime(100); });
    return scroll;
  }

  it("scrolls on entry, hash changes, repeated links and back navigation", () => {
    const scroll = setupNavigation();
    expect(scroll.mock.instances.at(-1)).toBe(document.getElementById("accounting"));
    scroll.mockClear();
    fireEvent.click(screen.getByRole("link", { name: "Accounting navigation" }));
    act(() => { vi.advanceTimersByTime(100); });
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll.mock.instances.at(-1)).toBe(document.getElementById("accounting"));
    fireEvent.click(screen.getByRole("link", { name: "Corporate navigation" }));
    act(() => { vi.advanceTimersByTime(100); });
    expect(scroll.mock.instances.at(-1)).toBe(document.getElementById("corporate"));
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    act(() => { vi.advanceTimersByTime(100); });
    expect(scroll.mock.instances.at(-1)).toBe(document.getElementById("accounting"));
  });

  it("cancels stale anchor scrolls during rapid navigation", () => {
    const scroll = setupNavigation();
    scroll.mockClear();
    fireEvent.click(screen.getByRole("link", { name: "Corporate navigation" }));
    fireEvent.click(screen.getByRole("link", { name: "Accounting navigation" }));
    act(() => { vi.advanceTimersByTime(100); });
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll.mock.instances.at(-1)).toBe(document.getElementById("accounting"));
  });

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
