import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Calculator } from "lucide-react";

export default function AccountingServicesThailand() {
  return (
    <SEOServicePage
      badge="Accounting Services"
      title="Accounting Services"
      titleAccent="Thailand"
      description="Professional accounting services for businesses operating in Thailand. Full-service bookkeeping, financial reporting, and compliance with Thai accounting standards — designed for foreign-owned companies."
      primaryKeyword="Accounting Services Thailand - Professional Thai Accounting Firm"
      icon={Calculator}
      features={[
        {
          title: "Monthly Bookkeeping",
          description: "Complete transaction recording and reconciliation according to Thai GAAP.",
        },
        {
          title: "Financial Statements",
          description: "Monthly profit & loss, balance sheet, and cash flow statements in English.",
        },
        {
          title: "Tax Filing Support",
          description: "Preparation of all required tax returns including VAT and corporate income tax.",
        },
        {
          title: "Audit Preparation",
          description: "Year-end audit support with organized records and schedules.",
        },
        {
          title: "Management Reporting",
          description: "Custom reports for business insights and decision-making.",
        },
        {
          title: "Thai GAAP Compliance",
          description: "Full compliance with Thai Financial Reporting Standards (TFRS).",
        },
      ]}
      benefits={[
        "Thai accounting standards (TFRS/NPAE) compliance",
        "English-speaking accountants",
        "Monthly financial reports delivered on time",
        "Transparent, fixed monthly pricing",
        "Cloud-based access to your data",
        "Seamless integration with tax services",
      ]}
      relatedServices={[
        {
          title: "Corporate Accounting",
          href: "/corporate-accounting-thailand",
          description: "Specialized accounting for Thai corporations.",
        },
        {
          title: "Tax Filing Services",
          href: "/tax-filing-services-thailand",
          description: "Complete tax return preparation and filing.",
        },
        {
          title: "For Foreign Companies",
          href: "/accountant-for-foreign-companies",
          description: "Accounting tailored to foreign-owned businesses.",
        },
      ]}
      ctaText="Calculate Accounting Cost"
      ctaHref="/services#accounting"
    />
  );
}
