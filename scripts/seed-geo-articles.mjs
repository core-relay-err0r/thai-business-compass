import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { GEO_ARTICLES } from "./data/geo-articles-2026.mjs";

const MIGRATION_PATH = resolve(
  process.cwd(),
  "supabase/migrations/20260725090000_publish_company_bank_geo_cluster.sql",
);

function sqlString(value) {
  if (value == null) return "null";
  return `$article$${String(value)}$article$`;
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function buildMigration() {
  const values = GEO_ARTICLES.map((post) => `(
    ${sqlString(post.title)},
    ${sqlString(post.slug)},
    ${sqlString(post.excerpt)},
    ${sqlString(post.content)},
    ${sqlString(post.meta_description)},
    ${sqlString(post.target_keyword)},
    ${sqlString(post.key_takeaway)},
    ${sqlJson(post.sources)},
    ${sqlString(post.published_at)}::timestamptz,
    ${sqlString(post.reviewed_at)}::timestamptz,
    true
  )`).join(",\n");

  return `-- Publish the 2026 GEO/SEO cluster on Thai company setup and corporate banking.
-- Generated from scripts/data/geo-articles-2026.mjs.
-- Idempotent: rerunning updates editorial fields by slug without duplicating posts.

insert into public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  meta_description,
  target_keyword,
  key_takeaway,
  sources,
  published_at,
  reviewed_at,
  is_published
)
values
${values}
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
  updated_at = now();
`;
}

async function generateMigration() {
  await writeFile(MIGRATION_PATH, buildMigration(), "utf8");
  console.log(`[geo-articles] Generated ${MIGRATION_PATH}`);
}

async function publish() {
  const url =
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE ||
    process.env.SUPABASE_SERVICE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase URL or service-role key; publication aborted.");
  }

  const rows = GEO_ARTICLES.map((post) => ({
    ...post,
    author_name: null,
    author_role: null,
    reviewer_name: null,
    reviewer_role: null,
    featured_image: null,
    is_published: true,
  }));

  const response = await fetch(`${url}/rest/v1/blog_posts?on_conflict=slug`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(`Supabase upsert failed: ${response.status} ${await response.text()}`);
  }

  const inserted = await response.json();
  const expected = new Set(GEO_ARTICLES.map((post) => post.slug));
  const actual = inserted.filter((post) => expected.has(post.slug));

  if (actual.length !== GEO_ARTICLES.length) {
    throw new Error(`Expected ${GEO_ARTICLES.length} rows, received ${actual.length}.`);
  }

  console.log(
    `[geo-articles] Published ${actual.length} posts:\n${actual
      .map((post) => `- ${post.slug}`)
      .join("\n")}`,
  );
}

const shouldPublish = process.argv.includes("--publish");
await generateMigration();
if (shouldPublish) await publish();
