alter table public.blog_posts
  add column if not exists author_name text,
  add column if not exists author_role text,
  add column if not exists reviewer_name text,
  add column if not exists reviewer_role text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists key_takeaway text,
  add column if not exists sources jsonb not null default '[]'::jsonb;

alter table public.blog_posts
  drop constraint if exists blog_posts_sources_is_array;

alter table public.blog_posts
  add constraint blog_posts_sources_is_array
  check (jsonb_typeof(sources) = 'array');

comment on column public.blog_posts.author_name is
  'Public name of the person who wrote the article. Leave null for legacy PND50 editorial content.';
comment on column public.blog_posts.author_role is
  'Public professional role of the named author. Do not use unverified credentials.';
comment on column public.blog_posts.reviewer_name is
  'Public name of the person who reviewed the article.';
comment on column public.blog_posts.reviewer_role is
  'Public professional role of the reviewer. Do not use unverified credentials.';
comment on column public.blog_posts.reviewed_at is
  'Date of the substantive editorial or technical review, not an automatic update timestamp.';
comment on column public.blog_posts.key_takeaway is
  'Concise answer-first summary displayed near the article heading.';
comment on column public.blog_posts.sources is
  'Array of objects with title, publisher, url, and optional published_at or accessed_at fields.';
