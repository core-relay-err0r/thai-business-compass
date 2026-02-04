import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Briefcase } from "lucide-react";

export default function BusinessAdvisoryServicesThailand() {
  return (
    <SEOServicePage
      badge="Business Advisory"
      title="Business Advisory Services"
      titleAccent="Thailand"
      description="Strategic business advisory services for companies operating in Thailand. Expert guidance on restructuring, market entry, operational optimization, and regulatory compliance."
      primaryKeyword="Business Advisory Services Thailand - Business Consulting Thailand"
      icon={Briefcase}
      features={[
        {
          title: "Business Restructuring",
          description: "Strategic advice on corporate restructuring and reorganization.",
        },
        {
          title: "Market Entry Strategy",
          description: "Guidance for companies entering the Thai market.",
        },
        {
          title: "Operational Optimization",
          description: "Analysis and improvement of business operations.",
        },
        {
          title: "Due Diligence",
          description: "Financial and operational due diligence for transactions.",
        },
        {
          title: "Compliance Advisory",
          description: "Guidance on regulatory compliance requirements.",
        },
        {
          title: "Exit Planning",
          description: "Strategic planning for business exit or sale.",
        },
      ]}
      benefits={[
        "Experienced Thai business advisors",
        "Actionable recommendations",
        "Confidential and objective",
        "Implementation support",
        "Flexible engagement models",
        "Integration with other services",
      ]}
      relatedServices={[
        {
          title: "PND50 Advisory",
          href: "/pnd50-business-advisory",
          description: "PND50's business advisory services.",
        },
        {
          title: "Tax Planning",
          href: "/tax-planning-thailand",
          description: "Strategic tax planning.",
        },
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Tax advisory and consulting.",
        },
      ]}
      ctaText="Explore Advisory Services"
      ctaHref="/services#consulting"
    />
  );
}
