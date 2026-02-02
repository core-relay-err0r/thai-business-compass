

# Design Improvements for Submit Page Service Summary

## Current State Analysis

The "Selected Services" card on the `/submit` page currently displays three sections (Accounting, Corporate, Consulting) using basic gray boxes (`bg-muted/50`). The design is functional but lacks visual refinement compared to the rest of the application's clean, premium aesthetic.

## Proposed Design Changes

### Visual Structure

The redesigned summary will feature:

- **Clean white/card background sections** instead of gray boxes
- **Subtle borders** to separate service categories
- **Improved typography hierarchy** with consistent sizing
- **Icon styling** matching the primary color scheme
- **Better price alignment** using a cleaner table-like layout

### Layout Per Section

**Accounting Services**
- Header row with calculator icon + "Accounting Services" title
- Two-column inline display: "Monthly: $X" and "Annual: $X"
- Required items shown as a subtle subtext line

**Corporate Services**
- Header row with building icon + "Corporate Services" title
- Individual line items in a clean list format
- Price right-aligned for each item
- Total row with border separator above

**Consulting Services**
- Header row with message icon + "Consulting Services" title
- Individual line items with price ranges
- Clean list format matching Corporate

### Empty State
- Maintains current centered messaging with navigation buttons

---

## Technical Implementation

### File Changes

**`src/pages/Submit.tsx`** (lines 232-324)

1. **Remove gray background boxes** from service sections
2. **Add proper borders** between sections using `divide-y` or explicit borders
3. **Restructure accounting section**:
   - Add section header with icon and title on same line
   - Show Monthly and Annual prices inline with labels
   - Move "Required" text below as muted subtext
4. **Restructure corporate section**:
   - Add section header with building icon
   - Create clean list with `justify-between` for name/price pairs
   - Use `text-primary` for service names to add visual interest
   - Add total row with `border-t` separator
5. **Restructure consulting section**:
   - Add section header with message icon
   - List items with price ranges in same format as corporate
6. **Adjust spacing**:
   - Use `space-y-6` between major sections
   - Add `pb-4` or `pb-6` with borders between categories
7. **Typography refinements**:
   - Section titles: `font-medium text-base`
   - Item names: `text-sm text-primary` for interactivity feel
   - Prices: `text-sm font-medium` right-aligned
   - Total labels: `text-sm font-medium`

### Code Changes Summary

```tsx
{/* Accounting Section */}
<div className="pb-6 border-b border-border last:border-0 last:pb-0">
  <div className="flex items-center gap-2 mb-3">
    <Calculator className="h-4 w-4 text-primary" />
    <span className="font-medium">Accounting Services</span>
  </div>
  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mb-2">
    <div>
      <span className="text-primary">Monthly:</span>{" "}
      <span className="font-medium">$205</span>
    </div>
    <div>
      <span className="text-primary">Annual:</span>{" "}
      <span className="font-medium">$2,460</span>
    </div>
  </div>
  <div className="text-xs text-muted-foreground">
    Required: Monthly bookkeeping, Tax filings
  </div>
</div>

{/* Corporate Section */}
<div className="pb-6 border-b border-border last:border-0 last:pb-0">
  <div className="flex items-center gap-2 mb-3">
    <Building2 className="h-4 w-4 text-primary" />
    <span className="font-medium">Corporate Services</span>
  </div>
  <div className="space-y-2">
    {services.map(s => (
      <div className="flex justify-between text-sm">
        <span className="text-primary">{s.name}</span>
        <span className="font-medium">${s.price}</span>
      </div>
    ))}
    <div className="flex justify-between text-sm pt-3 border-t border-border/50">
      <span>Total</span>
      <span className="font-medium">$5,400</span>
    </div>
  </div>
</div>
```

### Styling Tokens

| Element | Classes |
|---------|---------|
| Section wrapper | `pb-6 border-b border-border last:border-0 last:pb-0` |
| Section header | `flex items-center gap-2 mb-3` |
| Icon | `h-4 w-4 text-primary` |
| Title | `font-medium` (inherits base text size) |
| Item row | `flex justify-between text-sm` |
| Item name | `text-primary` |
| Item price | `font-medium` |
| Total row | `flex justify-between text-sm pt-3 border-t border-border/50` |
| Subtext | `text-xs text-muted-foreground` |

This approach maintains the clean, premium aesthetic defined in the design principles while providing clear visual hierarchy and better scannability for users reviewing their selections before submission.

