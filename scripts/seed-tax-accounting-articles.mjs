import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { TAX_ACCOUNTING_ARTICLES } from "./data/geo-tax-accounting-articles-2026.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const migrationPath = path.join(
  root,
  "supabase/migrations/20260725100000_publish_tax_accounting_geo_cluster.sql",
);

const columns = [
  "slug",
  "title",
  "excerpt",
  "content",
  "meta_description",
  "target_keyword",
  "key_takeaway",
  "sources",
  "published_at",
  "reviewed_at",
  "is_published",
  "author_name",
  "author_role",
  "reviewer_name",
  "reviewer_role",
];

const quote = (value) => {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${String(value).replaceAll("'", "''")}'`;
};

const rows = TAX_ACCOUNTING_ARTICLES.map((article) => [
  article.slug,
  article.title,
  article.excerpt,
  article.content,
  article.meta_description,
  article.target_keyword,
  article.key_takeaway,
  JSON.stringify(article.sources),
  article.published_at,
  article.reviewed_at,
  true,
  null,
  null,
  null,
  null,
]);

const valuesSql = rows
  .map(
    (row) =>
      `  (${row
        .map((value, index) => {
          const sql = quote(value);
          return columns[index] === "sources" && value !== null
            ? `${sql}::jsonb`
            : sql;
        })
        .join(", ")})`,
  )
  .join(",\n");

const migration = `-- Publish the 2026 GEO/SEO cluster for Thai tax and accounting.
-- Generated from scripts/data/geo-tax-accounting-articles-2026.mjs.
-- Idempotent: rerunning updates the same six slugs.

insert into public.blog_posts (${columns.join(", ")})
values
${valuesSql}
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  meta_description = excluded.meta_description,
  target_keyword = excluded.target_keyword,
  key_takeaway = excluded.key_takeaway,
  sources = excluded.sources,
  published_at = excluded.published_at,
  reviewed_at = excluded.reviewed_at,
  is_published = excluded.is_published,
  author_name = excluded.author_name,
  author_role = excluded.author_role,
  reviewer_name = excluded.reviewer_name,
  reviewer_role = excluded.reviewer_role;
`;

fs.mkdirSync(path.dirname(migrationPath), { recursive: true });
fs.writeFileSync(migrationPath, migration);
console.log(`Generated ${path.relative(root, migrationPath)}`);

if (!process.argv.includes("--publish")) process.exit(0);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE;

if (!url || !serviceKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to publish.",
  );
}

const payload = TAX_ACCOUNTING_ARTICLES.map((article) => ({
  ...article,
  is_published: true,
  author_name: null,
  author_role: null,
  reviewer_name: null,
  reviewer_role: null,
}));

const response = await fetch(`${url}/rest/v1/blog_posts?on_conflict=slug`, {
  method: "POST",
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  throw new Error(`Supabase publish failed (${response.status}): ${await response.text()}`);
}

const published = await response.json();
console.log(`Published ${published.length} tax/accounting articles.`);
