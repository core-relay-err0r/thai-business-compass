

# Responsive Optimization Plan

This plan covers comprehensive mobile and multi-resolution optimization across all pages and components of the PND50 website.

---

## Summary

The website already has basic responsive foundations (Tailwind breakpoints, mobile menu), but several areas need improvement for a truly scalable experience across mobile phones, tablets, and various desktop resolutions.

---

## Areas to Optimize

### 1. Hero Section (Home Page)

**Current Issues:**
- The diagonal image section is completely hidden on mobile (`hidden lg:block`)
- Title text is large on smaller screens
- Contact info at bottom may wrap awkwardly

**Changes:**
- Show a simplified image background on mobile/tablet (without diagonal clip)
- Reduce heading sizes further for very small screens (add `text-3xl` base)
- Make contact info stack vertically on mobile
- Improve button sizing for touch targets

---

### 2. Header Navigation

**Current Issues:**
- Mobile menu works but could be smoother
- Logo + text spacing could be tighter on small screens

**Changes:**
- Reduce logo size on mobile (`h-6 w-6` on mobile, `h-8 w-8` on desktop)
- Improve mobile menu padding and touch targets
- Add smooth transition for menu open/close

---

### 3. Footer

**Current Issues:**
- The large "PND50" watermark can overflow on smaller screens
- Grid layout may not stack properly on mobile

**Changes:**
- Hide or reduce watermark text on mobile screens
- Ensure single-column stacking on mobile
- Improve spacing for readability

---

### 4. Services Page (Unified Page)

**Current Issues:**
- Sidebar is hidden on mobile (good), but mobile headers need better spacing
- Service cards grid may be too wide on tablet
- Accounting wizard steps indicator text wraps on small screens

**Changes:**
- Add responsive padding/margins for mobile headers
- Ensure 1-column grid on mobile, 2-column on tablet+
- Simplify step indicator on mobile (show current/total only)
- Improve touch targets for all interactive elements

---

### 5. Corporate & Consulting Service Cards

**Current Issues:**
- Cards already use `md:grid-cols-2`, but may need single column on small devices
- Price and button text sizing

**Changes:**
- Ensure single column on mobile
- Improve card padding for mobile
- Make buttons full-width on mobile for easier tapping

---

### 6. Accounting Wizard

**Current Issues:**
- Step titles wrap on small screens
- Intent cards (`grid md:grid-cols-2`) need single column on mobile
- Radio buttons/options spacing

**Changes:**
- Hide step titles on mobile, show only current step number
- Ensure proper stacking of all form elements
- Improve touch target sizes for sliders and switches

---

### 7. About Page

**Current Issues:**
- Team visual section is hidden on mobile (`hidden lg:block`)
- Stats grid may need 2-column instead of 3 on tablet
- Values list spacing

**Changes:**
- Show a simplified hero on mobile (without floating team photos)
- Make stats `grid-cols-1` on mobile, `grid-cols-2` on tablet, `grid-cols-3` on desktop
- Improve scroll indicator visibility on mobile

---

### 8. Contact Page

**Current Issues:**
- Form and info cards layout works but spacing could improve
- Quick response card positioning
- Map height on mobile

**Changes:**
- Improve responsive padding
- Stack all elements single-column on mobile
- Reduce map height on mobile (`h-48` mobile, `h-64` tablet, `h-300px` desktop)

---

### 9. Submit Page

**Current Issues:**
- Forms work but could benefit from tighter mobile spacing
- Button positioning

**Changes:**
- Improve form field spacing on mobile
- Center submit button on mobile
- Ensure service summary cards scroll horizontally if needed

---

### 10. Privacy/Terms Pages

**Current Issues:**
- Generally good, but hero section padding could be reduced on mobile

**Changes:**
- Reduce vertical padding on mobile
- Improve typography spacing

---

### 11. Module Cards (Home Page)

**Current Issues:**
- Already uses `md:grid-cols-3` but could stack better

**Changes:**
- Ensure clean single-column stack on mobile
- Improve card feature list spacing

---

### 12. Floating Start Button

**Current Issues:**
- Only shows on mobile (good)
- Position could conflict with content

**Changes:**
- Add safe area inset for devices with home indicators
- Improve z-index layering

---

### 13. Live Estimate Sidebar

**Current Issues:**
- Hidden on mobile in sidebar form, but estimate could be shown inline on mobile

**Changes:**
- Consider showing a collapsed/expandable estimate banner at bottom of mobile screens
- Improve dialog sizing for mobile

---

## Technical Approach

### CSS/Tailwind Changes
- Add custom breakpoints if needed (most work uses existing `sm`, `md`, `lg`, `xl`)
- Use `container` with proper padding
- Leverage `@apply` for repeated patterns
- Use `clamp()` for fluid typography where beneficial

### Component Updates
- Add responsive variants to all layout grids
- Improve touch targets (minimum 44px)
- Test all interactive elements for mobile usability

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ui/hero-section-2.tsx` | Add mobile image fallback, responsive text, contact info stacking |
| `src/components/layout/Header.tsx` | Responsive logo sizing, improved mobile menu |
| `src/components/layout/Footer.tsx` | Hide watermark on mobile, improve grid stacking |
| `src/pages/Services.tsx` | Mobile header spacing, improved touch targets |
| `src/components/corporate/CorporateServices.tsx` | Ensure mobile grid, button sizing |
| `src/components/consulting/ConsultingServices.tsx` | Ensure mobile grid, button sizing |
| `src/components/accounting/AccountingWizard.tsx` | Mobile step indicator, form spacing |
| `src/pages/About.tsx` | Mobile hero, stats grid breakpoints |
| `src/pages/Contact.tsx` | Responsive map height, spacing |
| `src/pages/Submit.tsx` | Form spacing improvements |
| `src/components/home/ModuleCards.tsx` | Mobile card spacing |
| `src/components/home/TrustSection.tsx` | Mobile grid improvements |
| `src/components/home/HowItWorks.tsx` | Mobile step layout |
| `src/components/home/BottomCTA.tsx` | Mobile padding |
| `src/components/layout/FloatingStartButton.tsx` | Safe area inset |
| `src/pages/Privacy.tsx` | Mobile padding |
| `src/index.css` | Add any global responsive utilities |

---

## Testing Considerations

After implementation:
- Test on iPhone SE (320px) - smallest common viewport
- Test on standard mobile (375px - iPhone, 390px - newer iPhones)
- Test on tablet portrait (768px - iPad)
- Test on tablet landscape (1024px)
- Test on laptop (1280px)
- Test on desktop (1920px+)
- Verify all touch targets are 44px minimum
- Check text readability at all sizes
- Verify no horizontal scroll on any viewport

