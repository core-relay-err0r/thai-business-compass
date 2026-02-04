import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Calculator } from "lucide-react";

export default function CorporateIncomeTaxThailand() {
  return (
    <SEOServicePage
      badge="Corporate Income Tax"
      title="Corporate Income Tax"
      titleAccent="Thailand"
      description="Expert corporate income tax services for Thai companies. We handle PND 50, PND 51, and all corporate tax obligations to ensure full compliance with Thailand's Revenue Department."
      primaryKeyword="Corporate Income Tax Thailand - Thai Corporate Tax Services"
      icon={Calculator}
      features={[
        {
          title: "Annual CIT Return (PND 50)",
          description: "Preparation and filing of annual corporate income tax returns.",
        },
        {
          title: "Half-Year Estimate (PND 51)",
          description: "Mid-year corporate income tax estimates filed on time.",
        },
        {
          title: "Tax Rate Optimization",
          description: "Application of appropriate tax rates and available incentives.",
        },
        {
          title: "BOI Tax Benefits",
          description: "Support for companies with BOI privileges and exemptions.",
        },
        {
          title: "Loss Carryforward",
          description: "Proper utilization of tax losses carried forward.",
        },
        {
          title: "Revenue Department Support",
          description: "Representation and support for tax audits and queries.",
        },
      ]}
      benefits={[
        "20% standard corporate tax rate properly applied",
        "All available incentives and deductions claimed",
        "On-time filing — no late penalties",
        "BOI privilege compliance",
        "Audit support included",
        "Clear English explanations",
      ]}
      relatedServices={[
        {
          title: "PND50 Tax Filing",
          href: "/pnd50-tax-filing-thailand",
          description: "Annual PND 50 tax return services.",
        },
        {
          title: "Tax Compliance",
          href: "/thai-corporate-tax-compliance",
          description: "Complete corporate tax compliance.",
        },
        {
          title: "Annual Tax Return",
          href: "/annual-corporate-tax-return",
          description: "Year-end tax return preparation.",
        },
      ]}
      ctaText="Get Corporate Tax Quote"
      ctaHref="/services#accounting"
    />
  );
}
