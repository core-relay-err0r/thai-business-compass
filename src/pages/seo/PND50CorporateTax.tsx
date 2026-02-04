import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Calculator } from "lucide-react";

export default function PND50CorporateTax() {
  return (
    <SEOServicePage
      badge="Corporate Tax Expertise"
      title="PND50"
      titleAccent="Corporate Tax"
      description="Expert corporate tax services for foreign-owned businesses in Thailand. PND50 handles your Thai corporate income tax, quarterly filings, and annual returns with precision and full compliance."
      primaryKeyword="PND50 Corporate Tax - Thai Corporate Income Tax Services"
      icon={Calculator}
      features={[
        {
          title: "Corporate Income Tax Filing",
          description: "Half-year (PND 51) and annual (PND 50) corporate income tax returns prepared and filed on time.",
        },
        {
          title: "Quarterly VAT Returns",
          description: "PP 30 VAT returns prepared and submitted monthly. Input/output tax reconciliation included.",
        },
        {
          title: "Withholding Tax Management",
          description: "PND 1, 3, 53, 54 withholding tax returns for employee income and supplier payments.",
        },
        {
          title: "Tax Planning & Advisory",
          description: "Strategic tax planning to optimize your tax position within Thai regulations.",
        },
        {
          title: "DBD e-Filing Submissions",
          description: "Electronic filing with Thailand's Department of Business Development handled for you.",
        },
        {
          title: "Tax Dispute Resolution",
          description: "Support and representation for Revenue Department queries and audits.",
        },
      ]}
      benefits={[
        "Never miss a tax deadline — proactive compliance management",
        "Accurate calculations verified by experienced Thai accountants",
        "Clear explanations of your tax obligations in English",
        "Electronic filing with all Thai government systems",
        "Year-round support for tax questions and planning",
        "Integration with monthly bookkeeping services",
      ]}
      relatedServices={[
        {
          title: "PND50 Tax Filing",
          href: "/pnd50-tax-filing",
          description: "Dedicated annual corporate tax return preparation and filing.",
        },
        {
          title: "Accounting Services",
          href: "/accounting-services-thailand",
          description: "Monthly bookkeeping that feeds into your tax returns.",
        },
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Strategic tax planning and optimization for your Thai business.",
        },
      ]}
      ctaText="Calculate Your Tax Needs"
      ctaHref="/services#accounting"
    />
  );
}
