-- Canonical schema for the public editorial blog.
-- Public visitors may read published posts only; writes require the service role.

create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  featured_image text,
  meta_description text,
  target_keyword text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc)
  where is_published = true;

alter table public.blog_posts enable row level security;

drop policy if exists "Published blog posts are publicly readable" on public.blog_posts;
create policy "Published blog posts are publicly readable"
  on public.blog_posts
  for select
  to anon, authenticated
  using (is_published = true);

-- No client insert/update/delete policy is intentional. Editorial writes use
-- the server-side service role, which bypasses RLS.

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_posts_updated_at();
