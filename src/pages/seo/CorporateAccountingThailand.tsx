import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Building } from "lucide-react";

export default function CorporateAccountingThailand() {
  return (
    <SEOServicePage
      badge="Corporate Accounting"
      title="Corporate Accounting"
      titleAccent="Thailand"
      description="Specialized corporate accounting services for Thai companies. Complete financial management, statutory reporting, and compliance with Thai corporate regulations."
      primaryKeyword="Corporate Accounting Thailand - Thai Corporate Financial Services"
      icon={Building}
      features={[
        {
          title: "Statutory Accounting",
          description: "Full compliance with Thai GAAP and statutory reporting requirements.",
        },
        {
          title: "Corporate Financial Statements",
          description: "Annual financial statements prepared for shareholder and regulatory submission.",
        },
        {
          title: "Intercompany Accounting",
          description: "Management of intercompany transactions and transfer pricing documentation.",
        },
        {
          title: "Consolidation Support",
          description: "Group consolidation packages for parent company reporting.",
        },
        {
          title: "DBD Filing",
          description: "Electronic filing with Department of Business Development.",
        },
        {
          title: "Audit Coordination",
          description: "Full support for statutory audits by licensed Thai auditors.",
        },
      ]}
      benefits={[
        "Full Thai statutory compliance",
        "English and Thai financial reporting",
        "Integration with group consolidation",
        "On-time DBD and regulatory filings",
        "Coordination with statutory auditors",
        "Dedicated corporate accountant",
      ]}
      relatedServices={[
        {
          title: "Accounting Services Thailand",
          href: "/accounting-services-thailand",
          description: "Full-service accounting for all business types.",
        },
        {
          title: "Corporate Income Tax",
          href: "/corporate-income-tax-thailand",
          description: "Thai corporate income tax services.",
        },
        {
          title: "Thai Accounting Standards",
          href: "/thai-accounting-standards",
          description: "Understanding Thai GAAP and TFRS requirements.",
        },
      ]}
      ctaText="Get Corporate Accounting Quote"
      ctaHref="/services#accounting"
    />
  );
}
