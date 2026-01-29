

## Remove Redundant "Proceed to request" CTA from Live Estimate Sidebar

The floating selection summary at the bottom of the screen already contains the "Proceed to request" button. Having the same CTA in the sidebar's Live Estimate panel creates redundancy and clutter.

---

### Current State

Two places show "Proceed to request":

| Location | Purpose |
|----------|---------|
| **Floating summary** (bottom of screen) | Appears when services are selected; primary action point |
| **Sidebar Live Estimate** | Shows running total and duplicates the CTA |

---

### Changes

**Remove from `src/components/accounting/LiveEstimate.tsx`:**

1. Remove the "Proceed to request" button (lines 149-155)
2. Remove the "One-time total" line that precedes it (lines 143-148) since this is already shown inline with the subtotal
3. Keep only the "Clear all" button for resetting selections
4. Remove the unused `useNavigate` hook and `ArrowRight` import

---

### Result

The sidebar footer will simplify to just show the "Clear all" button, while the floating summary handles the primary "Proceed to request" action.

```text
Before:                          After:
+------------------------+       +------------------------+
| One-time total  $3,700 |       |                        |
| [Proceed to request →] |  -->  | [Clear all]            |
| [Clear all]            |       |                        |
+------------------------+       +------------------------+
```

