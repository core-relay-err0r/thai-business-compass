import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const SITE_URL = "https://pnd50.com";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
];

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJsonLd(json) {
  // Prevent breaking out of the <script> context.
  return JSON.stringify(json).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

function isValidSlug(slug) {
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function normalizeSources(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const title = typeof entry.title === "string" ? entry.title.trim() : "";
    const publisher = typeof entry.publisher === "string" ? entry.publisher.trim() : "";
    const url = typeof entry.url === "string" ? safeUrl(entry.url.trim()) : null;
    if (!title || !publisher || !url) return [];
    return [{
      title,
      publisher,
      url,
      published_at: typeof entry.published_at === "string" ? entry.published_at.trim() : undefined,
      accessed_at: typeof entry.accessed_at === "string" ? entry.accessed_at.trim() : undefined,
    }];
  });
}

function renderInlineMarkdown(value) {
  const text = String(value ?? "");
  const tokenPattern = /\[([^\]]+)]\(([^)\s]+)\)|\*\*(.+?)\*\*|(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
  let html = "";
  let cursor = 0;
  let match;

  while ((match = tokenPattern.exec(text)) !== null) {
    html += escapeHtml(text.slice(cursor, match.index));
    if (match[1] && match[2]) {
      const label = escapeHtml(match[1]);
      const href = match[2];
      const isInternal = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(href);
      const externalUrl = safeUrl(href);
      if (isInternal) html += `<a href="${escapeHtml(href)}">${label}</a>`;
      else if (externalUrl) html += `<a href="${escapeHtml(externalUrl)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      else html += label;
    } else if (match[3]) html += `<strong>${escapeHtml(match[3])}</strong>`;
    else if (match[4]) html += `<em>${escapeHtml(match[4])}</em>`;
    cursor = match.index + match[0].length;
  }

  return html + escapeHtml(text.slice(cursor));
}

function renderContentHtml(content) {
  const blocks = String(content || "").split(/\n\n+/);
  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("### ")) return `<h3>${renderInlineMarkdown(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${renderInlineMarkdown(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("# ")) return `<h2>${renderInlineMarkdown(trimmed.slice(2))}</h2>`;

      const lines = trimmed.split("\n");
      const isList = lines.every((line) => /^(-\s|\d+\.\s)/.test(line.trim()));
      if (isList) {
        const ordered = /^\d+\.\s/.test(lines[0].trim());
        const items = lines
          .map((line) => `<li>${renderInlineMarkdown(line.trim().replace(/^(-\s|\d+\.\s)/, ""))}</li>`)
          .join("");
        return ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
      }
      return `<p>${renderInlineMarkdown(trimmed)}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

function articleJsonLd(post, sources) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const author = post.author_name
    ? { "@type": "Person", "@id": `${url}#author`, name: post.author_name, ...(post.author_role ? { jobTitle: post.author_role } : {}) }
    : { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "PND50 Editorial Team", url: SITE_URL };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.meta_description || post.excerpt || post.title,
    image: post.featured_image || `${SITE_URL}/favicon.png`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.reviewed_at || post.updated_at,
    author,
    ...(post.reviewer_name
      ? { reviewedBy: { "@type": "Person", "@id": `${url}#reviewer`, name: post.reviewer_name, ...(post.reviewer_role ? { jobTitle: post.reviewer_role } : {}) } }
      : {}),
    ...(sources.length ? { citation: sources.map((s) => s.url) } : {}),
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "PND50",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

function injectIntoTemplate(template, { title, description, canonical, bodyHtml, jsonLd }) {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${escapeHtml(description)}">`,
  );
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  );

  const jsonScripts = jsonLd
    .map((entry) => `<script type="application/ld+json">${escapeJsonLd(entry)}</script>`)
    .join("\n    ");

  html = html.replace("</head>", `    ${jsonScripts}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <main id="prerender-content">${bodyHtml}</main>`,
  );

  return html;
}

async function fetchPublishedPosts() {
  const endpoint = `${SUPABASE_URL}/rest/v1/blog_posts?select=*&is_published=eq.true&order=published_at.desc`;
  const response = await fetch(endpoint, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

function buildSitemap(posts) {
  const now = new Date().toISOString().split("T")[0];
  const entries = STATIC_ROUTES.map(
    (route) => `  <url>\n    <loc>${SITE_URL}${route.path === "/" ? "/" : route.path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`,
  );

  for (const post of posts) {
    const lastmod = (post.reviewed_at || post.updated_at || post.published_at || post.created_at || now).split("T")[0];
    entries.push(
      `  <url>\n    <loc>${SITE_URL}/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

function blogIndexBody(posts) {
  const items = posts
    .map((post) => {
      const summary = post.key_takeaway || post.excerpt || "";
      return `<li><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a>${summary ? `<p>${escapeHtml(summary)}</p>` : ""}</li>`;
    })
    .join("\n");
  return `<h1>Thai Accounting &amp; Tax Insights</h1>\n<ul>${items}</ul>`;
}

function blogPostBody(post, sources) {
  const parts = [`<h1>${escapeHtml(post.title)}</h1>`];
  if (post.key_takeaway) parts.push(`<p><strong>Key takeaway:</strong> ${escapeHtml(post.key_takeaway)}</p>`);

  const author = post.author_name || "PND50 Editorial Team";
  parts.push(`<p>Written by ${escapeHtml(author)}${post.author_role ? ` · ${escapeHtml(post.author_role)}` : ""}</p>`);
  if (post.reviewer_name) {
    parts.push(`<p>Reviewed by ${escapeHtml(post.reviewer_name)}${post.reviewer_role ? ` · ${escapeHtml(post.reviewer_role)}` : ""}</p>`);
  }

  parts.push(renderContentHtml(post.content));

  if (sources.length) {
    const list = sources
      .map((s) => `<li><a href="${escapeHtml(s.url)}" rel="noopener noreferrer">${escapeHtml(s.title)}</a> — ${escapeHtml(s.publisher)}</li>`)
      .join("\n");
    parts.push(`<h2>Sources</h2>\n<ol>${list}</ol>`);
  }

  return parts.join("\n");
}

async function main() {
  if (!existsSync(DIST)) {
    throw new Error(`dist/ not found at ${DIST}. Run "vite build" before prerendering.`);
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const message =
      "prerender-blog: Supabase build environment variables are not set; skipping blog prerender and sitemap generation.";
    if (isProduction) {
      throw new Error(message.replace("skipping", "cannot skip in production for"));
    }
    console.warn(`[prerender-blog] ${message}`);
    return;
  }

  const template = await readFile(join(DIST, "index.html"), "utf8");
  let rawPosts;
  try {
    rawPosts = await fetchPublishedPosts();
  } catch (error) {
    if (isProduction) throw error;
    console.warn(`[prerender-blog] ${error.message}; keeping the existing development sitemap and skipping prerender.`);
    return;
  }

  const posts = [];
  for (const post of rawPosts) {
    if (!isValidSlug(post.slug)) {
      throw new Error(`prerender-blog: invalid published slug "${post.slug}" for post "${post.title}".`);
    }
    posts.push(post);
  }

  // Blog index
  const indexHtml = injectIntoTemplate(template, {
    title: "Blog | Thai Accounting & Tax Insights | PND50",
    description:
      "Expert insights on Thai accounting, corporate tax filing, PND50 compliance, and business advisory for foreign companies operating in Thailand.",
    canonical: `${SITE_URL}/blog`,
    bodyHtml: blogIndexBody(posts),
    jsonLd: [],
  });
  await mkdir(join(DIST, "blog"), { recursive: true });
  await writeFile(join(DIST, "blog", "index.html"), indexHtml, "utf8");

  // Individual posts
  for (const post of posts) {
    const sources = normalizeSources(post.sources);
    const canonical = `${SITE_URL}/blog/${post.slug}`;
    const html = injectIntoTemplate(template, {
      title: post.title,
      description: post.meta_description || post.excerpt || post.title,
      canonical,
      bodyHtml: blogPostBody(post, sources),
      jsonLd: [articleJsonLd(post, sources)],
    });
    const dir = join(DIST, "blog", post.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html, "utf8");
  }

  // Sitemap
  await writeFile(join(DIST, "sitemap.xml"), buildSitemap(posts), "utf8");

  console.log(`[prerender-blog] Prerendered ${posts.length} post(s) and refreshed sitemap.xml`);
}

main().catch((error) => {
  console.error(`[prerender-blog] ${error.message}`);
  process.exit(1);
});
