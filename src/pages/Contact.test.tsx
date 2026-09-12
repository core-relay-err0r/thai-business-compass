import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import Contact from "./Contact";
import { invokeEdgeFunction } from "@/lib/edge-functions";
import { trackContactEvent } from "@/lib/contact-attribution";

vi.mock("@/components/layout/Layout", () => ({ Layout: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("@/components/seo/SEOHead", () => ({ SEOHead: () => null }));
vi.mock("@/components/seo/StructuredData", () => ({ LocalBusinessSchema: () => null }));
vi.mock("@/lib/edge-functions", () => ({ invokeEdgeFunction: vi.fn() }));
vi.mock("@/lib/contact-attribution", () => ({ captureContactAttribution: () => ({ utm_source: "themanifest.com" }), trackContactEvent: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

function fillForm() {
  render(<Contact />);
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Local Test" } });
  fireEvent.change(screen.getByLabelText("Email", { exact: true }), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("How can we help?"), { target: { value: "Local mocked test" } });
  return screen.getByRole("button", { name: "Send request" }).closest("form")!;
}

it("submits attribution, records acceptance only after acknowledgement, then resets fields", async () => {
  vi.mocked(invokeEdgeFunction).mockResolvedValue({ data: { success: true, internalDelivered: true }, error: null });
  const form = fillForm();
  fireEvent.submit(form);
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Request sent"));
  expect(invokeEdgeFunction).toHaveBeenCalledWith("send-contact", expect.objectContaining({ body: expect.objectContaining({ attribution: { utm_source: "themanifest.com" } }) }));
  expect(trackContactEvent).toHaveBeenCalledWith("contact_form_success");
  expect(screen.getByLabelText("Full name")).toHaveValue("");
  expect(vi.mocked(trackContactEvent).mock.calls.filter(([event]) => event === "contact_form_start")).toHaveLength(1);
});

it.each([null, { success: false }, { success: true, internalDelivered: false }, { success: true }])("rejects unconfirmed responses and preserves input: %j", async (data) => {
  vi.mocked(invokeEdgeFunction).mockResolvedValue({ data, error: null });
  fireEvent.submit(fillForm());
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("could not confirm"));
  expect(screen.getByLabelText("Full name")).toHaveValue("Local Test");
  expect(trackContactEvent).not.toHaveBeenCalledWith("contact_form_success");
  expect(trackContactEvent).toHaveBeenCalledWith("contact_form_error");
});

it("blocks a concurrent submission and enables retry after a failed request", async () => {
  let resolve!: (value: { data: null; error: Error }) => void;
  vi.mocked(invokeEdgeFunction).mockReturnValue(new Promise((done) => { resolve = done; }));
  const form = fillForm();
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(invokeEdgeFunction).toHaveBeenCalledTimes(1);
  resolve({ data: null, error: new Error("Network error") });
  await waitFor(() => expect(screen.getByRole("button", { name: "Send request" })).toBeEnabled());
  expect(screen.getByLabelText("How can we help?")).toHaveValue("Local mocked test");
});

it("tracks validation once per edit cycle and direct contact clicks separately", () => {
  const form = fillForm();
  fireEvent.invalid(screen.getByLabelText("Full name"));
  fireEvent.invalid(screen.getByLabelText("Email", { exact: true }));
  const emailLink = screen.getByRole("link", { name: "info@pnd50.com" });
  emailLink.addEventListener("click", (event) => event.preventDefault());
  fireEvent.click(emailLink);
  expect(vi.mocked(trackContactEvent).mock.calls.filter(([event]) => event === "contact_form_invalid")).toHaveLength(1);
  expect(trackContactEvent).toHaveBeenCalledWith("contact_email_click");
  expect(invokeEdgeFunction).not.toHaveBeenCalled();
  expect(form).toHaveAttribute("aria-busy", "false");
});
