import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Building2 } from "lucide-react";

export default function AccountingFirmThailand() {
  return (
    <SEOServicePage
      badge="Accounting Firm"
      title="Accounting Firm in"
      titleAccent="Thailand"
      description="PND50 is a trusted accounting firm in Thailand serving foreign-owned businesses since 2015. Full-service accounting, tax, and corporate advisory with English communication."
      primaryKeyword="Accounting Firm in Thailand - Thai Accounting Company"
      icon={Building2}
      features={[
        {
          title: "Full-Service Accounting",
          description: "Bookkeeping, financial reporting, and statutory compliance in one place.",
        },
        {
          title: "Tax Services",
          description: "Corporate income tax, VAT, withholding tax, and personal income tax.",
        },
        {
          title: "Corporate Services",
          description: "Company registration, director changes, and corporate restructuring.",
        },
        {
          title: "Business Advisory",
          description: "Strategic consulting for growth, optimization, and compliance.",
        },
        {
          title: "Payroll Services",
          description: "Employee payroll, social security, and withholding tax management.",
        },
        {
          title: "Audit Support",
          description: "Preparation and coordination for statutory audits.",
        },
      ]}
      benefits={[
        "10+ years serving foreign businesses in Thailand",
        "150+ satisfied clients",
        "English-speaking professional team",
        "Transparent pricing, no hidden fees",
        "One-stop shop for all business services",
        "Bangkok-based with nationwide coverage",
      ]}
      relatedServices={[
        {
          title: "Accounting Services",
          href: "/accounting-services-thailand",
          description: "Core accounting services for Thai businesses.",
        },
        {
          title: "For Foreigners",
          href: "/accountant-for-foreigners-thailand",
          description: "Services designed for foreign entrepreneurs.",
        },
        {
          title: "Why PND50",
          href: "/pnd50-thailand",
          description: "Learn more about what makes us different.",
        },
      ]}
      ctaText="See What Applies to You"
      ctaHref="/services"
    />
  );
}
