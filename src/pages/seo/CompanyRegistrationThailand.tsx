import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Building2 } from "lucide-react";

export default function CompanyRegistrationThailand() {
  return (
    <SEOServicePage
      badge="Company Registration"
      title="Company Registration"
      titleAccent="Thailand"
      description="Professional company registration services in Thailand. We handle Thai Limited Company formation, documentation, tax registration, and post-incorporation support for foreign entrepreneurs."
      primaryKeyword="Company Registration Thailand - Thai Company Formation"
      icon={Building2}
      features={[
        {
          title: "Thai Limited Company",
          description: "Complete registration of Thai Co., Ltd. with Ministry of Commerce.",
        },
        {
          title: "Company Documentation",
          description: "Memorandum and Articles of Association drafted to your requirements.",
        },
        {
          title: "Shareholder Structure",
          description: "Proper structuring of shareholding within Thai regulations.",
        },
        {
          title: "Tax Registration",
          description: "Corporate income tax and VAT registration with Revenue Department.",
        },
        {
          title: "Business Licenses",
          description: "Guidance on required permits and licenses for your business.",
        },
        {
          title: "Bank Account Assistance",
          description: "Support for opening corporate bank accounts in Thailand.",
        },
      ]}
      benefits={[
        "Complete incorporation in 2-3 weeks",
        "All government fees included",
        "English communication throughout",
        "Tax registration handled simultaneously",
        "Post-incorporation support included",
        "Ongoing accounting services available",
      ]}
      relatedServices={[
        {
          title: "Business Setup",
          href: "/business-setup-thailand",
          description: "Complete business setup services.",
        },
        {
          title: "Foreign Company Registration",
          href: "/foreign-company-registration",
          description: "Services for foreign-owned companies.",
        },
        {
          title: "PND50 Registration",
          href: "/pnd50-company-registration",
          description: "PND50's company registration services.",
        },
      ]}
      ctaText="Start Registration"
      ctaHref="/services#corporate"
    />
  );
}
