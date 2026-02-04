import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Lightbulb } from "lucide-react";

export default function TaxPlanningThailand() {
  return (
    <SEOServicePage
      badge="Tax Planning"
      title="Tax Planning"
      titleAccent="Thailand"
      description="Strategic tax planning services for businesses in Thailand. Optimize your tax position, leverage available incentives, and structure your operations for tax efficiency within Thai regulations."
      primaryKeyword="Tax Planning Thailand - Corporate Tax Strategy Thailand"
      icon={Lightbulb}
      features={[
        {
          title: "Tax Structure Optimization",
          description: "Advice on optimal corporate structure for tax efficiency.",
        },
        {
          title: "Incentive Analysis",
          description: "Identification and application of available tax incentives.",
        },
        {
          title: "BOI Benefits",
          description: "Maximizing Board of Investment tax privileges.",
        },
        {
          title: "Transaction Planning",
          description: "Tax impact analysis for major business transactions.",
        },
        {
          title: "Transfer Pricing",
          description: "Transfer pricing strategy and documentation.",
        },
        {
          title: "Year-End Planning",
          description: "Strategic planning to optimize annual tax position.",
        },
      ]}
      benefits={[
        "Legal tax minimization",
        "Optimal corporate structure",
        "Maximum incentive utilization",
        "Transaction tax efficiency",
        "Transfer pricing compliance",
        "Proactive year-end strategies",
      ]}
      relatedServices={[
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Complete tax advisory services.",
        },
        {
          title: "Business Advisory",
          href: "/business-advisory-services-thailand",
          description: "Strategic business consulting.",
        },
        {
          title: "Corporate Tax",
          href: "/pnd50-corporate-tax",
          description: "Corporate tax compliance services.",
        },
      ]}
      ctaText="Get Tax Planning Advice"
      ctaHref="/services#consulting"
    />
  );
}
