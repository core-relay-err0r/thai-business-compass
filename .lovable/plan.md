
# Comprehensive SEO Improvement Plan

## Current State Analysis

Based on my exploration, here's what's in place and what's missing:

### What's Working (Score: 6/10)
- Global meta tags with keywords in `index.html`
- Visually hidden H1 for homepage SEO
- Keyword-rich content in Footer, TrustSection, ModuleCards
- Basic robots.txt allowing all crawlers
- Canonical URL set

### Critical Gaps Identified
1. **No sitemap.xml** - Search engines can't efficiently discover all pages
2. **No page-specific meta tags** - Every page shows the same title/description
3. **No structured data (JSON-LD)** - Missing LocalBusiness schema for local SEO
4. **robots.txt missing sitemap reference**
5. **No FAQ schema** for rich snippets
6. **Static canonical URL** - doesn't update per page

---

## Implementation Plan

### 1. Create SEO Head Component
**New file: `src/components/seo/SEOHead.tsx`**

A reusable component using `react-helmet-async` to manage page-specific:
- Title tags with brand suffix
- Meta descriptions
- Canonical URLs (dynamic per page)
- Open Graph tags
- Twitter cards

### 2. Add JSON-LD Structured Data
**New file: `src/components/seo/StructuredData.tsx`**

Implement three schema types:
- **LocalBusiness** - For local SEO in Bangkok searches
- **Organization** - For brand authority
- **FAQ** (Services page) - For rich snippets in search results

```text
LocalBusiness Schema includes:
+----------------------------------+
| @type: AccountingService         |
| name: PND50                      |
| address: Bangkok, Thailand       |
| telephone: +66 84 356 3805       |
| priceRange: $$                   |
| areaServed: Thailand             |
| serviceType: Accounting, Tax     |
+----------------------------------+
```

### 3. Generate sitemap.xml
**New file: `public/sitemap.xml`**

Include all current routes with priorities:
- `/` (priority: 1.0)
- `/services` (priority: 0.9)
- `/about` (priority: 0.8)
- `/contact` (priority: 0.8)
- `/privacy`, `/tos` (priority: 0.3)

### 4. Update robots.txt
**File: `public/robots.txt`**

Add sitemap reference pointing to the live domain.

### 5. Apply SEO Component to All Pages

Update each page component to include unique SEO metadata:

| Page | Title | Primary Keywords |
|------|-------|------------------|
| Home | PND50 - Thai Accounting Firm & Corporate Services, Bangkok | PND50, PND50 Thailand |
| Services | Accounting Services Thailand - PND50 | Accounting services Thailand, tax filing |
| About | About PND50 - Bangkok Accounting Firm | PND50 accounting firm, English speaking accountant |
| Contact | Contact PND50 - Thai Accounting & Tax Services | PND50 Bangkok, Thai tax advisory |

### 6. Install Required Dependency
Add `react-helmet-async` for managing document head.

---

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/seo/SEOHead.tsx` | Reusable meta tag component |
| `src/components/seo/StructuredData.tsx` | JSON-LD schema injection |
| `public/sitemap.xml` | XML sitemap for crawlers |

### Files to Modify
| File | Changes |
|------|---------|
| `src/App.tsx` | Wrap with HelmetProvider |
| `src/pages/Home.tsx` | Add SEOHead with homepage metadata |
| `src/pages/Services.tsx` | Add SEOHead + FAQ schema |
| `src/pages/About.tsx` | Add SEOHead with about metadata |
| `src/pages/Contact.tsx` | Add SEOHead with contact metadata + LocalBusiness |
| `src/pages/Privacy.tsx` | Add SEOHead |
| `src/pages/Terms.tsx` | Add SEOHead |
| `public/robots.txt` | Add Sitemap directive |
| `index.html` | Clean up duplicate meta (optional, fallback remains) |

---

## Expected SEO Score Improvement

| Category | Before | After |
|----------|--------|-------|
| Meta Tags & Keywords | 7/10 | 9/10 |
| Technical SEO | 3/10 | 8/10 |
| Structured Data | 0/10 | 9/10 |
| **Overall** | **6/10** | **8.5/10** |

---

## Sample Implementation

### SEOHead Component Usage
```tsx
<SEOHead 
  title="Accounting Services Thailand"
  description="Professional accounting, tax filing, and bookkeeping services..."
  path="/services"
  keywords="accounting services Thailand, tax filing Thailand"
/>
```

### LocalBusiness Schema Output
```json
{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "PND50",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Suite 3065, Bhiraj Tower at EmQuartier",
    "addressLocality": "Bangkok",
    "addressCountry": "TH"
  },
  "telephone": "+66-84-356-3805",
  "email": "info@pnd50.com",
  "url": "https://pnd50.com"
}
```

---

## Remaining to Reach 10/10

After this implementation, reaching a perfect score would require:
- Building 40+ planned SEO landing pages (content)
- Creating blog posts for informational keywords
- Building backlinks and external authority
- Adding BreadcrumbList schema
- Implementing hreflang for multi-language (if needed)
