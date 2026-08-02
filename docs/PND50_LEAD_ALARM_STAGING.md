# PND50 Lead Alarm Staging

Status: VRVW hosted staging PASS on 2026-08-02. Router Preview is private and dry-run. Pushover and PND50 production routing remain unchanged.

## Current Boundary

- Supabase target: `vrvwketvspgatfdqmrha`, main Production environment, explicitly approved for this staging adapter.
- Deployed functions: `send-contact` and `send-submission` only.
- Router target: private Vercel Preview deployment `dpl_CgowrudJ7ueFspFoHhNteeWv7UGz`.
- Router mode: `LEAD_ALARM_DRY_RUN=true` with private durable Blob storage.
- PND50 Vercel production source still points to `gdjckutnbacltgamnqkt`.
- No database, DNS, Git, Production Router, or Pushover change is part of this staging state.

## Event Policy

- A quotation or accounting request with accepted internal/company email becomes P1.
- A routine identified contact remains P2 and journal-only.
- Genuine urgent, payment, bank, filing, or deadline signals may become P0.
- Duplicate events share the central Router dedupe policy and cannot claim a second notification.
- Router failure must not cancel successful Resend delivery.

## Supabase Secrets

VRVW contains only the following Router connection values:

```text
LEAD_ROUTER_URL=<private Router Preview base ending in /api>
LEAD_ROUTER_SHARED_SECRET=<Preview-only shared secret>
LEAD_ROUTER_PROTECTION_BYPASS=<existing Vercel automation bypass>
LEAD_ROUTER_TIMEOUT_MS=1500
```

Never place Pushover or Blob credentials in PND50. Do not reuse the Production Router secret in staging.

## Evidence

- Adapter tests: 6/6 PASS.
- Central Router tests: 33/33 PASS.
- PND50 application tests: 70/70 PASS.
- ESLint: PASS.
- Both hosted Edge Functions: ACTIVE v7, `verify_jwt=false`, adapter and Resend acceptance gate present.
- Both hosted OPTIONS probes: HTTP 200.
- One approved contact smoke: HTTP 200 and both required Resend messages accepted.
- Fresh Router Preview health: HTTP 200, dry-run, private durable Blob storage.
- Hosted P1 base event: `delivery_status=dry_run`, `pushover_sent=false`.
- Hosted replay: same dedupe key, `duplicate=true`, `delivery_status=suppressed_duplicate`, `pushover_sent=false`.

The first smoke exposed a stale Preview classifier that marked a quotation P0. It remained dry-run and sent no Pushover. A fresh Preview was deployed from the tested Router source before final P1 and dedupe verification.

## Rollback

Remove `LEAD_ROUTER_URL` from VRVW. The adapter then disables itself while existing Resend behavior continues.

## Production Gate

Do not activate Pushover or change the PND50 production function host without:

`APPROVE PND50 PRODUCTION LEAD ALARM`

That approval is limited to the canonical host decision, Router Production allowlist and shared secret, any required PND50 production route change, one marked production smoke, and one duplicate replay.
