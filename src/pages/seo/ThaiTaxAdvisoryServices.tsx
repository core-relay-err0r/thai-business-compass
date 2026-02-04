import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Lightbulb } from "lucide-react";

export default function ThaiTaxAdvisoryServices() {
  return (
    <SEOServicePage
      badge="Tax Advisory"
      title="Thai Tax Advisory"
      titleAccent="Services"
      description="Strategic tax advisory services for businesses in Thailand. Expert guidance on tax planning, optimization, and compliance to minimize your tax burden within Thai regulations."
      primaryKeyword="Thai Tax Advisory Services - Tax Planning Consulting Thailand"
      icon={Lightbulb}
      features={[
        {
          title: "Tax Planning",
          description: "Strategic planning to optimize your tax position within Thai law.",
        },
        {
          title: "Structure Advisory",
          description: "Advice on optimal corporate structure for tax efficiency.",
        },
        {
          title: "Incentive Analysis",
          description: "Identification of available tax incentives and exemptions.",
        },
        {
          title: "Transaction Review",
          description: "Tax impact analysis for major business transactions.",
        },
        {
          title: "Compliance Review",
          description: "Assessment of current tax compliance status.",
        },
        {
          title: "Dispute Resolution",
          description: "Support for tax disputes and Revenue Department negotiations.",
        },
      ]}
      benefits={[
        "Minimize tax burden legally",
        "Optimize corporate structure",
        "Leverage available incentives",
        "Avoid compliance issues",
        "Plan for major transactions",
        "Expert representation with RD",
      ]}
      relatedServices={[
        {
          title: "Tax Planning",
          href: "/tax-planning-thailand",
          description: "Comprehensive tax planning services.",
        },
        {
          title: "Business Advisory",
          href: "/pnd50-business-advisory",
          description: "Strategic business consulting.",
        },
        {
          title: "Tax Compliance",
          href: "/thai-corporate-tax-compliance",
          description: "Complete tax compliance services.",
        },
      ]}
      ctaText="Get Tax Advisory"
      ctaHref="/services#consulting"
    />
  );
}
