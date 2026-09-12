import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { JSDOM } from "jsdom";
import { expect, it, vi } from "vitest";

const html = readFileSync("index.html", "utf8");
const doc = new JSDOM(html).window.document;
const bootstrap = [...doc.scripts].find((script) => script.textContent?.includes("wtir2k44gy"))!.textContent!;

it.each(["127.0.0.1", "localhost", "preview.vercel.app"])("does not inject production analytics on %s", (hostname) => {
  const createElement = vi.fn();
  runInNewContext(bootstrap, { window: { location: { hostname } }, document: { createElement } });
  expect(createElement).not.toHaveBeenCalled();
});

it.each(["pnd50.com", "www.pnd50.com"])("preserves Clarity loading on %s", (hostname) => {
  const inserted: { src?: string } = {};
  const insertBefore = vi.fn();
  const win = { location: { hostname } };
  runInNewContext(bootstrap, { window: win, document: {
    createElement: () => inserted,
    getElementsByTagName: () => [{ parentNode: { insertBefore } }],
  } });
  expect(inserted.src).toBe("https://www.clarity.ms/tag/wtir2k44gy");
  expect(insertBefore).toHaveBeenCalledOnce();
});
