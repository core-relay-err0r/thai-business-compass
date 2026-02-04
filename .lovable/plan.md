
# SEO/GEO Keyword Implementation Plan

## Overview

Implement brand-focused SEO keywords throughout the site to improve search visibility for PND50-related searches. The keywords will be naturally integrated into meta tags, page content, and structured data.

## Keyword Groups to Implement

**Core Brand Terms:**
- PND50, PND50 accounting, PND50 accounting firm, PND50 tax services
- PND50 Thailand, PND50 Bangkok, PND50 corporate tax, PND50 accounting services Thailand

**Brand + Service Hybrids:**
- PND50 tax filing, PND50 bookkeeping services, PND50 payroll services
- PND50 business advisory, PND50 company registration

---

## Implementation Strategy

### 1. Primary Meta Tags (index.html)

Update the global meta tags with comprehensive keywords:

**Title tag:**
`PND50 | Thai Accounting & Corporate Services | Bangkok`

**Meta description:**
`PND50 accounting firm in Bangkok, Thailand. Tax services, bookkeeping, payroll, company registration, and business advisory for foreign-owned companies. Calculate costs instantly.`

**New meta keywords tag:**
Add a keywords meta tag with all brand terms (while meta keywords aren't heavily weighted by Google, they're still useful for other search engines and brand signal clarity).

**Open Graph updates:**
- Update og:title and twitter:title to include "Bangkok"
- Update og:description and twitter:description with keyword-rich content

### 2. Page-Level SEO Content

#### Home Page (HeroSection.tsx)
- Add a visually hidden (sr-only) H1 tag for SEO: "PND50 - Thai Accounting Firm in Bangkok, Thailand"
- The visible content remains unchanged for design purposes

#### About Page (About.tsx)
- Update the hero text to naturally include "PND50 accounting firm" and "PND50 Thailand"
- Enhance the footer description with "PND50 Bangkok" context

#### Services Page (Services.tsx)
- Add an SEO-friendly introductory paragraph that includes:
  - "PND50 company registration"
  - "PND50 tax filing"
  - "PND50 bookkeeping services"
  - "PND50 payroll services"

#### Contact Page (Contact.tsx)
- Add schema-relevant text mentioning "PND50 Bangkok" and "PND50 Thailand"

### 3. Footer Enhancement (Footer.tsx)

Update the brand description to include more keywords:
```
PND50 is a Bangkok-based accounting firm providing tax services, bookkeeping, payroll, and business advisory for foreign companies in Thailand since 2015.
```

### 4. Trust Section (TrustSection.tsx)

Enhance the section intro to include:
- "PND50 accounting services Thailand"
- "PND50 corporate tax"

### 5. Module Cards (ModuleCards.tsx)

Update feature descriptions to include brand + service keywords:
- "PND50 company registration" in Corporate
- "PND50 bookkeeping services" and "PND50 tax filing" in Accounting
- "PND50 business advisory" in Consulting

---

## Technical Implementation Details

### File: index.html
- Add `<meta name="keywords">` tag with all brand keywords
- Update title to include "Bangkok"
- Enhance meta description with keyword-rich content
- Update OG/Twitter meta tags

### File: src/components/home/HeroSection.tsx
- Add visually hidden SEO heading for screen readers and search engines

### File: src/components/layout/Footer.tsx
- Update brand description with keyword-rich copy

### File: src/components/home/TrustSection.tsx
- Update section description to include brand keywords naturally

### File: src/components/home/ModuleCards.tsx
- Update feature bullet points with brand-prefixed terms

### File: src/pages/About.tsx
- Enhance hero paragraph with natural keyword integration

### File: src/pages/Services.tsx
- Add introductory text with service-specific brand keywords

---

## Summary

| File | Changes |
|------|---------|
| index.html | Add keywords meta tag, enhance title/description/OG tags |
| HeroSection.tsx | Add sr-only SEO heading |
| Footer.tsx | Update brand description with keywords |
| TrustSection.tsx | Add brand context to section intro |
| ModuleCards.tsx | Update feature lists with brand terms |
| About.tsx | Enhance hero text with keywords |
| Services.tsx | Add SEO intro paragraph |

All keyword integrations will feel natural and avoid keyword stuffing, maintaining the site's professional, non-salesy tone while improving search visibility for brand-related queries.
