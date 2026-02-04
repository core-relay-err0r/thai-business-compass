import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Globe } from "lucide-react";

export default function ForeignCompanyRegistration() {
  return (
    <SEOServicePage
      badge="Foreign Company Registration"
      title="Foreign Company Registration"
      titleAccent="Thailand"
      description="Specialized company registration services for foreign entrepreneurs in Thailand. We understand the unique requirements and restrictions for foreign-owned Thai companies."
      primaryKeyword="Foreign Company Registration Thailand - Foreign Business Setup"
      icon={Globe}
      features={[
        {
          title: "Foreign Ownership Structures",
          description: "Guidance on legal structures for foreign-owned businesses.",
        },
        {
          title: "FBA Considerations",
          description: "Navigation of Foreign Business Act requirements and exemptions.",
        },
        {
          title: "BOI Privileges",
          description: "Support for Board of Investment applications and benefits.",
        },
        {
          title: "Treaty of Amity",
          description: "US Treaty of Amity company registration for American nationals.",
        },
        {
          title: "Joint Venture Setup",
          description: "Structuring of joint ventures with Thai partners.",
        },
        {
          title: "Branch & Rep Office",
          description: "Registration of branch offices and representative offices.",
        },
      ]}
      benefits={[
        "Expert guidance on foreign ownership rules",
        "Legal compliance with FBA requirements",
        "BOI application support",
        "Treaty company expertise",
        "Clear English communication",
        "Post-registration support included",
      ]}
      relatedServices={[
        {
          title: "Company Registration",
          href: "/company-registration-thailand",
          description: "General company registration services.",
        },
        {
          title: "Business Setup",
          href: "/business-setup-thailand",
          description: "Complete business setup support.",
        },
        {
          title: "Business Advisory",
          href: "/business-advisory-services-thailand",
          description: "Strategic business consulting.",
        },
      ]}
      ctaText="Register Foreign Company"
      ctaHref="/services#corporate"
    />
  );
}
