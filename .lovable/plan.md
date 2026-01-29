

## Fix Overflowing Live Estimate Panel with Scrollable Content

When users select many services, the Live Estimate panel content exceeds the viewport height and becomes inaccessible. This plan adds a scrollable area while keeping the CTA buttons always visible.

---

### Current Problem

The sticky sidebar has a fixed position but no height constraint or scroll mechanism. When the estimate content grows beyond the viewport height:
- Users cannot see all selected services
- The "Proceed to request" button may become inaccessible
- The sidebar overflows off-screen

---

### Solution Design

Split the Live Estimate into two zones:

```text
+----------------------------------+
|  Section Info                    |
|  (title + description)           |
+----------------------------------+
|  SECTIONS                        |
|  - Corporate Services            |
|  - Accounting Calculator         |
|  - Business Consulting           |
+----------------------------------+
|  LIVE ESTIMATE                   |
|  ┌─────────────────────────────┐ |
|  │  One-time items...          │ |
|  │  Recurring items...         │ | <- Scrollable area
|  │  Consulting items...        │ |
|  └─────────────────────────────┘ |
+----------------------------------+
|  Proceed to request  [button]    | <- Sticky footer (always visible)
|  Clear all                       |
+----------------------------------+
```

---

### Technical Approach

**1. Add height constraints to the sticky sidebar**

Use `calc()` with viewport height minus header and padding to determine maximum available space.

**2. Wrap estimate content in ScrollArea**

Use the existing Radix `ScrollArea` component to create a scrollable region for the service list while keeping the CTA buttons fixed at the bottom.

**3. Restructure LiveEstimate component**

Separate the scrollable content (service items) from the sticky footer (CTA buttons):

| Zone | Content | Behavior |
|------|---------|----------|
| Scrollable | One-time, Recurring, Consulting lists | Scrolls when content exceeds height |
| Fixed Footer | "Proceed to request" + "Clear all" buttons | Always visible at bottom |

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Services.tsx` | Add `max-h-[calc(100vh-16rem)]` and `flex flex-col` to the sticky sidebar container; wrap Live Estimate section in a flex layout with overflow |
| `src/components/accounting/LiveEstimate.tsx` | Restructure to separate scrollable content from fixed CTA footer; wrap item lists in `ScrollArea` component |

---

### Implementation Details

**Services.tsx sidebar changes:**
```tsx
<div className="sticky top-32 flex flex-col max-h-[calc(100vh-10rem)]">
  {/* Section info - fixed height */}
  <div className="space-y-4 flex-shrink-0">...</div>
  
  {/* Section nav - fixed height */}
  <div className="space-y-2 flex-shrink-0">...</div>
  
  {/* Live Estimate - flexible, can scroll */}
  <div className="pt-6 border-t flex-1 min-h-0 overflow-hidden">
    <LiveEstimate />
  </div>
</div>
```

**LiveEstimate.tsx restructure:**
```tsx
<div className="h-full flex flex-col">
  <h3>Live Estimate</h3>
  
  {/* Scrollable content */}
  <ScrollArea className="flex-1 min-h-0">
    <div className="space-y-6 pr-2">
      {/* One-time items */}
      {/* Recurring items */}
      {/* Consulting items */}
    </div>
  </ScrollArea>
  
  {/* Sticky CTA footer - always visible */}
  <div className="pt-4 border-t mt-auto flex-shrink-0">
    <Button>Proceed to request</Button>
    <Button>Clear all</Button>
  </div>
</div>
```

---

### Visual Behavior

- When content fits: No scrollbar visible, normal appearance
- When content overflows: Subtle scrollbar appears, CTA buttons remain fixed at bottom
- The scrollbar uses the existing muted design from the ScrollArea component

