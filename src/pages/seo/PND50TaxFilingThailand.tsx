import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { FileText } from "lucide-react";

export default function PND50TaxFilingThailand() {
  return (
    <SEOServicePage
      badge="PND50 Filing"
      title="PND50 Tax Filing"
      titleAccent="Thailand"
      description="Expert PND50 annual corporate income tax filing services in Thailand. We prepare and submit your PND 50 returns accurately and on time, ensuring full compliance with Revenue Department requirements."
      primaryKeyword="PND50 Tax Filing Thailand - Annual Corporate Tax Return"
      icon={FileText}
      features={[
        {
          title: "Annual PND 50 Returns",
          description: "Complete preparation and filing of annual corporate income tax returns.",
        },
        {
          title: "Tax Computation",
          description: "Accurate calculation of taxable income and corporate tax liability.",
        },
        {
          title: "Deduction Optimization",
          description: "Identification of all allowable deductions to minimize tax burden.",
        },
        {
          title: "Electronic Filing",
          description: "Direct e-filing with Revenue Department systems.",
        },
        {
          title: "Supporting Schedules",
          description: "All required schedules and attachments prepared professionally.",
        },
        {
          title: "Filing Confirmation",
          description: "Official confirmation and receipts delivered to you.",
        },
      ]}
      benefits={[
        "On-time filing guaranteed",
        "Accurate tax calculations",
        "Maximum allowable deductions",
        "Electronic submission with confirmation",
        "English summary of your tax position",
        "Support for any RD queries",
      ]}
      relatedServices={[
        {
          title: "Corporate Income Tax",
          href: "/corporate-income-tax-thailand",
          description: "Complete corporate tax services.",
        },
        {
          title: "Tax Compliance",
          href: "/thai-corporate-tax-compliance",
          description: "Full year-round tax compliance.",
        },
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Strategic tax planning services.",
        },
      ]}
      ctaText="Get Tax Filing Quote"
      ctaHref="/services#accounting"
    />
  );
}
