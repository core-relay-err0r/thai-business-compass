import { Helmet } from "react-helmet-async";

// LocalBusiness schema for local SEO
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: "PND50",
    description: "Bangkok-based accounting firm for foreign-owned companies in Thailand. Corporate tax, bookkeeping, payroll, and business advisory services.",
    url: "https://pnd50.com",
    telephone: "+66-2-017-2949",
    email: "info@pnd50.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Suite 3065, 30th Floor, Bhiraj Tower at EmQuartier, 689 Sukhumvit Rd, Khlong Tan Nuea",
      addressLocality: "Bangkok",
      addressRegion: "Watthana",
      postalCode: "10110",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "13.7310",
      longitude: "100.5695",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
    serviceType: [
      "Accounting Services",
      "Corporate Tax Filing",
      "Bookkeeping",
      "Payroll Services",
      "Company Registration",
      "Business Consulting",
    ],
    sameAs: [
      "https://wa.me/66843563805",
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Organization schema for brand authority
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PND50",
    legalName: "PND50 Co., Ltd.",
    url: "https://pnd50.com",
    logo: "https://pnd50.com/favicon.png",
    description: "Thai accounting firm specializing in services for foreign-owned businesses. English-speaking accountants in Bangkok.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Suite 3065, 30th Floor, Bhiraj Tower at EmQuartier",
      addressLocality: "Bangkok",
      addressCountry: "TH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+66-2-017-2949",
      contactType: "customer service",
      email: "info@pnd50.com",
      availableLanguage: ["English", "Thai"],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// FAQ schema for rich snippets
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// BreadcrumbList schema for navigation
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
