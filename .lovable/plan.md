

# SEO Enhancement Plan: From 8.5 to 10/10

This plan addresses all identified gaps to achieve a perfect SEO score for PND50.

---

## Current State (8.5/10)

**What's Already Working Well:**
- SEOHead component with unique meta tags per page
- LocalBusiness and Organization structured data on Home
- FAQ structured data on Services page
- BreadcrumbList structured data on blog posts
- Comprehensive robots.txt with AI crawler allowances
- Complete sitemap.xml with all pages and blog posts
- Hidden H1 for SEO on homepage
- Proper heading hierarchy (H1-H3)

---

## Missing Elements to Fix

### 1. Article Schema for Blog Posts (High Priority)
Add JSON-LD Article structured data to each blog post for rich search results showing author, date, and featured image in Google.

**Benefits:**
- Rich snippets in search results
- Better click-through rates
- Enhanced visibility for blog content

---

### 2. Service Schema for Services Page (High Priority)
Add structured data for each service type (Corporate, Accounting, Consulting) to help search engines understand and display service offerings.

**Benefits:**
- Service-specific rich results
- Better local search visibility
- Enhanced business listing features

---

### 3. Improved Image Alt Text (Medium Priority)
Current alt text is generic (e.g., "Team member"). Will update to descriptive text that includes keywords.

**Current Issues:**
- About page: "Team member" (generic)
- Blog cards: Uses title only (missing context)
- Team photos: Missing professional context

**Improvements:**
- "Senior Thai accountant at PND50 Bangkok office"
- "PND50 accounting team meeting in Bangkok"
- Featured images: "{title} - Thai accounting guide"

---

### 4. Add Blog Index Page Breadcrumb Schema
The /blog index page is missing breadcrumb structured data that individual posts have.

---

### 5. Add About Page Structured Data
The About page is missing structured data. Will add organization and breadcrumb schemas.

---

## Implementation Details

### File Changes Required

```text
+---------------------------+----------------------------------------+
| File                      | Changes                                |
+---------------------------+----------------------------------------+
| StructuredData.tsx        | Add ArticleSchema, ServiceSchema       |
| BlogPost.tsx              | Import and use ArticleSchema           |
| Blog.tsx                  | Add BreadcrumbSchema for blog index    |
| Services.tsx              | Add ServiceSchema for each service     |
| About.tsx                 | Add BreadcrumbSchema, improve alt text |
+---------------------------+----------------------------------------+
```

### New Components to Create

**ArticleSchema** - For blog posts:
- headline, author, datePublished, dateModified
- image, publisher, mainEntityOfPage

**ServiceSchema** - For services page:
- Service type with name, description, provider
- Area served, price range

---

## Technical Summary

| Enhancement | Impact | Effort |
|-------------|--------|--------|
| Article Schema for blogs | High | Low |
| Service Schema for services | High | Low |
| Image alt text improvements | Medium | Low |
| Blog index breadcrumbs | Medium | Low |
| About page structured data | Medium | Low |

---

## Expected Results

After implementation:
- **Rich snippets** for blog posts in Google (author, date, image)
- **Service listings** enhancement in local search
- **Improved accessibility** scores
- **Better image search** visibility
- **Complete structured data** coverage across all pages

This brings the SEO implementation to a comprehensive 10/10 with no gaps in technical SEO, structured data, or on-page optimization.

