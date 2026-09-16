import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it } from "vitest";
import { Header } from "./Header";

afterEach(cleanup);

it("keeps the collapsing mobile menu out of the anchor layout and closes it on navigation", () => {
  render(<MemoryRouter initialEntries={["/services#accounting"]}><Header /></MemoryRouter>);
  expect(document.getElementById("mobile-navigation")).toHaveClass("absolute", "top-full");
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: /Accounting & Tax/ }));
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
});
