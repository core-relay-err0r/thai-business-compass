# Make the Accounting Wizard card auto-expand

## Goal
The wizard step content currently sits inside a fixed-height box (400px on mobile, 450px on desktop) with an internal scrollbar. When a step has more content than that, users have to scroll inside the card. Change it so the card grows to fit whatever step is shown — no internal scrolling.

## Change
**File:** `src/components/accounting/AccountingWizard.tsx` (line 151–152)

Current:
```tsx
<CardContent className="h-[400px] sm:h-[450px] p-0 flex flex-col">
  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
```

New:
```tsx
<CardContent className="p-0 flex flex-col">
  <div className="px-4 sm:px-6 py-4">
```

That removes the fixed height and the inner overflow, so the card and its inner step container both size to content. The footer with Back / Next / Submit stays right under the content (still inside the same flex column, just no longer pushed to a fixed bottom).

## What stays the same
- All step content, validation, submit logic, and the green "saved" state are untouched.
- Header, progress bar, and step labels are untouched.
- Page-level scrolling on `/services` continues to work normally — the card just becomes taller when a step needs more room.

## Verification
- Walk through Steps 0–5 on `/services#accounting` and confirm no inner scrollbar appears and the Next/Back/Submit row sits flush under the step content.
- Check on mobile width (~375px) that taller steps (Step 3 Operations, Step 5 Summary) expand cleanly without being clipped.
