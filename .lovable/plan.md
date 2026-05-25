## AI Smart Recommender for /services

A one-shot AI assistant at the top of the /services page. The user answers a short form about their business; AI returns a tailored recommendation and can act on the page (pre-fill the Accounting Calculator, select corporate services, scroll to a section, or pre-fill the /submit form).

### User flow

1. New "Not sure where to start? Get an AI recommendation" card appears above the three sections on /services.
2. User clicks → modal/inline panel opens with a short form:
   - Business stage (new company / existing Thai Co. / planning to set up)
   - Foreign-owned? (yes/no/partial)
   - Monthly revenue range (reuse pricing.ts ranges)
   - Employees (slider 0–30)
   - VAT registered (yes/no/not sure)
   - Main goal (free text, 1–2 sentences: "what are you trying to achieve?")
3. Submit → loading state → AI returns:
   - **Plain-English summary** of their situation and what they need
   - **Recommended Corporate services** (list with reasons)
   - **Recommended Accounting setup** (mapped to AccountingInputs)
   - **Recommended Consulting topics** (if any)
   - Three action buttons:
     - "Apply to calculator" → pre-fills Accounting Wizard inputs + selects corporate services in ServiceContext, scrolls to Live Estimate
     - "Refine answers" → reopens form with values
     - "Proceed to request" → navigates to /submit with the recommendation pre-filled in the message

### Why "Explain + recommend + act"

The AI doesn't replace the wizard — it bootstraps it. After applying, the user can still tweak the calculator manually. This stays consistent with the project's self-discovery goal (no checkout, no sales pitch).

### Architecture

```text
/services page
   └── AIRecommender (new component)
         ├── form (controlled state)
         ├── calls supabase.functions.invoke("ai-recommend")
         └── on result → render structured cards + action buttons
                          └── ServiceContext.applyRecommendation(rec)
```

### Backend (Supabase Edge Function: `ai-recommend`)

- Uses Lovable AI Gateway via Vercel AI SDK (`google/gemini-3-flash-preview`)
- Validates input with Zod
- Reuses CAPTCHA + rate limiting pattern from existing `send-submission` function (basic IP throttle to prevent abuse)
- Uses **structured output** (`Output.object` + Zod schema) so the response is typed JSON, not free-form text
- System prompt embeds:
  - PND50 service catalog (corporate services list, accounting service rules, consulting topics) — built from `src/lib/pricing.ts` constants exported to a shared JSON
  - Thai compliance basics (VAT thresholds, audit requirements, payroll/SSO rules)
  - Hard rules: no pricing promises, no legal advice, always recommend "Get in touch" for edge cases (per copywriting memory)

### Structured response schema

```ts
{
  summary: string,                      // 2–3 sentence plain-English explanation
  corporateServices: string[],          // service IDs from pricing.ts
  accountingInputs: {                   // mirrors AccountingInputs partial
    accountingIntent, revenueRange, vatRegistered,
    employeeCount, payrollNeeded, transactionVolume,
    yearEndStatements, auditRequired, ...
  },
  consultingTopics: string[],           // topic IDs
  notes: string[],                      // bullet caveats / things to discuss
  confidence: "high" | "medium" | "low"
}
```

### Frontend wiring

- New file: `src/components/services/AIRecommender.tsx`
- New context method on `ServiceContext`:
  - `applyRecommendation(rec)` → sets `accountingInputs`, calls `calculateAccountingCost`, sets selected corporate + consulting services
- Add component at top of `Services.tsx` above the 3-column layout, with subtle CTA styling (matches premium dark-on-light system)
- Mobile: same flow, opens in a Sheet
- Loading: shimmer on result cards
- Errors: surface 429 (rate limit) and 402 (credits) clearly with retry/contact fallbacks

### Files to touch

| File | Change |
|---|---|
| `supabase/functions/ai-recommend/index.ts` | New edge function, Zod validation, AI SDK + Lovable Gateway, structured Output |
| `supabase/functions/_shared/ai-gateway.ts` | New shared provider helper |
| `supabase/functions/_shared/catalog.ts` | New: catalog snapshot fed into system prompt |
| `src/components/services/AIRecommender.tsx` | New main component (form + result + actions) |
| `src/contexts/ServiceContext.tsx` | Add `applyRecommendation` method |
| `src/pages/Services.tsx` | Mount `<AIRecommender />` above sections |
| `src/lib/pricing.ts` | Export catalog metadata for the shared catalog file (no logic changes) |

### Out of scope (not in this plan)

- Multi-turn chat (we agreed on one-shot recommender)
- Saving recommendations to database / user accounts
- Voice input
- Email of the recommendation (could add later by routing through `send-submission`)

### Open question for implementation

Should the AI recommender be **always visible** at the top of /services, or **collapsed by default** behind a "Get an AI recommendation" button? Default plan: collapsed by default to keep the page calm; one click expands it. You can change this when I implement.