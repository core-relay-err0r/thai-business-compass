import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Plane } from "lucide-react";

export default function AccountingServicesForExpats() {
  return (
    <SEOServicePage
      badge="For Expats"
      title="Accounting Services for"
      titleAccent="Expats Thailand"
      description="Specialized accounting services for expatriates living and working in Thailand. Personal tax filing, business accounting, and financial guidance — all in English."
      primaryKeyword="Accounting Services for Expats Thailand - Expat Tax and Accounting"
      icon={Plane}
      features={[
        {
          title: "Personal Income Tax",
          description: "Expatriate PND 90/91 tax return preparation and filing.",
        },
        {
          title: "Tax Residency Planning",
          description: "Guidance on Thai tax residency rules and 180-day calculations.",
        },
        {
          title: "Business Accounting",
          description: "Full accounting for expat-owned Thai businesses.",
        },
        {
          title: "Multi-Country Coordination",
          description: "Coordination with home country tax requirements.",
        },
        {
          title: "Retirement Income",
          description: "Tax treatment of foreign pensions and retirement income.",
        },
        {
          title: "Investment Income",
          description: "Reporting of dividends, interest, and capital gains.",
        },
      ]}
      benefits={[
        "Expat tax expertise",
        "Tax residency guidance",
        "Home country coordination",
        "English-only communication",
        "Personal and business services",
        "Retirement income expertise",
      ]}
      relatedServices={[
        {
          title: "For Foreigners",
          href: "/accountant-for-foreigners-thailand",
          description: "Accounting for all foreign nationals.",
        },
        {
          title: "English Speaking",
          href: "/english-speaking-accountant-thailand",
          description: "English-speaking accountants.",
        },
        {
          title: "For Foreign Businesses",
          href: "/tax-services-for-foreign-businesses",
          description: "Tax services for foreign companies.",
        },
      ]}
      ctaText="Get Expat Tax Help"
      ctaHref="/contact"
    />
  );
}
