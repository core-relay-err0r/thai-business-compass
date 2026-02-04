import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Globe } from "lucide-react";

export default function AccountantForForeignCompanies() {
  return (
    <SEOServicePage
      badge="Foreign Companies"
      title="Accountant for"
      titleAccent="Foreign Companies Thailand"
      description="Specialized accounting services for foreign-owned companies operating in Thailand. We understand the unique challenges of international businesses and provide expert support in English."
      primaryKeyword="Accountant for Foreign Companies Thailand - Foreign Business Accounting"
      icon={Globe}
      features={[
        {
          title: "International Reporting",
          description: "Financial reports aligned with both Thai and international standards.",
        },
        {
          title: "Parent Company Packages",
          description: "Consolidation packages and group reporting in your required format.",
        },
        {
          title: "Transfer Pricing",
          description: "Transfer pricing documentation and compliance support.",
        },
        {
          title: "Multi-Currency Accounting",
          description: "Proper handling of foreign currency transactions and translations.",
        },
        {
          title: "English Communication",
          description: "All reporting and communication in professional English.",
        },
        {
          title: "Regulatory Navigation",
          description: "Expert guidance on Thai regulations affecting foreign businesses.",
        },
      ]}
      benefits={[
        "Deep understanding of foreign business needs",
        "English-first communication",
        "Parent company reporting formats",
        "Transfer pricing compliance support",
        "Multi-currency transaction handling",
        "Regulatory guidance in plain English",
      ]}
      relatedServices={[
        {
          title: "For Foreigners",
          href: "/accountant-for-foreigners-thailand",
          description: "Accounting for foreign individuals and entrepreneurs.",
        },
        {
          title: "Foreign Company Registration",
          href: "/foreign-company-registration",
          description: "Register your foreign-owned Thai company.",
        },
        {
          title: "Tax for Foreign Businesses",
          href: "/tax-services-for-foreign-businesses",
          description: "Tax services tailored to foreign companies.",
        },
      ]}
      ctaText="Get Foreign Company Support"
      ctaHref="/services#accounting"
    />
  );
}
