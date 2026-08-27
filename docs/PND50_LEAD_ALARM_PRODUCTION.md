# PND50 Production Lead Alarm Evidence

Date: 2026-08-02
Verdict: production PASS; owner phone receipt confirmed

## 1. Production path

`www.pnd50.com -> Vercel /api/contact -> VRVW Supabase send-contact -> Resend -> Lead Router Production -> private Production Blob -> Pushover`

- PND50 project: `prj_exJrD5aWfIguys5MMEEevmQnNTFd`
- PND50 Production deployment: `dpl_CANGbmJZU6tQwj8kNDu86DGbAp6H`
- Router project: `prj_USezCrGol5vt70QbbYHAhZCmR54m`
- Router Production deployment: `dpl_A27x9uipvPc25PMXgzJNafNxo9uq`
- Supabase project: `vrvwketvspgatfdqmrha`
- `send-contact`: ACTIVE v9, `verify_jwt=false`
- `send-submission`: ACTIVE v9, `verify_jwt=false`

No secret value is recorded in this evidence.

## 2. Security state

- Router health: HTTP 200, `mode=live`, `storage=durable-private-blob-production`.
- Production allowlist: `Scentifica,PND50 / Thai Business Compass`.
- VRVW holds only `LEAD_ROUTER_URL`, `LEAD_ROUTER_SHARED_SECRET`, and `LEAD_ROUTER_TIMEOUT_MS` for this connection.
- `LEAD_ROUTER_PROTECTION_BYPASS` was removed from VRVW.
- Pushover and Blob credentials remain only in the central Router.
- P1 remains capped at five alerts per Bangkok calendar day.

## 3. Build and deployment verification

| Check | Result |
| --- | --- |
| PND50 adapter tests | 6/6 PASS |
| PND50 application tests | 70/70 PASS |
| Router tests | 33/33 PASS |
| PND50 ESLint | PASS |
| PND50 local build | PASS |
| PND50 Preview | `dpl_rX5VaXQ93Vp3SPAm8dTxi3KjKG6c`, READY |
| PND50 Production | `dpl_CANGbmJZU6tQwj8kNDu86DGbAp6H`, READY |
| Production aliases | `pnd50.com`, `www.pnd50.com`, READY |
| Production IndexNow | No changed URLs; nothing submitted |

Both `/contact` and `/submit` were verified in Preview before Production. The production build prerendered seven static routes and 12 articles, and passed SEO validation.

## 4. Production smoke and recovery

The single marked website contact submission returned HTTP 200. Resend accepted the two contract-required sends:

- internal send ID prefix: `d9230aef...`;
- client test-sink send ID prefix: `69e69f52...`;
- Supabase `send-contact`: HTTP 200.

The first Router attempt exposed a deployment packaging defect: `config/LEAD_EVENT_SCHEMA.json` was absent, so Router returned HTTP 500 before storing an event or sending Pushover. Email delivery remained successful, as designed.

Router was redeployed with the schema file. A safe invalid-JSON probe then returned HTTP 400 `INVALID_JSON`, proving the handler loaded without creating a lead. The already accepted contact was recovered directly into Router without repeating the website submission or sending more email.

| Event | Priority | Dedupe | Delivery | Pushover |
| --- | --- | --- | --- | --- |
| Recovered base | P1 / `quote_request` | `8a70b7b8...` | `sent` | `pushover_sent=true`, request ID prefix `4679271a...` |
| Replay | P1 / `quote_request` | same key | `suppressed_duplicate` | `pushover_sent=false` |

Router runtime logs show HTTP 202 for both the base and replay. The equal dedupe key across separate event IDs proves durable duplicate suppression without a second email or push.

The optional Vercel `protocol-copy` helper reported `RESEND_API_KEY_2` absent. That key was intentionally removed earlier; this did not affect the two canonical Supabase/Resend sends or Router processing.

## 5. Remaining acceptance and rollback

- Eugene confirmed `ПРИШЛО PND50 PUSH` on 2026-08-02. Owner phone receipt is accepted.
- Git preservation target: the production commit containing this document preserves the tested Lead Alarm and subscription source together.
- Fast rollback: remove `LEAD_ROUTER_URL` and `LEAD_ROUTER_SHARED_SECRET` from VRVW. Resend then continues while Router dispatch disables itself.
- Full site rollback target: prior PND50 Production deployment `dpl_5W98wZnRJDw6cXywSbj2AaUFogxt`.
- Router rollback: remove PND50 from `LEAD_ALARM_ALLOWED_SOURCES`; Scentifica remains allowlisted.
