# SEO/GEO Keyword Implementation Plan

## Status: ✅ COMPLETED

## Summary of Implementation

This plan has been fully implemented. The site now has a comprehensive SEO architecture with 40+ dedicated landing pages targeting specific keywords, plus a database-backed blog system.

---

## What Was Built

### 1. Database Infrastructure
- Created `blog_posts` table with RLS policies for public read access
- Seeded 4 initial blog posts targeting problem-based keywords

### 2. Core Brand Pages (2 pages)
- `/pnd50-thailand` - Why PND50 (brand credibility)
- `/pnd50-corporate-tax` - Corporate Tax Expertise

### 3. Branded Service Pages (5 pages)
- `/pnd50-tax-filing`
- `/pnd50-bookkeeping-services`
- `/pnd50-payroll-services`
- `/pnd50-business-advisory`
- `/pnd50-company-registration`

### 4. Accounting & Bookkeeping Pages (6 pages)
- `/accounting-services-thailand`
- `/corporate-accounting-thailand`
- `/bookkeeping-services-thailand`
- `/thai-accounting-standards`
- `/accounting-firm-thailand`
- `/accountant-for-foreign-companies`

### 5. Tax & Compliance Pages (6 pages)
- `/pnd50-tax-filing-thailand`
- `/corporate-income-tax-thailand`
- `/thai-corporate-tax-compliance`
- `/tax-filing-services-thailand`
- `/annual-corporate-tax-return`
- `/thai-tax-advisory-services`

### 6. Payroll Pages (3 pages)
- `/payroll-services-thailand`
- `/thai-payroll-compliance`
- `/employee-payroll-management`

### 7. Company Setup Pages (5 pages)
- `/company-registration-thailand`
- `/business-setup-thailand`
- `/foreign-company-registration`
- `/business-advisory-services-thailand`
- `/tax-planning-thailand`

### 8. Foreigner-Focused Pages (4 pages) - HIGH PRIORITY
- `/accountant-for-foreigners-thailand`
- `/english-speaking-accountant-thailand`
- `/accounting-services-for-expats`
- `/tax-services-for-foreign-businesses`

### 9. Blog Infrastructure
- `/blog` - Knowledge Hub index
- `/blog/:slug` - Dynamic blog post pages
- 4 initial posts published:
  - `help-with-pnd50-tax-filing`
  - `how-to-file-corporate-tax-thailand`
  - `do-i-need-an-accountant-thailand`
  - `corporate-tax-obligations-thailand`

### 10. Routing Updates
- `/services` - Now shows SEO Services Index with all service categories
- `/services/calculator` - Interactive calculator (formerly /services)
- Old routes (/corporate, /accounting, /consulting) redirect to calculator

---

## Reusable Components Created

- `src/components/seo/SEOServicePage.tsx` - Template for service landing pages
- `src/components/seo/SEOBrandPage.tsx` - Template for brand/trust pages
- `src/components/blog/BlogCard.tsx` - Blog post card component
- `src/hooks/useBlogPosts.ts` - React Query hooks for blog data

---

## Internal Linking Structure

- Blog posts → Service pages (PND50 Tax Filing, Accounting Services, Foreigner pages)
- Service pages → Related service pages
- Foreigner pages → Core services (Tax, Accounting, Payroll)
- All pages → Services Index and Contact

---

## Files Modified (Phase 1 - Meta Tags & Content)

| File | Changes |
|------|---------|
| `index.html` | Added keywords meta tag, updated title to include "Bangkok", enhanced descriptions |
| `src/components/home/HeroSection.tsx` | Added sr-only SEO heading |
| `src/components/home/ModuleCards.tsx` | Updated feature bullets with brand terms |
| `src/components/home/TrustSection.tsx` | Enhanced description with foreigner-focused keywords |
| `src/pages/Services.tsx` | Added SEO intro paragraph |
| `src/pages/About.tsx` | Integrated brand + trust keywords |
| `src/pages/Contact.tsx` | Added Bangkok/Thailand context |
| `src/components/layout/Footer.tsx` | Updated brand description |

---

## Next Steps for SEO

1. Add more blog content targeting problem-based keywords
2. Create and submit sitemap.xml to Google Search Console
3. Add structured data (JSON-LD) for LocalBusiness schema
4. Monitor rankings for target keywords
5. Create location-specific landing pages if needed (Bangkok, Phuket, etc.)
6. Build backlinks to high-priority pages
