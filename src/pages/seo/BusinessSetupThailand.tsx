import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Briefcase } from "lucide-react";

export default function BusinessSetupThailand() {
  return (
    <SEOServicePage
      badge="Business Setup"
      title="Business Setup"
      titleAccent="Thailand"
      description="Complete business setup services for entrepreneurs starting in Thailand. From company registration to bank accounts and licenses — we handle everything you need to operate legally."
      primaryKeyword="Business Setup Thailand - Start Business in Thailand"
      icon={Briefcase}
      features={[
        {
          title: "Company Registration",
          description: "Thai Limited Company formation with all required documentation.",
        },
        {
          title: "Tax Registration",
          description: "Corporate income tax, VAT, and withholding tax registration.",
        },
        {
          title: "Bank Account Setup",
          description: "Assistance with opening corporate bank accounts.",
        },
        {
          title: "Business Licenses",
          description: "Application for required permits and business licenses.",
        },
        {
          title: "Office Setup",
          description: "Registered office address and virtual office options.",
        },
        {
          title: "Accounting System",
          description: "Setup of accounting system and compliance calendar.",
        },
      ]}
      benefits={[
        "One-stop business setup solution",
        "Complete in 3-4 weeks",
        "All government registrations handled",
        "Bank account support included",
        "Ongoing compliance support",
        "English communication throughout",
      ]}
      relatedServices={[
        {
          title: "Company Registration",
          href: "/company-registration-thailand",
          description: "Thai company registration services.",
        },
        {
          title: "Foreign Company Setup",
          href: "/foreign-company-registration",
          description: "Services for foreign entrepreneurs.",
        },
        {
          title: "Accounting Services",
          href: "/accounting-services-thailand",
          description: "Ongoing accounting after setup.",
        },
      ]}
      ctaText="Start Your Business"
      ctaHref="/services#corporate"
    />
  );
}
