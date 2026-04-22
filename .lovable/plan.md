

# Fix Mobile Landing Page Layout

The core problem: the hero section is forced to `100vh` on all screen sizes, making it consume the entire mobile viewport with excessive whitespace. Combined with generous padding and spacing, the page feels stretched and empty on small screens.

## Changes

### 1. Hero section height -- remove full-viewport lock on mobile
**File:** `src/components/ui/hero-section-2.tsx`

- Change the container `style` so mobile uses `minHeight: auto` (natural content height) instead of `100vh`. Keep `100vh` for `lg` and above via a class-based approach.
- Remove the fixed `height` property on mobile entirely -- let content dictate height.
- Reduce mobile padding from `p-6 / py-12 sm:py-16` to `px-4 py-6 sm:py-10`.
- Tighten the gap between the carousel, headline, subtitle, and buttons on mobile (reduce `gap-6 sm:gap-8` to `gap-4 sm:gap-6`).

### 2. Mobile carousel -- make it more compact
**File:** `src/components/ui/hero-section-2.tsx`

- Change the mobile carousel aspect ratio from `aspect-[16/10]` to `aspect-[16/9]` for a tighter image.
- Reduce internal padding on the overlay text.

### 3. Headline and subtitle -- tighter mobile typography
**File:** `src/components/ui/hero-section-2.tsx`

- Reduce the mobile `h1` from `text-2xl` to `text-xl` and adjust `leading` for tighter line height.
- Reduce subtitle bottom margin and button padding on mobile.

### 4. Sections below hero -- reduce vertical padding on mobile
**Files:** `ModuleCards.tsx`, `TrustSection.tsx`, `HowItWorks.tsx`, `BottomCTA.tsx`, `Testimonials.tsx` (via testimonial-card)

- Reduce `py-12` to `py-8` on mobile for all landing page sections so content feels denser and more scroll-friendly.

### 5. Remove faint background image on mobile hero
**File:** `src/components/ui/hero-section-2.tsx`

- The `lg:hidden` background image overlay adds visual noise without value on small screens. Remove it since the carousel already shows the images.

## Summary

These are purely CSS/class changes -- no logic, pricing, or backend changes. The desktop layout remains unchanged. The mobile experience will feel compact, content-dense, and professional.

