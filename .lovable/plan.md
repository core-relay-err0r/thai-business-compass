

## Plan: Reset submitted state on "Adjust my answers" and "Back" navigation

### What changes
Two modifications in `src/components/accounting/AccountingWizard.tsx`:

1. **`handleAdjust` function** (line 110-112): Add `setHasSubmitted(false)`, `setLiveResult(null)`, and `setLiveAccountingResult(null)` to clear the submitted state and remove the price from the live estimate.

2. **`handleBack` function** (line 90-93): Add the same reset logic when navigating back from any step while in submitted state — clear `hasSubmitted`, `liveResult`, and `liveAccountingResult`.

### Technical details
- `handleAdjust`: Currently only resets `currentStep` to 0. Will also clear submitted state and remove accounting totals from the estimate panel.
- `handleBack`: Will check if `hasSubmitted` is true, and if so, clear the submitted state and prices before stepping back. This ensures clicking the back arrow on the overview step also resets things.
- The green border/background on the Card and the "Saved" button state will automatically disappear since they're driven by `hasSubmitted`.

