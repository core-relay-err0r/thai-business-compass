// Automatically notifies IndexNow (Bing, Yandex, Seznam and partners) about
// new or updated URLs after each production build.
//
// How it works:
// 1. Reads the freshly generated dist/sitemap.xml (source of truth for this build).
// 2. Fetches the currently live sitemap from production.
// 3. Diffs them: only URLs that are new, or whose <lastmod> changed, are submitted.
// 4. Posts the diff to api.indexnow.org. Failures never break the build.
//
// Runs only in Vercel production builds (VERCEL_ENV=production); skipped in
// preview builds and local development. Google does not consume IndexNow —
// Google discovers changes via the sitemap.

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST_SITEMAP = join(ROOT, "dist", "sitemap.xml");

const HOST = "www.pnd50.com";
const LIVE_SITEMAP_URL = `https://${HOST}/sitemap.xml`;
// IndexNow keys are public by design; the key file is served from /public.
const INDEXNOW_KEY = "3d6dfb8f7aa6fc3a0430c9c5337b1466";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
// IndexNow accepts up to 10,000 URLs per request; stay well below.
const MAX_URLS_PER_REQUEST = 500;

function parseSitemap(xml) {
  const entries = new Map();
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? "";
    entries.set(loc.trim(), lastmod.trim());
  }
  return entries;
}

async function fetchLiveSitemap() {
  try {
    const response = await fetch(LIVE_SITEMAP_URL, {
      headers: { "User-Agent": "pnd50-indexnow-ping" },
    });
    if (!response.ok) {
      console.warn(`[indexnow-ping] Live sitemap returned HTTP ${response.status}; treating all URLs as new.`);
      return new Map();
    }
    return parseSitemap(await response.text());
  } catch (error) {
    console.warn(`[indexnow-ping] Could not fetch live sitemap (${error.message}); treating all URLs as new.`);
    return new Map();
  }
}

async function submitBatch(urlList) {
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  return response.status;
}

async function main() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log(`[indexnow-ping] Skipping (VERCEL_ENV=${process.env.VERCEL_ENV ?? "local"}); only runs in production builds.`);
    return;
  }

  let builtXml;
  try {
    builtXml = await readFile(DIST_SITEMAP, "utf8");
  } catch {
    console.warn("[indexnow-ping] dist/sitemap.xml not found; skipping.");
    return;
  }

  const built = parseSitemap(builtXml);
  if (built.size === 0) {
    console.warn("[indexnow-ping] Built sitemap has no URLs; skipping.");
    return;
  }

  const live = await fetchLiveSitemap();
  const changed = [...built.entries()]
    .filter(([url, lastmod]) => !live.has(url) || live.get(url) !== lastmod)
    .map(([url]) => url);

  if (changed.length === 0) {
    console.log("[indexnow-ping] No new or updated URLs since the live sitemap; nothing to submit.");
    return;
  }

  console.log(`[indexnow-ping] Submitting ${changed.length} new/updated URL(s):`);
  for (const url of changed) console.log(`  - ${url}`);

  for (let i = 0; i < changed.length; i += MAX_URLS_PER_REQUEST) {
    const batch = changed.slice(i, i + MAX_URLS_PER_REQUEST);
    const status = await submitBatch(batch);
    if (status === 200 || status === 202) {
      console.log(`[indexnow-ping] Batch of ${batch.length} accepted (HTTP ${status}).`);
    } else {
      console.warn(`[indexnow-ping] IndexNow returned HTTP ${status}; submission may not have been accepted.`);
    }
  }
}

main().catch((error) => {
  // Never fail the build over a search-engine ping.
  console.warn(`[indexnow-ping] Non-fatal error: ${error.message}`);
});
