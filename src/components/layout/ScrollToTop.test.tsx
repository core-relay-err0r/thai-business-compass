import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Link, MemoryRouter } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("scrolls back to the form when Contact is clicked on /contact again", () => {
  const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  render(<MemoryRouter initialEntries={["/contact"]}><ScrollToTop /><Link to="/contact">Contact</Link></MemoryRouter>);
  scroll.mockClear();
  fireEvent.click(screen.getByRole("link", { name: "Contact" }));
  expect(scroll).toHaveBeenCalledWith(0, 0);
});

it("does not override section anchors", () => {
  const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  render(<MemoryRouter initialEntries={["/services#corporate"]}><ScrollToTop /></MemoryRouter>);
  expect(scroll).not.toHaveBeenCalled();
});
