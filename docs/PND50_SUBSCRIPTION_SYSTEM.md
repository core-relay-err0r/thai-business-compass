# PND50 Practical Updates Subscription

## Status

Implemented and production-activated at the backend on 2026-08-02. The isolated subscriber migration is applied to Supabase project `vrvwketvspgatfdqmrha`; `subscribe-updates` and `unsubscribe-updates` are active; and the shared relay credential is configured only for Vercel Production and Supabase Edge Functions. The website source in this commit is the Git-triggered Vercel Production release artifact.

Git preservation completed through PR #2 at merge commit `a537089`. The first public form smoke test exposed a stale relay credential in the initial deployment, so the Vercel Production and Supabase Edge Function values were re-synchronized. The valid production deployment must postdate that credential rotation.

One controlled synthetic subscription, duplicate replay, and unsubscribe passed. The replay updated one existing row instead of creating another. No campaign email, legal or tax advice, Pushover alert, or contact-form submission was sent by this acceptance test.

The current public site is English-only. Russian copy is ready and activates automatically for a future `/ru` route or Russian document language.

## Existing Architecture

- Vite, React, TypeScript, React Router, Tailwind CSS, and shadcn/ui.
- Services are sections on `/services`, not separate pages.
- Existing contact and request forms use Vercel routes, Supabase functions, and Resend transactional email.
- Microsoft Clarity is the current analytics provider.
- No newsletter CRM or subscriber list existed before this change.

## Form Placement

| Placement | `signup_location` | Interest source |
| --- | --- | --- |
| Home, after the core service overview | `home_services` | `general_thailand_compliance` |
| Services, after Corporate services | `service_corporate` | `company_registration` |
| Services, after Accounting and Tax | `service_accounting` | `bookkeeping` |
| End of every published article | `article_end` | Article inference |
| Global pre-footer, except legal and preference pages | `pre_footer` | Route inference |
| Desktop popup | `popup` | Route inference |

The desktop popup opens after 35 seconds, 50% scroll, or desktop exit intent. It is suppressed after success, for 14 days after dismissal, and on contact, request, privacy, terms, and unsubscribe pages. It is disabled below 768 px so it cannot cover mobile content or calls to action.

## Segmentation

- `bookkeeping`
- `tax_filing`
- `vat`
- `withholding_tax`
- `payroll`
- `company_registration`
- `corporate_changes`
- `general_thailand_compliance`

Article interest is inferred from explicit VAT, withholding-tax, payroll, bookkeeping, company-registration, corporate-change, and tax-filing rules. Unknown pages use `general_thailand_compliance`.

## Storage

The isolated `public.pnd50_subscribers` table stores normalized email, brand, interest, language, source page, signup location, consent timestamp, UTM attribution, referrer, status, unsubscribe token, and lifecycle timestamps.

The unique constraint is `(brand, email)`, so a repeat signup updates and reactivates one record. Row-level security is enabled and browser roles have no table access. The browser sends to a validated Vercel route, which forwards through a private adapter to hosted functions.

The adapter can later target a central subscriber service without changing the forms.

## Consent And Analytics

- The form asks only for email and links to the updated Privacy Policy.
- `/unsubscribe?token=<uuid>` performs server-side unsubscribe and is `noindex`.
- The current system collects subscribers only. It does not generate or send legal, tax, or accounting advice.
- Analytics events: `subscription_view`, `subscription_submit`, `subscription_success`, and `subscription_error`.
- Analytics metadata excludes email.

## Verification

- 87 tests passed.
- 6 Lead Alarm regression tests passed.
- ESLint passed.
- Application and Vercel route TypeScript checks passed.
- Both new hosted functions passed Deno checking.
- Production build, prerender, and SEO validation passed.
- Supabase production functions rejected unauthenticated requests with HTTP 401.
- Controlled subscribe and duplicate replay returned HTTP 200 and produced one row.
- Controlled unsubscribe returned HTTP 200 and set that row to `unsubscribed`.
- Desktop inline form and popup verified at 1440 x 1000.
- Mobile form verified at 390 x 844 with no horizontal overflow and no popup overlay.
- Browser console contained no errors or warnings in the tested states.
