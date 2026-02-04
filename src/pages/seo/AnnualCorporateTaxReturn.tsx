import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Calendar } from "lucide-react";

export default function AnnualCorporateTaxReturn() {
  return (
    <SEOServicePage
      badge="Annual Tax Return"
      title="Annual Corporate Tax Return"
      titleAccent="Thailand"
      description="Expert preparation and filing of annual corporate tax returns in Thailand. We handle your PND 50 with accurate calculations, proper deductions, and on-time submission."
      primaryKeyword="Annual Corporate Tax Return Thailand - Year-End Tax Filing"
      icon={Calendar}
      features={[
        {
          title: "PND 50 Preparation",
          description: "Complete annual corporate income tax return from your financial statements.",
        },
        {
          title: "Financial Statement Review",
          description: "Review and adjustment of accounts for tax purposes.",
        },
        {
          title: "Deduction Analysis",
          description: "Identification of all allowable deductions and incentives.",
        },
        {
          title: "Tax Calculation",
          description: "Accurate computation of your corporate tax liability.",
        },
        {
          title: "Timely Submission",
          description: "Filing before the 150-day deadline after year-end.",
        },
        {
          title: "Documentation",
          description: "Complete supporting schedules and attachments.",
        },
      ]}
      benefits={[
        "Meet the 150-day filing deadline",
        "Accurate tax calculations",
        "All deductions properly claimed",
        "Supporting schedules prepared",
        "Electronic filing confirmation",
        "English summary provided",
      ]}
      relatedServices={[
        {
          title: "Corporate Income Tax",
          href: "/corporate-income-tax-thailand",
          description: "Year-round corporate tax services.",
        },
        {
          title: "PND50 Tax Filing",
          href: "/pnd50-tax-filing-thailand",
          description: "PND50 annual tax return services.",
        },
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Year-end tax planning.",
        },
      ]}
      ctaText="Get Annual Return Quote"
      ctaHref="/services#accounting"
    />
  );
}
