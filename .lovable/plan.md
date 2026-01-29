

## Live Estimate Panel - Always Visible with All Services

Transform the Live Estimate sidebar panel to always be visible and display a unified summary of all selected services across the page (Corporate, Accounting, and Consulting).

---

### What You'll Get

1. **Always-visible estimate panel** in the left sidebar (regardless of which section you're viewing)
2. **Unified pricing summary** combining:
   - Corporate Services (one-time fees)
   - Accounting Services (monthly/annual)
   - Consulting Services (price ranges)
3. **Real-time updates** as you select/deselect services anywhere on the page
4. **Smart categorization** showing one-time vs recurring costs

---

### How It Will Look

The sidebar will show:

```
LIVE ESTIMATE
─────────────────

One-time
  Company Incorporation     $1,500
  Structural Change           $500
  ─────────────────────────
  Subtotal                  $2,000

Recurring
  Monthly                     $240
  Annual (incl. year-end)   $3,230

Consulting (ranges)
  Reduce Costs        $800–$2,200
  Due Diligence     $1,100–$2,800
```

When nothing is selected, it shows a prompt: "Select services to see your estimate."

---

### Technical Changes

| File | Change |
|------|--------|
| `src/components/accounting/LiveEstimate.tsx` | Complete rewrite to pull all three service types from context and display unified summary |
| `src/pages/Services.tsx` | Remove the `activeSection === "accounting"` condition so the panel always shows |

The component will use existing context data:
- `selectedCorporateServices` - array with `id`, `name`, `price`
- `selectedConsultingServices` - array with `id`, `name`, `priceRange`
- `liveAccountingResult` - calculated accounting totals

---

### Summary Calculation Logic

- **Corporate Total**: Sum of all `selectedCorporateServices[].price`
- **Accounting**: Use existing `liveAccountingResult.totalMonthly` and `totalAnnual`
- **Consulting Range**: Aggregate min/max from all `selectedConsultingServices[].priceRange`
- **Grand Total**: Show one-time + first year recurring + consulting midpoint (as estimate)

