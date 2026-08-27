import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");

// Single canonical origin. The apex (pnd50.com) redirects to www at the edge,
// so every crawlable authority signal must point at the www host.
const SITE_URL = "https://www.pnd50.com";
const SITE_NAME = "PND50";
const LEGAL_NAME = "PND50 Co., Ltd.";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const ACCOUNTING_SERVICE_ID = `${SITE_URL}/#accounting-service`;
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const LOGO_URL = `${SITE_URL}/favicon.png`;

const CONTACT = {
  telephone: ["+66-2-017-2950", "+66-2-017-2949"],
  email: "info@pnd50.com",
  streetAddress:
    "Suite 3065, 30th Floor, Bhiraj Tower at EmQuartier, 689 Sukhumvit Rd, Khlong Tan Nuea",
  addressLocality: "Bangkok",
  addressRegion: "Watthana",
  postalCode: "10110",
  addressCountry: "TH",
};

// Static, indexable routes. `/submit` is intentionally excluded: it is a
// conversion workflow marked noindex, not a search landing page.
const NOINDEX_ROUTES = [
  {
    path: "/tools/cost-estimator",
    title: "Accounting Cost Estimator Thailand | PND50",
    description: "Build a preliminary accounting and compliance estimate for your Thai company. Final scope and fees are confirmed after review by PND50.",
    h1: "Accounting cost estimator for Thailand",
    body: ["Build an optional preliminary estimate, or contact PND50 directly without selecting services first."],
    links: [
      { href: "/contact", label: "Contact PND50 directly" },
      { href: "/services", label: "Browse accounting services" },
    ],
    schema: [],
  },
  {
    path: "/submit",
    title: "Tell us what you need | PND50",
    description: "Describe your accounting, tax, corporate, or business issue to the PND50 team in Bangkok.",
    h1: "Tell us what you need",
    body: ["Describe the business outcome, deadline, compliance issue, or decision you need help with."],
    links: [{ href: "/contact", label: "Contact PND50 directly" }],
    schema: [],
  },
  {
    path: "/unsubscribe",
    title: "Email preferences | PND50",
    description: "Manage your PND50 practical-update subscription.",
    h1: "Email preferences",
    body: ["Use the secure link in a PND50 subscription email to unsubscribe."],
    links: [{ href: "/privacy", label: "Privacy Policy" }],
    schema: [],
  },
];

const STATIC_ROUTES = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly",
    title: "PND50 | Thai Accounting Firm & Corporate Services | Bangkok",
    description:
      "PND50 is a Bangkok-based accounting firm for foreign-owned companies in Thailand. Corporate tax, bookkeeping, payroll, and business advisory services. English-speaking accountants.",
    h1: "Accounting and corporate compliance for foreign-owned businesses in Thailand.",
    answer:
      "PND50 Co., Ltd. is a Bangkok-based accounting and corporate compliance firm that helps foreign-owned companies in Thailand with company setup, monthly bookkeeping, payroll, VAT and withholding tax, and year-end corporate income tax (P.N.D.50) filing.",
    body: [
      "PND50 supports international businesses across the full Thai compliance cycle: company registration, monthly bookkeeping, payroll, VAT and withholding tax returns, and year-end financial statements.",
      "Our English-speaking team is based at Bhiraj Tower at EmQuartier in Bangkok and serves clients throughout Thailand.",
    ],
    links: [
      { href: "/services", label: "Accounting & corporate services" },
      { href: "/about", label: "About PND50" },
      { href: "/blog", label: "Thai accounting & tax insights" },
      { href: "/contact", label: "Contact our Bangkok team" },
    ],
    schema: ["organization", "localBusiness"],
  },
  {
    path: "/services",
    priority: "0.9",
    changefreq: "monthly",
    title: "Accounting Services Thailand | Tax Filing & Bookkeeping | PND50",
    description:
      "Professional accounting services in Thailand for foreign companies. Monthly bookkeeping, corporate tax filing, VAT returns, payroll, and financial reporting by English-speaking accountants.",
    h1: "Accounting, tax, and corporate services in Thailand",
    answer:
      "PND50 provides monthly bookkeeping, corporate income tax (P.N.D.50) filing, VAT and withholding tax returns, payroll, company registration, and business advisory for foreign-owned companies in Thailand.",
    body: [
      "Core services include monthly bookkeeping, corporate income tax filing, VAT and withholding tax compliance, payroll, company registration, and business consulting.",
      "Engagements are scoped to what your business actually needs, with plain-English guidance on Thai obligations and deadlines.",
    ],
    links: [
      { href: "/contact", label: "Discuss your requirements" },
      { href: "/about", label: "How we work" },
    ],
    schema: ["service"],
  },
  {
    path: "/about",
    priority: "0.7",
    changefreq: "monthly",
    title: "About PND50 | Bangkok Accounting Firm for Foreign Companies",
    description:
      "PND50 is a Bangkok-based accounting firm helping foreign-owned businesses navigate Thai accounting, corporate tax, and compliance with an English-speaking team.",
    h1: "About PND50",
    answer:
      "PND50 Co., Ltd. is a Bangkok accounting firm focused on foreign-owned businesses, providing clear communication, proactive compliance, and practical advice grounded in operating a company in Thailand.",
    body: [
      "We help foreign-owned businesses meet Thai obligations, understand their numbers, and make defensible decisions without unnecessary complexity.",
      "The firm operates from Bhiraj Tower at EmQuartier in Bangkok with an English-speaking team.",
    ],
    links: [
      { href: "/services", label: "Our services" },
      { href: "/contact", label: "Contact PND50" },
    ],
    schema: ["organization"],
  },
  {
    path: "/contact",
    priority: "0.7",
    changefreq: "monthly",
    title: "Contact PND50 | Thai Accounting & Tax Services | Bangkok",
    description:
      "Contact PND50 for Thai accounting, corporate tax, and business advisory services. Speak with our English-speaking team in EmQuartier, Bangkok.",
    h1: "Contact PND50",
    answer:
      "Contact PND50 by email at info@pnd50.com or by phone at +66 (0)2 017 2950. The office is at Suite 3065, 30th Floor, Bhiraj Tower at EmQuartier, 689 Sukhumvit Rd, Watthana, Bangkok 10110, Thailand.",
    body: [
      "Email: info@pnd50.com. Phone: +66 (0)2 017 2950 and +66 (0)2 017 2949.",
      "Office: Suite 3065, 30th Floor, Bhiraj Tower at EmQuartier, 689 Sukhumvit Rd, Khlong Tan Nuea, Watthana, Bangkok 10110, Thailand.",
    ],
    links: [
      { href: "/services", label: "Services" },
      { href: "/about", label: "About PND50" },
    ],
    schema: ["localBusiness"],
  },
  {
    path: "/blog",
    priority: "0.8",
    changefreq: "weekly",
    title: "Blog | Thai Accounting & Tax Insights | PND50",
    description:
      "Expert insights on Thai accounting, corporate tax filing, PND50 compliance, and business advisory for foreign companies operating in Thailand.",
    h1: "Thai accounting & tax insights",
    answer:
      "The PND50 blog publishes plain-English guides on Thai corporate tax, VAT, withholding tax, company registration, and accounting compliance for foreign-owned businesses.",
    // Body for the blog index is generated dynamically from published posts.
    isBlogIndex: true,
    schema: [],
  },
  {
    path: "/privacy",
    priority: "0.3",
    changefreq: "yearly",
    title: "Privacy Policy | PND50",
    description:
      "PND50 Privacy Policy. Learn how we collect, use, and protect your personal information when using our Thai accounting and corporate services.",
    h1: "Privacy policy",
    body: [
      "This policy explains how PND50 collects, uses, safeguards, and retains information provided through our services and practical-update subscription forms.",
      "For privacy questions, contact info@pnd50.com.",
    ],
    schema: [],
  },
  {
    path: "/tos",
    priority: "0.3",
    changefreq: "yearly",
    title: "Terms of Service | PND50",
    description:
      "PND50 Terms of Service. Read our terms and conditions for using Thai accounting, corporate, and consulting services.",
    h1: "Terms of service",
    body: [
      "These terms govern PND50 accounting, corporate, and consulting engagements in Thailand.",
      "For questions about these terms, contact info@pnd50.com.",
    ],
    schema: [],
  },
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
  return JSON.stringify(json).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

function absoluteUrl(path) {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeSources(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const title = typeof entry.title === "string" ? entry.title.trim() : "";
    const publisher = typeof entry.publisher === "string" ? entry.publisher.trim() : "";
    const url = typeof entry.url === "string" ? safeUrl(entry.url.trim()) : null;
    if (!title || !publisher || !url) return [];
    return [
      {
        title,
        publisher,
        url,
        published_at: typeof entry.published_at === "string" ? entry.published_at.trim() : undefined,
        accessed_at: typeof entry.accessed_at === "string" ? entry.accessed_at.trim() : undefined,
      },
    ];
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
      else if (externalUrl)
        html += `<a href="${escapeHtml(externalUrl)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
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

      // A heading marker only applies to the FIRST line of the block.
      // Any following lines are body content and must be rendered separately.
      const headingMatch = trimmed.match(/^(#{1,3}) (.*)/);
      if (headingMatch) {
        const [, hashes, headingText] = headingMatch;
        const tag = hashes === "###" ? "h3" : "h2";
        const headingHtml = `<${tag}>${renderInlineMarkdown(headingText)}</${tag}>`;
        const newlineIdx = trimmed.indexOf("\n");
        const rest = newlineIdx === -1 ? "" : trimmed.slice(newlineIdx + 1).trim();
        if (!rest) return headingHtml;
        return `${headingHtml}\n${renderContentHtml(rest)}`;
      }

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

/* ---------- JSON-LD builders (must mirror the React StructuredData) ---------- */

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      "Thai accounting firm specializing in services for foreign-owned businesses. English-speaking accountants in Bangkok.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Suite 3065, 30th Floor, Bhiraj Tower at EmQuartier",
      addressLocality: CONTACT.addressLocality,
      addressCountry: CONTACT.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.telephone,
      contactType: "customer service",
      email: CONTACT.email,
      availableLanguage: ["English", "Thai"],
    },
  };
}

function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": ACCOUNTING_SERVICE_ID,
    name: SITE_NAME,
    description:
      "Bangkok-based accounting firm for foreign-owned companies in Thailand. Corporate tax, bookkeeping, payroll, and business advisory services.",
    url: SITE_URL,
    telephone: CONTACT.telephone,
    email: CONTACT.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.streetAddress,
      addressLocality: CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.addressCountry,
    },
    geo: { "@type": "GeoCoordinates", latitude: "13.7310", longitude: "100.5695" },
    openingHours: "Mo-Fr 09:00-18:00",
    areaServed: { "@type": "Country", name: "Thailand" },
    serviceType: [
      "Accounting Services",
      "Corporate Tax Filing",
      "Bookkeeping",
      "Payroll Services",
      "Company Registration",
      "Business Consulting",
    ],
  };
}

function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services#service-catalog`,
    serviceType: [
      "Accounting Services",
      "Corporate Tax Filing",
      "Bookkeeping",
      "Payroll Services",
      "Company Registration",
      "Business Consulting",
    ],
    provider: {
      "@type": "AccountingService",
      "@id": ACCOUNTING_SERVICE_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Thailand" },
  };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function schemaForRoute(route) {
  const list = [];
  for (const key of route.schema || []) {
    if (key === "organization") list.push(organizationSchema());
    else if (key === "localBusiness") list.push(localBusinessSchema());
    else if (key === "service") list.push(serviceSchema());
  }
  if (route.path !== "/") {
    const name = route.h1 || route.title;
    list.push(
      breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name, url: absoluteUrl(route.path) },
      ]),
    );
  }
  return list;
}

function articleJsonLd(post, sources) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const author = post.author_name
    ? {
        "@type": "Person",
        "@id": `${url}#author`,
        name: post.author_name,
        ...(post.author_role ? { jobTitle: post.author_role } : {}),
      }
    : { "@type": "Organization", "@id": ORGANIZATION_ID, name: "PND50 Editorial Team", url: SITE_URL };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.meta_description || post.excerpt || post.title,
    image: post.featured_image || LOGO_URL,
    datePublished: post.published_at || post.created_at,
    dateModified: post.reviewed_at || post.updated_at,
    author,
    ...(post.reviewer_name
      ? {
          reviewedBy: {
            "@type": "Person",
            "@id": `${url}#reviewer`,
            name: post.reviewer_name,
            ...(post.reviewer_role ? { jobTitle: post.reviewer_role } : {}),
          },
        }
      : {}),
    ...(sources.length ? { citation: sources.map((s) => s.url) } : {}),
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

/* ---------- HTML injection ---------- */

function injectIntoTemplate(template, { title, description, canonical, bodyHtml, jsonLd, noIndex, ogImage }) {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${escapeHtml(description)}"${" "}data-rh="true">`,
  );
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeHtml(canonical)}" data-rh="true" />`,
  );

  // Keep Open Graph / Twitter URL + title + description in sync with the route.
  html = html
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeHtml(canonical)}" data-rh="true" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}" data-rh="true">`)
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escapeHtml(description)}" data-rh="true">`,
    )
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escapeHtml(title)}" data-rh="true">`)
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${escapeHtml(description)}" data-rh="true">`,
    );

  if (ogImage) {
    html = html
      .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeHtml(ogImage)}" data-rh="true">`)
      .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${escapeHtml(ogImage)}" data-rh="true">`);
  }

  const headExtras = [];
  if (noIndex) headExtras.push('<meta name="robots" content="noindex, nofollow" />');
  for (const entry of jsonLd) {
    headExtras.push(`<script type="application/ld+json">${escapeJsonLd(entry)}</script>`);
  }
  if (headExtras.length) {
    html = html.replace("</head>", `    ${headExtras.join("\n    ")}\n  </head>`);
  }

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <main id="prerender-content">${bodyHtml}</main>`,
  );

  return html;
}

function staticRouteBody(route, links) {
  const parts = [`<h1>${escapeHtml(route.h1 || route.title)}</h1>`];
  if (route.answer) parts.push(`<p><strong>In short:</strong> ${escapeHtml(route.answer)}</p>`);
  for (const paragraph of route.body || []) parts.push(`<p>${escapeHtml(paragraph)}</p>`);
  const routeLinks = links || route.links;
  if (routeLinks && routeLinks.length) {
    const items = routeLinks
      .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
      .join("");
    parts.push(`<nav aria-label="Related pages"><ul>${items}</ul></nav>`);
  }
  return parts.join("\n");
}

function blogIndexBody(route, posts) {
  const parts = [`<h1>${escapeHtml(route.h1 || route.title)}</h1>`];
  if (route.answer) parts.push(`<p><strong>In short:</strong> ${escapeHtml(route.answer)}</p>`);
  const items = posts
    .map((post) => {
      const summary = post.key_takeaway || post.excerpt || "";
      return `<li><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a>${
        summary ? `<p>${escapeHtml(summary)}</p>` : ""
      }</li>`;
    })
    .join("\n");
  parts.push(`<ul>${items}</ul>`);
  return parts.join("\n");
}

function blogPostBody(post, sources) {
  const parts = [`<h1>${escapeHtml(post.title)}</h1>`];
  if (post.key_takeaway) parts.push(`<p><strong>Key takeaway:</strong> ${escapeHtml(post.key_takeaway)}</p>`);

  const author = post.author_name || "PND50 Editorial Team";
  parts.push(`<p>Written by ${escapeHtml(author)}${post.author_role ? ` · ${escapeHtml(post.author_role)}` : ""}</p>`);
  if (post.reviewer_name) {
    parts.push(
      `<p>Reviewed by ${escapeHtml(post.reviewer_name)}${post.reviewer_role ? ` · ${escapeHtml(post.reviewer_role)}` : ""}</p>`,
    );
  }

  parts.push(renderContentHtml(post.content));

  if (sources.length) {
    const list = sources
      .map(
        (s) =>
          `<li><a href="${escapeHtml(s.url)}" rel="noopener noreferrer">${escapeHtml(s.title)}</a> — ${escapeHtml(
            s.publisher,
          )}</li>`,
      )
      .join("\n");
    parts.push(`<h2>Sources</h2>\n<ol>${list}</ol>`);
  }

  return parts.join("\n");
}

/* ---------- Crawler discovery files ---------- */

function buildSitemap(posts) {
  const now = new Date().toISOString().split("T")[0];
  const entries = STATIC_ROUTES.map((route) => {
    const loc = route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`;
  });

  for (const post of posts) {
    const lastmod = (post.reviewed_at || post.updated_at || post.published_at || post.created_at || now).split("T")[0];
    entries.push(
      `  <url>\n    <loc>${escapeXml(`${SITE_URL}/blog/${post.slug}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
    "\n",
  )}\n</urlset>\n`;
}

function buildRobots() {
  return `# ${LEGAL_NAME} — Bangkok accounting services for foreign companies
# ${SITE_URL}

# Block SEO scraper bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Search & AI crawlers may index the public site
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /submit
Disallow: /tools/cost-estimator
Disallow: /unsubscribe

Sitemap: ${SITE_URL}/sitemap.xml
Host: ${SITE_URL}
`;
}

function buildLlmsTxt(posts) {
  const sections = STATIC_ROUTES.filter((r) => r.path !== "/privacy" && r.path !== "/tos").map(
    (r) => `- [${r.h1 || r.title}](${absoluteUrl(r.path)}): ${r.description}`,
  );

  const articles = posts
    .slice(0, 25)
    .map((post) => {
      const date = (post.published_at || post.created_at || "").split("T")[0];
      const summary = post.key_takeaway || post.excerpt || "";
      return `- [${post.title}](${SITE_URL}/blog/${post.slug})${date ? ` (${date})` : ""}${
        summary ? `: ${summary}` : ""
      }`;
    })
    .join("\n");

  return `# ${SITE_NAME}

> ${LEGAL_NAME} is a Bangkok-based accounting and corporate compliance firm for foreign-owned companies operating in Thailand. The name is inspired by Thailand's P.N.D.50 annual corporate income tax return; the work covers the wider business compliance cycle.

## Company identity
- Legal name: ${LEGAL_NAME}
- Brand: ${SITE_NAME}
- Location: Suite 3065, 30th Floor, Bhiraj Tower at EmQuartier, 689 Sukhumvit Rd, Khlong Tan Nuea, Watthana, Bangkok 10110, Thailand
- Contact: ${CONTACT.email} · ${CONTACT.telephone.join(" / ")}
- Languages: English, Thai
- Area served: Thailand

## Service scope
Company registration, monthly bookkeeping, payroll, VAT and withholding tax returns, corporate income tax (P.N.D.50) filing, year-end financial statements, and business advisory for foreign-owned companies.

## Primary pages
${sections.join("\n")}

## Recent articles
${articles || "- (No published articles available.)"}

## Usage guidance
When citing PND50 content, prefer the most recent dated article and link to the canonical ${SITE_URL} URL. Do not attribute qualifications, certifications, staff, or claims that are not stated on the site.
`;
}

/* ---------- 404 ---------- */

function build404(template) {
  const body = [
    "<h1>Page not found</h1>",
    "<p>The page you requested could not be found. It may have moved or no longer exists.</p>",
    `<nav aria-label="Site"><ul><li><a href="/">Home</a></li><li><a href="/services">Services</a></li><li><a href="/blog">Blog</a></li><li><a href="/contact">Contact</a></li></ul></nav>`,
  ].join("\n");

  return injectIntoTemplate(template, {
    title: "Page not found | PND50",
    description:
      "The requested page could not be found. Return to PND50 for Thai accounting, tax, and corporate compliance services.",
    canonical: `${SITE_URL}/404`,
    bodyHtml: body,
    jsonLd: [],
    noIndex: true,
  });
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

async function writeRouteHtml(route, template, posts) {
  const canonical = absoluteUrl(route.path);
  const bodyHtml = route.isBlogIndex ? blogIndexBody(route, posts) : staticRouteBody(route);
  const html = injectIntoTemplate(template, {
    title: route.title,
    description: route.description,
    canonical,
    bodyHtml,
    jsonLd: schemaForRoute(route),
    noIndex: false,
  });

  const dir = route.path === "/" ? DIST : join(DIST, route.path.replace(/^\//, ""));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), html, "utf8");
}

async function main() {
  if (!existsSync(DIST)) {
    throw new Error(`dist/ not found at ${DIST}. Run "vite build" before prerendering.`);
  }

  const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);
  if (!hasSupabase && isProduction) {
    throw new Error(
      "prerender-site: Supabase build environment variables are required to prerender blog content in production.",
    );
  }

  const template = await readFile(join(DIST, "index.html"), "utf8");

  let rawPosts = [];
  if (hasSupabase) {
    try {
      rawPosts = await fetchPublishedPosts();
    } catch (error) {
      if (isProduction) throw error;
      console.warn(`[prerender-site] ${error.message}; generating static routes without blog posts in development.`);
    }
  } else {
    console.warn(
      "[prerender-site] Supabase build environment variables are not set; generating static routes without blog posts in development.",
    );
  }

  const posts = [];
  for (const post of rawPosts) {
    if (!isValidSlug(post.slug)) {
      throw new Error(`prerender-site: invalid published slug "${post.slug}" for post "${post.title}".`);
    }
    posts.push(post);
  }

  // Static + blog index routes (home is written last so it overwrites the base template body).
  const orderedRoutes = [...STATIC_ROUTES].sort((a, b) => (a.path === "/" ? 1 : b.path === "/" ? -1 : 0));
  for (const route of orderedRoutes) {
    await writeRouteHtml(route, template, posts);
  }

  // Conversion workflows remain directly accessible but are excluded from discovery files.
  for (const route of NOINDEX_ROUTES) {
    const dir = join(DIST, route.path.replace(/^\//, ""));
    await mkdir(dir, { recursive: true });
    const html = injectIntoTemplate(template, {
      title: route.title,
      description: route.description,
      canonical: absoluteUrl(route.path),
      bodyHtml: staticRouteBody(route),
      jsonLd: [],
      noIndex: true,
    });
    await writeFile(join(dir, "index.html"), html, "utf8");
  }

  // Individual articles.
  for (const post of posts) {
    const sources = normalizeSources(post.sources);
    const canonical = `${SITE_URL}/blog/${post.slug}`;
    const html = injectIntoTemplate(template, {
      title: post.title,
      description: post.meta_description || post.excerpt || post.title,
      canonical,
      bodyHtml: blogPostBody(post, sources),
      jsonLd: [
        articleJsonLd(post, sources),
        breadcrumbSchema([
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: canonical },
        ]),
      ],
      noIndex: false,
      ogImage: post.featured_image || undefined,
    });
    const dir = join(DIST, "blog", post.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html, "utf8");
  }

  // 404 document (real not-found page served by Vercel for unknown paths).
  await writeFile(join(DIST, "404.html"), build404(template), "utf8");

  // Crawler discovery files.
  await writeFile(join(DIST, "sitemap.xml"), buildSitemap(posts), "utf8");
  await writeFile(join(DIST, "robots.txt"), buildRobots(), "utf8");
  await writeFile(join(DIST, "llms.txt"), buildLlmsTxt(posts), "utf8");

  console.log(
    `[prerender-site] Prerendered ${STATIC_ROUTES.length} static route(s), ${posts.length} article(s), 404.html, sitemap.xml, robots.txt, and llms.txt.`,
  );
}

main().catch((error) => {
  console.error(`[prerender-site] ${error.message}`);
  process.exit(1);
});
