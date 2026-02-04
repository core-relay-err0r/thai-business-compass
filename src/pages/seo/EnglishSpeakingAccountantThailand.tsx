import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { MessageSquare } from "lucide-react";

export default function EnglishSpeakingAccountantThailand() {
  return (
    <SEOServicePage
      badge="English Speaking"
      title="English Speaking Accountant"
      titleAccent="Thailand"
      description="Professional English-speaking accountants in Thailand. Clear communication, no language barriers — get accounting and tax services delivered in fluent English."
      primaryKeyword="English Speaking Accountant Thailand - English Accounting Services"
      icon={MessageSquare}
      features={[
        {
          title: "Native-Level English",
          description: "All communication in clear, professional English.",
        },
        {
          title: "English Financial Reports",
          description: "Monthly and annual reports delivered in English.",
        },
        {
          title: "No Translation Needed",
          description: "Direct communication without intermediaries.",
        },
        {
          title: "International Standards",
          description: "Familiar with international business practices.",
        },
        {
          title: "Responsive Communication",
          description: "Quick email and WhatsApp responses in English.",
        },
        {
          title: "Clear Explanations",
          description: "Thai regulations explained in plain English.",
        },
      ]}
      benefits={[
        "No language barriers",
        "Reports in English format",
        "Direct communication",
        "International business experience",
        "Quick response times",
        "Plain-English explanations",
      ]}
      relatedServices={[
        {
          title: "For Foreigners",
          href: "/accountant-for-foreigners-thailand",
          description: "Accounting for foreign entrepreneurs.",
        },
        {
          title: "For Expats",
          href: "/accounting-services-for-expats",
          description: "Services for expatriate individuals.",
        },
        {
          title: "For Foreign Companies",
          href: "/accountant-for-foreign-companies",
          description: "Corporate accounting for foreign businesses.",
        },
      ]}
      ctaText="Contact Us"
      ctaHref="/contact"
    />
  );
}
