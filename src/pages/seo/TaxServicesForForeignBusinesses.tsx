import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Building2 } from "lucide-react";

export default function TaxServicesForForeignBusinesses() {
  return (
    <SEOServicePage
      badge="For Foreign Businesses"
      title="Tax Services for"
      titleAccent="Foreign Businesses Thailand"
      description="Comprehensive tax services for foreign-owned businesses operating in Thailand. Corporate tax, VAT, withholding tax, and strategic planning — delivered by experts who understand international business."
      primaryKeyword="Tax Services for Foreign Businesses Thailand - International Business Tax"
      icon={Building2}
      features={[
        {
          title: "Corporate Income Tax",
          description: "PND 50/51 preparation and filing for foreign-owned companies.",
        },
        {
          title: "VAT Management",
          description: "Monthly VAT returns and input/output tax optimization.",
        },
        {
          title: "Withholding Tax",
          description: "Proper withholding on payments to foreign entities.",
        },
        {
          title: "Transfer Pricing",
          description: "Transfer pricing documentation and compliance.",
        },
        {
          title: "Treaty Benefits",
          description: "Application of double tax treaty provisions.",
        },
        {
          title: "Tax Planning",
          description: "Strategic tax planning for international operations.",
        },
      ]}
      benefits={[
        "International tax expertise",
        "Transfer pricing support",
        "Double tax treaty optimization",
        "Cross-border transaction guidance",
        "Parent company coordination",
        "English reporting and communication",
      ]}
      relatedServices={[
        {
          title: "For Foreign Companies",
          href: "/accountant-for-foreign-companies",
          description: "Accounting for foreign-owned companies.",
        },
        {
          title: "For Foreigners",
          href: "/accountant-for-foreigners-thailand",
          description: "Services for foreign entrepreneurs.",
        },
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Strategic tax advisory services.",
        },
      ]}
      ctaText="Get Tax Support"
      ctaHref="/services#accounting"
    />
  );
}
