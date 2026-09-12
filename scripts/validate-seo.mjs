import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE_URL = "https://www.pnd50.com";
const STATIC_PATHS = ["/", "/services", "/about", "/contact", "/blog", "/privacy", "/tos"];
const NOINDEX_PATHS = ["/submit", "/tools/cost-estimator", "/unsubscribe"];
const LEGACY_PATHS = ["/corporate", "/corporate-services", "/accounting", "/cost-calculator", "/consulting", "/terms"];

function occurrences(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function fail(message) {
  throw new Error(`SEO validation failed: ${message}`);
}

function routeFile(path) {
  return path === "/" ? join(DIST, "index.html") : join(DIST, path.slice(1), "index.html");
}

function validateHtml(html, path, { noIndex = false } = {}) {
  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  if (occurrences(html, /<link rel="canonical"/g) !== 1) fail(`${path} must have exactly one canonical link`);
  if (!html.includes(`href="${canonical}"`)) fail(`${path} canonical must be ${canonical}`);
  if (occurrences(html, /<meta name="description"/g) !== 1) fail(`${path} must have exactly one description`);
  if (!html.includes('id="prerender-content"')) fail(`${path} must preserve the crawl shell`);
  if (!html.includes('document.documentElement.classList.add("js")')) fail(`${path} must enable the early JavaScript marker`);
  if (!html.includes("html.js #prerender-content{display:none!important}")) fail(`${path} must hide the crawl shell before paint when JavaScript is enabled`);
  if (occurrences(html, /<h1(?:\s|>)/g) !== 1) fail(`${path} crawl shell must have exactly one H1`);
  if (!html.includes(`property="og:url" content="${canonical}"`)) fail(`${path} Open Graph URL is not canonical`);
  if (html.includes('href="https://pnd50.com') || html.includes('content="https://pnd50.com')) {
    fail(`${path} contains the non-canonical apex host`);
  }
  if (noIndex && !html.includes('name="robots" content="noindex, nofollow"')) fail(`${path} must be noindex`);
  if (!noIndex && html.includes('name="robots" content="noindex')) fail(`${path} must be indexable`);

  const jsonLdPattern = /<script type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(jsonLdPattern)) {
    if (!match[1].includes('data-rh="true"')) fail(`${path} JSON-LD must be managed by Helmet`);
    try {
      JSON.parse(match[2]);
    } catch (error) {
      fail(`${path} contains invalid JSON-LD: ${error.message}`);
    }
  }
  if (noIndex && !html.includes('name="robots" content="noindex, nofollow" data-rh="true"')) {
    fail(`${path} robots tag must be managed by Helmet`);
  }
}

async function validate() {
  for (const path of STATIC_PATHS) {
    validateHtml(await readFile(routeFile(path), "utf8"), path);
  }
  for (const path of NOINDEX_PATHS) {
    validateHtml(await readFile(routeFile(path), "utf8"), path, { noIndex: true });
  }

  const blogDir = join(DIST, "blog");
  const entries = await readdir(blogDir, { withFileTypes: true });
  const articleSlugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  for (const slug of articleSlugs) {
    validateHtml(await readFile(join(blogDir, slug, "index.html"), "utf8"), `/blog/${slug}`);
  }

  const notFound = await readFile(join(DIST, "404.html"), "utf8");
  if (!notFound.includes('name="robots" content="noindex, nofollow"')) fail("404.html must be noindex");
  if (occurrences(notFound, /<h1(?:\s|>)/g) !== 1) fail("404.html must contain one H1");

  const sitemap = await readFile(join(DIST, "sitemap.xml"), "utf8");
  if (!sitemap.includes(`${SITE_URL}/`)) fail("sitemap must use the canonical www host");
  if (sitemap.includes("https://pnd50.com")) fail("sitemap contains the non-canonical apex host");
  for (const path of [...NOINDEX_PATHS, ...LEGACY_PATHS]) {
    if (sitemap.includes(`<loc>${SITE_URL}${path}</loc>`)) fail(`sitemap must not include ${path}`);
  }
  for (const path of STATIC_PATHS) {
    const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
    if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap is missing ${path}`);
  }

  const robots = await readFile(join(DIST, "robots.txt"), "utf8");
  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail("robots.txt sitemap URL is inconsistent");
  if (!robots.includes("Disallow: /submit")) fail("robots.txt must disallow the conversion workflow");
  if (!robots.includes("Disallow: /unsubscribe")) fail("robots.txt must disallow the email-preference workflow");

  const llms = await readFile(join(DIST, "llms.txt"), "utf8");
  if (!llms.includes("PND50 Co., Ltd.")) fail("llms.txt is missing the legal entity name");
  if (!llms.includes(SITE_URL)) fail("llms.txt is missing the canonical origin");

  console.log(
    `[validate-seo] Validated ${STATIC_PATHS.length} static routes, ${NOINDEX_PATHS.length} noindex route(s), ${articleSlugs.length} article(s), and crawler discovery files.`,
  );
}

validate().catch((error) => {
  console.error(`[validate-seo] ${error.message}`);
  process.exit(1);
});
