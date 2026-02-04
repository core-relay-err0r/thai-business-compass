

# SEO/GEO Keyword Implementation Plan

## Overview

This plan implements the comprehensive keyword clustering and SEO architecture provided across the PND50 website. The implementation focuses on natural keyword integration while maintaining the site's professional, non-salesy tone.

---

## Implementation Strategy

### Phase 1: Global Meta Tags (index.html)

**Changes:**
- Update `<title>` to: `PND50 | Thai Accounting & Corporate Services | Bangkok`
- Add `<meta name="keywords">` with core brand terms
- Enhance meta description with keyword-rich content
- Update OG/Twitter meta tags with Bangkok context

**Primary Keywords:**
- PND50
- PND50 accounting
- PND50 Thailand
- PND50 Bangkok

---

### Phase 2: Homepage SEO Enhancements

#### 2a. HeroSection.tsx
- Add visually hidden (`sr-only`) SEO H1 heading: "PND50 - Thai Accounting Firm in Bangkok, Thailand"
- This provides semantic SEO value without affecting the visual design

#### 2b. ModuleCards.tsx  
Update section intro and feature bullets with brand + service keywords:
- Corporate: "PND50 company registration", "Business setup Thailand"
- Accounting: "PND50 bookkeeping services", "PND50 tax filing"
- Consulting: "PND50 business advisory"

#### 2c. TrustSection.tsx
Enhance the section description to include:
- "PND50 accounting services Thailand"
- "Accountant for foreigners in Thailand"

---

### Phase 3: Services Page (Primary Service Landing)

**File: src/pages/Services.tsx**

Add an SEO-optimized introductory section after the hero:
- Include transactional keywords: "Accounting services Thailand", "Tax filing services Thailand"
- Include foreigner-focused keywords: "Accountant for foreign companies Thailand"
- Natural content flow that aids both users and search engines

**Target Keywords:**
- Accounting services Thailand
- Corporate accounting Thailand
- Bookkeeping services Thailand
- Tax filing services Thailand
- Payroll services Thailand
- Company registration Thailand

---

### Phase 4: About Page (Trust & Brand Authority)

**File: src/pages/About.tsx**

Enhance content with brand + trust keywords:
- Update hero paragraph to include "PND50 accounting firm" and "PND50 Bangkok"
- Add "Bangkok-based" and "Thailand" context naturally
- Reinforce "English speaking accountant Thailand" and "accountant for foreigners in Thailand"

---

### Phase 5: Footer Enhancement

**File: src/components/layout/Footer.tsx**

Update brand description with keyword-rich, natural copy:

```
From: "Professional accounting and business consulting for foreign companies operating in Thailand since 2015."

To: "PND50 is a Bangkok-based accounting firm providing corporate tax, bookkeeping, payroll, and business advisory services for foreign-owned companies in Thailand."
```

---

### Phase 6: Contact Page

**File: src/pages/Contact.tsx**

Add contextual SEO text:
- Include "PND50 Bangkok" in location context
- Add structured data-friendly content mentioning "Thai tax advisory services"
- Reinforce "English speaking accountant Thailand" for trust signals

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add keywords meta tag, update title to include "Bangkok", enhance descriptions |
| `src/components/home/HeroSection.tsx` | Add sr-only SEO heading |
| `src/components/home/ModuleCards.tsx` | Update intro text and feature bullets with brand terms |
| `src/components/home/TrustSection.tsx` | Enhance section description with foreigner-focused keywords |
| `src/pages/Services.tsx` | Add SEO intro paragraph with service keywords |
| `src/pages/About.tsx` | Integrate brand + trust keywords naturally |
| `src/pages/Contact.tsx` | Add Bangkok/Thailand context |
| `src/components/layout/Footer.tsx` | Update brand description with keyword-rich copy |

---

## Keyword Distribution by Page

### Homepage (/)
**Primary:** PND50 accounting, PND50 Thailand  
**Secondary:** PND50 Bangkok, PND50 accounting firm, accountant for foreigners in Thailand

### Services Page (/services)
**Primary:** Accounting services Thailand  
**Secondary:** Corporate accounting Thailand, bookkeeping services Thailand, tax filing services Thailand, payroll services Thailand, company registration Thailand, tax services for foreign businesses Thailand

### About Page (/about)
**Primary:** PND50 accounting firm  
**Secondary:** PND50 Bangkok, PND50 Thailand, English speaking accountant Thailand

### Contact Page (/contact)
**Primary:** PND50 Bangkok  
**Secondary:** Thai tax advisory services, accountant for foreign companies Thailand

---

## Implementation Priority

1. **High Priority (BOFU/Conversion)**
   - Homepage meta tags and hero SEO heading
   - Services page SEO intro section
   - Footer brand description update

2. **Medium Priority (MOFU/Consideration)**
   - About page keyword integration
   - TrustSection foreigner-focused content
   - ModuleCards feature bullet updates

3. **Lower Priority (Trust Signals)**
   - Contact page context additions

---

## SEO Best Practices Applied

- All keyword integrations feel natural and avoid keyword stuffing
- Maintains the site's professional, non-salesy tone
- Uses visually hidden headings for SEO without affecting design
- Focuses on user intent (foreigners seeking Thai accounting services)
- Builds topical authority through consistent terminology across pages

