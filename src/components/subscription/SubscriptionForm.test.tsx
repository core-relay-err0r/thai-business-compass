import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SubscriptionForm } from "./SubscriptionForm";

function renderForm() {
  return render(
    <MemoryRouter
      initialEntries={["/blog/vat-registration-thailand?utm_source=test"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SubscriptionForm signupLocation="article_end" />
    </MemoryRouter>,
  );
}

describe("SubscriptionForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("submits inferred context and shows the approved success message", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    renderForm();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "Owner@Example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Get practical updates" }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const request = vi.mocked(fetch).mock.calls[0];
    const payload = JSON.parse(String(request[1]?.body));

    expect(payload).toMatchObject({
      email: "Owner@Example.com",
      interest: "vat",
      language: "en",
      signup_location: "article_end",
      source_page: "/blog/vat-registration-thailand?utm_source=test",
      utm_source: "test",
    });
    expect(payload).not.toHaveProperty("brand");
    expect(
      await screen.findByText(
        "You’re subscribed. We’ll send only updates that may materially affect companies in Thailand.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps the form available and reports a recoverable error", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ error: "no" }), { status: 502 }));
    renderForm();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "owner@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Get practical updates" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We couldn’t save your subscription. Please try again.",
    );
    expect(screen.getByLabelText("Email address")).toHaveValue("owner@example.com");
  });
});
