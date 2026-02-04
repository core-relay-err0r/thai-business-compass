import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Globe } from "lucide-react";

export default function AccountantForForeignersThailand() {
  return (
    <SEOServicePage
      badge="For Foreigners"
      title="Accountant for Foreigners in"
      titleAccent="Thailand"
      description="Dedicated accounting services for foreign entrepreneurs and expats in Thailand. English-speaking accountants who understand the unique needs of international business owners."
      primaryKeyword="Accountant for Foreigners in Thailand - Expat Accounting Services"
      icon={Globe}
      features={[
        {
          title: "English-First Service",
          description: "All communication and reporting in professional English.",
        },
        {
          title: "Foreigner-Focused Expertise",
          description: "Deep understanding of challenges faced by foreign business owners.",
        },
        {
          title: "Tax Residency Guidance",
          description: "Advice on Thai tax residency rules and implications.",
        },
        {
          title: "Personal Income Tax",
          description: "Expatriate personal income tax filing (PND 90/91).",
        },
        {
          title: "Business Compliance",
          description: "Navigating Thai regulations for foreign-owned businesses.",
        },
        {
          title: "Home Country Coordination",
          description: "Support for coordination with home country tax advisors.",
        },
      ]}
      benefits={[
        "100% English communication",
        "Understand foreign business needs",
        "Personal and corporate tax expertise",
        "Clear explanations of Thai requirements",
        "Responsive WhatsApp/email support",
        "10+ years serving expats",
      ]}
      relatedServices={[
        {
          title: "English Speaking Accountant",
          href: "/english-speaking-accountant-thailand",
          description: "English-speaking accounting services.",
        },
        {
          title: "Accounting for Expats",
          href: "/accounting-services-for-expats",
          description: "Tailored services for expatriates.",
        },
        {
          title: "Tax for Foreign Businesses",
          href: "/tax-services-for-foreign-businesses",
          description: "Tax services for foreign companies.",
        },
      ]}
      ctaText="Get Started"
      ctaHref="/services"
    />
  );
}
