

# Unified Services Page with Scroll-Based Navigation

## Overview
Consolidate Corporate, Accounting, and Consulting into a single `/services` page with a sticky left sidebar that dynamically updates as users scroll through each service section.

## Layout Structure

```text
+------------------+----------------------------------------+
|                  |                                        |
|  STICKY SIDEBAR  |   SCROLLABLE CONTENT                   |
|                  |                                        |
|  Current section |   [Corporate Section]                  |
|  - Title         |     Starting a New Company (grid)      |
|  - Description   |     Existing Company Services (grid)   |
|                  |                                        |
|  Navigation:     |   [Accounting Section]                 |
|  > Corporate     |     Wizard component                   |
|    Accounting    |                                        |
|    Consulting    |   [Consulting Section]                 |
|                  |     Service cards grid                 |
+------------------+----------------------------------------+
```

## Section Navigation
The sidebar will track and display three main sections:
1. **Corporate** - One-time corporate services (icon: Building2)
2. **Accounting** - Monthly + yearly cost calculator (icon: Calculator)
3. **Consulting** - Business problem solving (icon: MessageSquare)

## Changes

### 1. Create New Unified Services Page
**File:** `src/pages/Services.tsx`
- Single page combining all three service types
- Uses same sticky sidebar pattern as current `/corporate`
- Scroll tracking with refs for each major section
- Smooth scroll navigation when clicking sidebar items

### 2. Update CorporateServices Component
**File:** `src/components/corporate/CorporateServices.tsx`
- Remove the sticky sidebar (will be handled by parent Services page)
- Export as embeddable component without its own sidebar
- Keep floating selection summary
- Add ref forwarding for scroll tracking

### 3. Update ConsultingServices Component
**File:** `src/components/consulting/ConsultingServices.tsx`
- Already works as embeddable component
- No changes needed (already clean)

### 4. Update AccountingWizard Component
**File:** `src/components/accounting/AccountingWizard.tsx`
- Already works as embeddable component
- May need minor layout adjustments (currently has its own sidebar)
- Consider making live estimate panel integrate with page layout

### 5. Add Route
**File:** `src/App.tsx`
- Add `/services` route
- Redirect `/corporate`, `/accounting`, `/consulting` to `/services#section` or keep as separate routes

### 6. Update Navigation
**File:** `src/components/layout/Header.tsx`
- Update "Our Services" dropdown to link to `/services` with section anchors
- Or keep current structure with individual links

## Section Content

### Corporate Section
```text
CORPORATE
One-time corporate services for starting or managing a Thai company.

[Starting a New Company] - 2 column grid
  - Company Incorporation
  - Registered Office

[Existing Company Services] - 2 column grid
  - Company Review / Cleanup
  - Structural Change
  - Corporate Documents
  - Tax Residency Certificate
```

### Accounting Section
```text
ACCOUNTING
Calculate monthly + yearly cost based on your actual business.

[Accounting Wizard Component]
  - 6-step flow
  - Live estimate panel (integrated into section or sticky)
```

### Consulting Section
```text
CONSULTING
Select the problem you want to solve.

[Consulting Cards] - 2-3 column grid
  - Reduce Costs
  - Enter a New Market
  - Due Diligence / Risk Check
  - Business Structure Strategy
  - Bank & Compliance Readiness
```

## Sticky Sidebar Content
Updates dynamically based on scroll position:

| Section | Icon | Title | Description |
|---------|------|-------|-------------|
| Corporate | Building2 | Corporate Services | One-time corporate actions for starting or managing a Thai company |
| Accounting | Calculator | Accounting Calculator | Understand your accounting setup before committing |
| Consulting | MessageSquare | Business Consulting | Choose the business question, not a consulting package |

## Mobile Experience
- Sidebar hidden on mobile (`hidden lg:block`)
- Section headers visible inline for mobile users
- Standard vertical scroll through all sections
- Floating summary panels remain functional

## Technical Details

### Scroll Tracking Logic
```text
1. Create refs: corporateRef, accountingRef, consultingRef
2. On scroll event, check getBoundingClientRect().top for each ref
3. Set activeSection based on which section is most visible
4. Update sidebar content accordingly
```

### Files Modified
- `src/pages/Services.tsx` (new file)
- `src/components/corporate/CorporateServices.tsx` (simplify)
- `src/App.tsx` (add route)
- `src/components/layout/Header.tsx` (update navigation)

### Route Strategy
Two options:
1. **Keep separate routes** - `/corporate`, `/accounting`, `/consulting` remain, `/services` is the unified view
2. **Single route with anchors** - `/services`, `/services#corporate`, `/services#accounting`, `/services#consulting`

Recommendation: Option 2 (single route with anchors) for a cleaner navigation experience matching the design intent.

