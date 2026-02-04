import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Building2 } from "lucide-react";

export default function PND50CompanyRegistration() {
  return (
    <SEOServicePage
      badge="PND50 Registration"
      title="PND50"
      titleAccent="Company Registration"
      description="Professional company registration services for foreign entrepreneurs in Thailand. PND50 handles Thai Limited Company formation, BOI applications, and all corporate setup requirements."
      primaryKeyword="PND50 Company Registration - Thai Company Formation Services"
      icon={Building2}
      features={[
        {
          title: "Thai Limited Company Formation",
          description: "Complete registration of Thai Co., Ltd. with Ministry of Commerce.",
        },
        {
          title: "Memorandum & Articles",
          description: "Drafting of memorandum of association and articles tailored to your business.",
        },
        {
          title: "Tax Registration",
          description: "Corporate income tax, VAT, and withholding tax registration with Revenue Department.",
        },
        {
          title: "Bank Account Setup",
          description: "Assistance with opening corporate bank accounts at Thai banks.",
        },
        {
          title: "Business Licenses",
          description: "Guidance on required licenses and permits for your business activities.",
        },
        {
          title: "Post-Registration Support",
          description: "First-year compliance setup including accounting system and filing calendar.",
        },
      ]}
      benefits={[
        "Complete incorporation in 2-3 weeks",
        "All government fees included in transparent pricing",
        "English communication throughout the process",
        "Post-registration support and compliance setup",
        "Tax registration handled simultaneously",
        "Integration with ongoing accounting services",
      ]}
      relatedServices={[
        {
          title: "Foreign Company Registration",
          href: "/foreign-company-registration",
          description: "Specialized services for foreign-owned company setup.",
        },
        {
          title: "Business Setup",
          href: "/business-setup-thailand",
          description: "Complete business setup including banking and licenses.",
        },
        {
          title: "Accounting Services",
          href: "/accounting-services-thailand",
          description: "Ongoing accounting after your company is registered.",
        },
      ]}
      ctaText="Start Registration"
      ctaHref="/services#corporate"
    />
  );
}
