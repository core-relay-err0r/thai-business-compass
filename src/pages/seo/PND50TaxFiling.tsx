import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { FileText } from "lucide-react";

export default function PND50TaxFiling() {
  return (
    <SEOServicePage
      badge="PND50 Tax Filing"
      title="PND50"
      titleAccent="Tax Filing Services"
      description="Professional PND50 tax filing services for foreign-owned companies in Thailand. We prepare and submit your annual corporate income tax returns with accuracy and on-time compliance."
      primaryKeyword="PND50 Tax Filing - Annual Corporate Tax Return Thailand"
      icon={FileText}
      features={[
        {
          title: "Annual PND 50 Preparation",
          description: "Complete annual corporate income tax return preparation from your financial statements.",
        },
        {
          title: "Half-Year PND 51 Filing",
          description: "Mid-year corporate income tax estimates filed on time to avoid penalties.",
        },
        {
          title: "Tax Calculation & Review",
          description: "Detailed calculation of corporate income tax with optimization for allowable deductions.",
        },
        {
          title: "Electronic Submission",
          description: "Direct e-filing with Thailand's Revenue Department — confirmation delivered to you.",
        },
        {
          title: "Supporting Documentation",
          description: "All schedules, attachments, and supporting documents prepared to Thai standards.",
        },
        {
          title: "Deadline Management",
          description: "Proactive reminders and submissions before deadlines — never pay late penalties.",
        },
      ]}
      benefits={[
        "On-time filing guaranteed — no late penalties",
        "Accurate tax calculations by experienced accountants",
        "Clear English summary of your tax position",
        "All required schedules and attachments prepared",
        "Electronic filing with Revenue Department",
        "Support for any follow-up queries from tax authorities",
      ]}
      relatedServices={[
        {
          title: "Bookkeeping Services",
          href: "/pnd50-bookkeeping-services",
          description: "Monthly bookkeeping that prepares your records for tax filing.",
        },
        {
          title: "Corporate Tax Compliance",
          href: "/thai-corporate-tax-compliance",
          description: "Full corporate tax compliance including VAT and withholding tax.",
        },
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Strategic tax planning to optimize your annual tax position.",
        },
      ]}
      ctaText="Get Tax Filing Quote"
      ctaHref="/services#accounting"
    />
  );
}
