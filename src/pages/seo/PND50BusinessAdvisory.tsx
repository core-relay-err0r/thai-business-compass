import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Briefcase } from "lucide-react";

export default function PND50BusinessAdvisory() {
  return (
    <SEOServicePage
      badge="PND50 Advisory"
      title="PND50"
      titleAccent="Business Advisory"
      description="Strategic business advisory services for foreign-owned companies in Thailand. PND50 provides expert guidance on restructuring, market entry, due diligence, and operational optimization."
      primaryKeyword="PND50 Business Advisory - Strategic Consulting Thailand"
      icon={Briefcase}
      features={[
        {
          title: "Business Restructuring",
          description: "Strategic advice on corporate structure changes, mergers, and reorganization.",
        },
        {
          title: "Market Entry Strategy",
          description: "Guidance for foreign companies entering the Thai market for the first time.",
        },
        {
          title: "Due Diligence",
          description: "Financial and operational due diligence for acquisitions and investments.",
        },
        {
          title: "Cost Optimization",
          description: "Analysis of operations to identify cost reduction opportunities.",
        },
        {
          title: "Compliance Review",
          description: "Assessment of regulatory compliance status with actionable recommendations.",
        },
        {
          title: "Exit Planning",
          description: "Strategic planning for business exit, sale, or transfer in Thailand.",
        },
      ]}
      benefits={[
        "Expert guidance from experienced Thai business advisors",
        "Clear recommendations tailored to foreign-owned companies",
        "Confidential and objective analysis",
        "Actionable insights with implementation support",
        "Integration with accounting and tax services",
        "Flexible engagement — hourly or project-based",
      ]}
      relatedServices={[
        {
          title: "Company Registration",
          href: "/pnd50-company-registration",
          description: "Register your Thai company with expert guidance.",
        },
        {
          title: "Tax Planning",
          href: "/tax-planning-thailand",
          description: "Strategic tax planning for your Thai operations.",
        },
        {
          title: "Foreign Company Setup",
          href: "/foreign-company-registration",
          description: "Complete setup services for foreign-owned companies.",
        },
      ]}
      ctaText="Explore Advisory Services"
      ctaHref="/services#consulting"
    />
  );
}
