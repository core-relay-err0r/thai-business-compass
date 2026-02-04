import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { FileText } from "lucide-react";

export default function TaxFilingServicesThailand() {
  return (
    <SEOServicePage
      badge="Tax Filing"
      title="Tax Filing Services"
      titleAccent="Thailand"
      description="Professional tax filing services for businesses in Thailand. We prepare and submit all required tax returns — corporate income tax, VAT, withholding tax — accurately and on time."
      primaryKeyword="Tax Filing Services Thailand - Thai Tax Return Preparation"
      icon={FileText}
      features={[
        {
          title: "Corporate Tax Returns",
          description: "PND 50 and PND 51 corporate income tax return preparation.",
        },
        {
          title: "VAT Returns",
          description: "Monthly PP 30 VAT return preparation and filing.",
        },
        {
          title: "Withholding Tax Returns",
          description: "All PND withholding tax returns for employees and suppliers.",
        },
        {
          title: "Personal Income Tax",
          description: "PND 90/91 personal income tax returns for expatriates.",
        },
        {
          title: "Electronic Filing",
          description: "E-filing with Revenue Department systems.",
        },
        {
          title: "Deadline Tracking",
          description: "Proactive management of all filing deadlines.",
        },
      ]}
      benefits={[
        "All tax types filed accurately",
        "Electronic submission with confirmation",
        "Never miss a deadline",
        "Clear English explanations",
        "Audit support included",
        "Integrated with bookkeeping",
      ]}
      relatedServices={[
        {
          title: "Tax Compliance",
          href: "/thai-corporate-tax-compliance",
          description: "Complete tax compliance management.",
        },
        {
          title: "Annual Tax Return",
          href: "/annual-corporate-tax-return",
          description: "Year-end corporate tax returns.",
        },
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Strategic tax planning.",
        },
      ]}
      ctaText="Get Tax Filing Quote"
      ctaHref="/services#accounting"
    />
  );
}
