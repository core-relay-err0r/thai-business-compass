

# Redesign Email Format for /submit Page

## Overview

The email sent from the /submit page needs to be redesigned to include all the information shown on the page, with consistent USD formatting and a practical payment breakdown that matches what the user sees.

## Current Issues

1. **Currency mismatch**: Email uses Thai Baht (฿) but the UI displays USD ($)
2. **Missing Payment Summary**: The email doesn't include the practical payment breakdown (Initial, Monthly, Annual, First-Year Total)
3. **Missing accounting details**: No breakdown of monthly/annual addons from accounting calculations
4. **Limited structure**: Current email only shows basic totals without the full cost structure

## Proposed Email Design

The redesigned email will mirror the /submit page layout with these sections:

```
┌────────────────────────────────────────────────────────────┐
│  Header (gradient): "New Service Request from [Name]"      │
├────────────────────────────────────────────────────────────┤
│  Contact Information                                       │
│  • Name, Email, Phone, Preferred Contact                   │
├────────────────────────────────────────────────────────────┤
│  Company Information                                       │
│  • Company Name, Registration #, Industry                  │
├────────────────────────────────────────────────────────────┤
│  Selected Services (detailed breakdown)                    │
│  ┌─ Accounting ──────────────────────────────────────────┐ │
│  │ Monthly Base: $170                                    │ │
│  │ + VAT Reporting: $70                                  │ │
│  │ + Payroll (3 employees): $66                          │ │
│  │ = Monthly Total: $306                                 │ │
│  │                                                       │ │
│  │ Annual Addons:                                        │ │
│  │ • Financial Statements: $350                          │ │
│  │ • Annual Audit: $700                                  │ │
│  │ Required: Monthly bookkeeping, VAT, Payroll...        │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌─ Corporate ───────────────────────────────────────────┐ │
│  │ • Company Incorporation: $1,500                       │ │
│  │ • Registered Office: $300                             │ │
│  │ Total: $1,800                                         │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌─ Consulting ──────────────────────────────────────────┐ │
│  │ • Reduce Costs: $800–$2,200                           │ │
│  │ • Due Diligence: $1,100–$2,800                        │ │
│  │ Total: $1,900–$5,000                                  │ │
│  └───────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│  💵 Payment Summary (highlighted section)                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ INITIAL PAYMENT (due at start)                        │ │
│  │   Corporate Services: $1,800                          │ │
│  │   Consulting (indicative): $1,900–$5,000              │ │
│  │   Initial Total: $3,700–$6,800                        │ │
│  │                                                       │ │
│  │ MONTHLY RECURRING                                     │ │
│  │   Accounting Services: $306/month                     │ │
│  │   First Year (12 months): $3,672                      │ │
│  │                                                       │ │
│  │ ANNUAL FEES (due at year-end)                         │ │
│  │   Financial Statements: $350                          │ │
│  │   Annual Audit: $700                                  │ │
│  │   Annual Total: $1,050                                │ │
│  │ ═════════════════════════════════════════════════════ │ │
│  │ ESTIMATED FIRST-YEAR TOTAL: $8,422–$11,522            │ │
│  └───────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│  Additional Notes (if provided)                            │
├────────────────────────────────────────────────────────────┤
│  Footer: Disclaimer about estimates                        │
└────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### File Changes

**`supabase/functions/send-submission/index.ts`**

1. **Update the interface** to include the full accounting result structure:
   ```typescript
   interface SubmissionRequest {
     contactInfo: { ... };
     companyInfo: { ... };
     notes?: string;
     accountingResult?: {
       totalMonthly: number;
       totalAnnual: number;
       monthlyBase: number;
       monthlyAddons: Array<{ name: string; amount: number; required: boolean }>;
       annualAddons: Array<{ name: string; amount: number; required: boolean }>;
       requiredItems: string[];
       recommendedItems: string[];
     };
     selectedCorporateServices: Array<{ ... }>;
     selectedConsultingServices: Array<{ ... }>;
   }
   ```

2. **Change currency formatting** from THB to USD:
   ```typescript
   // Before: ฿${formatPrice(price)}
   // After:  $${formatPrice(price)}
   ```

3. **Add accounting breakdown section** showing:
   - Monthly base fee
   - Each monthly addon with name and amount
   - Monthly total
   - Each annual addon with name and amount
   - Required items list

4. **Add Payment Summary section** with:
   - Initial Payment breakdown (Corporate + Consulting)
   - Monthly Recurring breakdown
   - Annual Fees breakdown
   - Grand total calculation (First-Year Total)

5. **Add disclaimer** at the bottom matching the UI

### Email Styling

| Element | Style |
|---------|-------|
| Section headers | Bold, dark color, border-bottom |
| Price rows | Two-column layout (name + amount) |
| Payment Summary | Light blue/gray background to highlight |
| Grand total | Bold, larger font, separator line above |
| Disclaimer | Small text, muted color |

### Calculation Logic (in edge function)

```typescript
// Calculate totals for payment summary
const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
const consultingMin = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.min, 0);
const consultingMax = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.max, 0);

const initialMin = corporateTotal + consultingMin;
const initialMax = corporateTotal + consultingMax;

const monthlyFee = accountingResult?.totalMonthly ?? 0;
const annualFees = accountingResult?.annualAddons?.reduce((sum, a) => sum + a.amount, 0) ?? 0;

const firstYearMin = initialMin + (monthlyFee * 12) + annualFees;
const firstYearMax = initialMax + (monthlyFee * 12) + annualFees;
```

---

## Summary of Changes

1. Update `supabase/functions/send-submission/index.ts`:
   - Expand the `SubmissionRequest` interface to accept full accounting data
   - Change all currency symbols from ฿ to $
   - Add detailed accounting breakdown (base + addons)
   - Add Payment Summary section with Initial/Monthly/Annual breakdown
   - Calculate and display Estimated First-Year Total
   - Add professional disclaimer text

The email will now provide recipients with the same comprehensive, practical payment information that users see on the /submit page, all displayed consistently in USD.

