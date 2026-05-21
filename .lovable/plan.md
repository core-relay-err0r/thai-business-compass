## Goal

Replace the current /services page with the uploaded reference's 4-step wizard:
**Monthly accounting → Year-end & audit → Company services → Review**, adopting its pricing constants (audit bands, $300 base monthly + $100/50 txns, $100/50 VAT, $100/50 WHT, $100 per 5 employees payroll, etc.) as the new source of truth in `src/lib/pricing.ts`.

The wizard lives on /services and replaces the existing 3-section layout (CorporateServices / AccountingWizard / ConsultingServices). Review step shows totals + estimate detail + CTA to /submit (no in-page checkout, per project rules).

## Files

| File | Change |
|---|---|
| `src/lib/pricing.ts` | Rewrite constants: AUDIT_BANDS, CORPORATE_SERVICES, OFFICE_PRICES, DOCUMENT_SERVICES, CONSULTING_SERVICES, VAT_RATE=0.07, monthly band fn, transactionFee fn, payroll fn. Export helpers `vatOf`, `totalWithVat`, `priceImpactText`. Keep AccountingInputs shape extended with new fields. |
| `src/contexts/ServiceContext.tsx` | Replace state with the reference's input model: monthly (transactions, employees, vatReporting+vatTxns, wht+whtTxns, rush), annual (fiscalYears, revenueBand, catchUp, backlogYears), corporate (map of booleans + office contract enums + taxResidenceQuantity), consulting (map). Provide `calculateAll()` returning monthly/annual/oneTime/yearly blocks and grand totals. Drop the old applyRecommendation if it depends on removed fields (adapt to new shape). |
| `src/pages/Services.tsx` | New layout: top header (title + FX rate), stepper nav (Monthly / Year-end / Company / Review), one panel visible at a time, prev/next/skip controls, sticky LiveEstimate. |
| `src/components/services/steps/MonthlyStep.tsx` | NEW — fields & live notes per reference |
| `src/components/services/steps/AnnualStep.tsx` | NEW |
| `src/components/services/steps/CompanyStep.tsx` | NEW (Setup & office, Review & changes, Documents & legalization, Advisory) |
| `src/components/services/steps/ReviewStep.tsx` | NEW — totals cards, details accordion, "Proceed to request" → /submit prefilled |
| `src/components/services/PriceBadge.tsx` | NEW — shared "+$X before VAT / +$Y incl. VAT" badge |
| `src/components/accounting/AccountingWizard.tsx` | Delete (replaced by stepped layout) |
| `src/components/accounting/LiveEstimate.tsx` | Refactor to consume new context shape, keep sticky panel + mobile sheet |
| `src/components/corporate/CorporateServices.tsx`, `ConsultingServices.tsx` | Delete (folded into CompanyStep) |
| `src/components/services/AIRecommender.tsx` | Keep, but rewire `applyRecommendation` to new context shape |
| `src/pages/Submit.tsx` | Accept prefilled `estimate` text via location.state and show it in the message |

## UX rules (from project memory)

- "Get in touch" / "Proceed to request" — never "Contact us" / "Checkout".
- Dark-on-light premium, brand blue accent, ample whitespace, semantic tokens only.
- Mobile: stepper collapses to dots, LiveEstimate via MobileEstimateSheet.
- One H1 ("Services & estimate"), keep SEO head.

## Structure

```text
/services
  ├── header (title, FX input)
  ├── Stepper (1 Monthly · 2 Year-end · 3 Company · 4 Review)
  ├── <main grid>
  │     ├── Step panel (one of Monthly/Annual/Company/Review)
  │     └── Sticky LiveEstimate (desktop) / Sheet trigger (mobile)
  └── Step controls (Back · Status · Skip · Next)
```

## Out of scope

- Copy-to-clipboard estimate (Review CTA goes straight to /submit instead — aligns with "no checkout" rule).
- Email quote button inside wizard (Submit form already handles that).
- AIRecommender layout rework (kept above stepper, untouched visually).
- Touching telegram/feedback/clarity code.

## Risks

- ServiceContext shape change ripples into AIRecommender and any code reading old fields — must update both in same pass to keep build green.
- LiveEstimate currently couples tightly to old wizard; needs rewrite against new selectors.
