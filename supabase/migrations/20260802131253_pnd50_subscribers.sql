create table if not exists public.pnd50_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  brand text not null default 'pnd50',
  interest text not null,
  language text not null,
  source_page text not null,
  signup_location text not null,
  consent_timestamp timestamptz not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  status text not null default 'active',
  unsubscribe_token uuid not null default gen_random_uuid(),
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint pnd50_subscribers_brand_check check (brand = 'pnd50'),
  constraint pnd50_subscribers_email_normalized_check check (email = lower(btrim(email))),
  constraint pnd50_subscribers_email_length_check check (char_length(email) between 3 and 320),
  constraint pnd50_subscribers_interest_check check (
    interest in (
      'bookkeeping',
      'tax_filing',
      'vat',
      'withholding_tax',
      'payroll',
      'company_registration',
      'corporate_changes',
      'general_thailand_compliance'
    )
  ),
  constraint pnd50_subscribers_language_check check (language in ('en', 'ru')),
  constraint pnd50_subscribers_signup_location_check check (
    signup_location in (
      'home_services',
      'service_accounting',
      'service_corporate',
      'article_end',
      'pre_footer',
      'popup'
    )
  ),
  constraint pnd50_subscribers_status_check check (status in ('active', 'unsubscribed')),
  constraint pnd50_subscribers_brand_email_key unique (brand, email),
  constraint pnd50_subscribers_unsubscribe_token_key unique (unsubscribe_token)
);

create index if not exists pnd50_subscribers_active_interest_idx
  on public.pnd50_subscribers (interest, language)
  where status = 'active';

alter table public.pnd50_subscribers enable row level security;

revoke all on table public.pnd50_subscribers from anon, authenticated;
grant select, insert, update on table public.pnd50_subscribers to service_role;

comment on table public.pnd50_subscribers is
  'Consent-backed PND50 practical-update subscriptions. Server-only access; no public RLS policies.';
