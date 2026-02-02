

# Payment Summary Caption for Submit Page

## Overview

Adding a clear, practical payment breakdown section below the Selected Services card that explains exactly how the customer will pay for these services in real terms.

## Design Approach

The payment summary will be a clean, well-organized section that groups costs by payment frequency:

- **Initial Payment** - One-time fees due at project start (Corporate Services + Consulting engagements)
- **Monthly Recurring** - Ongoing monthly costs (Accounting monthly fees)
- **Annual Fees** - Year-end costs (Statements, audits)
- **Grand Total Estimate** - Combined first-year cost with clear note that this is indicative

## Visual Structure

The summary will appear as a highlighted box below the services list, using a subtle background and clean typography:

```
------------------------------------------------------------
Payment Summary

INITIAL PAYMENT (due at engagement start)
Corporate Services                              $X,XXX
Consulting (indicative, scoped on confirmation) $X,XXX–$X,XXX
                                          ─────────────────
Initial Total                                   $X,XXX–$X,XXX

MONTHLY RECURRING
Accounting Services                             $XXX/month
First Year (12 months)                          $X,XXX

ANNUAL FEES (due at year-end)
Financial statements, Audit, etc.               $X,XXX

────────────────────────────────────────────────────────────
ESTIMATED FIRST-YEAR TOTAL                      $X,XXX–$X,XXX

Note: Final pricing confirmed after initial consultation.
Consulting fees scoped based on specific requirements.
------------------------------------------------------------
```

## Key Information to Display

1. **Initial Payment Section**
   - Corporate Services total (one-time)
   - Consulting total range (project-based, indicative)
   - Combined initial payment range

2. **Monthly Section**
   - Accounting monthly fee
   - Annualized (monthly x 12)

3. **Annual Fees Section**
   - Year-end statements
   - Audit fees (if applicable)

4. **Grand Total**
   - Combined first-year estimate
   - Range format when consulting is included

5. **Disclaimer Caption**
   - "Estimates based on your inputs"
   - "Consulting fees scoped during initial consultation"
   - "Final pricing confirmed before engagement"

---

## Technical Implementation

### File Changes

**`src/pages/Submit.tsx`**

1. Add a new "Payment Summary" section below the Selected Services card
2. Calculate totals:
   - `initialTotal`: Corporate total + Consulting midpoint
   - `monthlyTotal`: Accounting monthly
   - `annualTotal`: Accounting annual addons
   - `firstYearTotal`: initialTotal + (monthlyTotal x 12) + annualTotal

3. Add a new styled box with the payment breakdown:
   - Use `bg-muted/30` or subtle border to differentiate from cards
   - Clear section headers with `text-xs uppercase tracking-wide text-muted-foreground`
   - Price rows using the same `flex justify-between` pattern
   - Separator line before grand total
   - Disclaimer text in `text-xs text-muted-foreground`

### Component Structure

```tsx
{/* Payment Summary - Only show when there are selections */}
{hasAnySelection && (
  <Card>
    <CardHeader>
      <CardTitle>Payment Summary</CardTitle>
      <CardDescription>How you'll pay for these services</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Initial Payment Section */}
      {(hasCorporateData || hasConsultingData) && (
        <div className="space-y-2 pb-4 border-b">
          <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
            Initial Payment
          </h4>
          {/* Corporate line */}
          {/* Consulting line */}
          {/* Subtotal */}
        </div>
      )}
      
      {/* Monthly Recurring Section */}
      {hasAccountingData && (
        <div className="space-y-2 py-4 border-b">
          <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
            Monthly Recurring
          </h4>
          {/* Monthly fee */}
          {/* First year projection */}
        </div>
      )}
      
      {/* Annual Fees Section */}
      {hasAccountingData && accountingResult.annualAddons.length > 0 && (
        <div className="space-y-2 py-4 border-b">
          <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
            Annual Fees
          </h4>
          {/* Annual items */}
        </div>
      )}
      
      {/* Grand Total */}
      <div className="pt-4">
        <div className="flex justify-between font-medium text-base">
          <span>Estimated First-Year Total</span>
          <span>$X,XXX–$X,XXX</span>
        </div>
      </div>
      
      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground mt-4">
        Final pricing confirmed after consultation...
      </p>
    </CardContent>
  </Card>
)}
```

### Calculation Logic

```typescript
// Calculate totals for payment summary
const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
const consultingMin = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.min, 0);
const consultingMax = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.max, 0);

const initialMin = corporateTotal + consultingMin;
const initialMax = corporateTotal + consultingMax;

const monthlyFee = accountingResult?.totalMonthly ?? 0;
const annualFees = accountingResult?.annualAddons.reduce((sum, a) => sum + a.amount, 0) ?? 0;

const firstYearMin = initialMin + (monthlyFee * 12) + annualFees;
const firstYearMax = initialMax + (monthlyFee * 12) + annualFees;
```

### Styling Classes

| Element | Classes |
|---------|---------|
| Section header | `text-xs uppercase tracking-wide text-muted-foreground font-medium` |
| Price row | `flex justify-between text-sm` |
| Subtotal row | `flex justify-between text-sm pt-2 border-t border-border/50` |
| Grand total | `flex justify-between font-medium text-base pt-4` |
| Disclaimer | `text-xs text-muted-foreground mt-4 leading-relaxed` |

This implementation provides clear, practical payment information helping customers understand exactly how their costs will be structured.

