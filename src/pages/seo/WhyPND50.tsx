import { SEOBrandPage } from "@/components/seo/SEOBrandPage";
import { Globe, Shield, Users, MessageSquare, Award, Clock } from "lucide-react";

export default function WhyPND50() {
  return (
    <SEOBrandPage
      badge="Why Choose Us"
      title="Why Choose"
      titleAccent="PND50 Thailand"
      description="PND50 is a Bangkok-based accounting firm trusted by 150+ foreign-owned businesses. We specialize in Thai corporate tax, bookkeeping, payroll, and business advisory — with clear communication in English."
      primaryKeyword="PND50 Thailand - Thai Accounting Firm for Foreign Businesses"
      stats={[
        { value: "10+", label: "Years Experience" },
        { value: "150+", label: "Happy Clients" },
        { value: "100%", label: "Compliance Rate" },
        { value: "24h", label: "Response Time" },
      ]}
      reasons={[
        {
          icon: Globe,
          title: "Built for Foreigners",
          description: "We understand the unique challenges foreign founders face when operating in Thailand. English-first communication, no jargon.",
        },
        {
          icon: Shield,
          title: "Full Compliance Focus",
          description: "Stay ahead of deadlines with proactive compliance management. We handle corporate tax, VAT, payroll, and annual filings.",
        },
        {
          icon: Users,
          title: "Dedicated Team",
          description: "Your own accountant who knows your business. Direct access via WhatsApp, email, or phone — no call centers.",
        },
        {
          icon: MessageSquare,
          title: "Clear Communication",
          description: "Plain-English explanations of Thai accounting requirements. We translate complex regulations into actionable steps.",
        },
        {
          icon: Award,
          title: "Proven Track Record",
          description: "150+ foreign-owned companies trust PND50 with their Thai accounting. From startups to established enterprises.",
        },
        {
          icon: Clock,
          title: "Fast Turnaround",
          description: "24-hour email responses. Monthly reports delivered on time. Year-end filings submitted ahead of deadlines.",
        },
      ]}
      benefits={[
        "English-speaking accountants who understand foreign business needs",
        "Proactive compliance management — never miss a deadline",
        "Transparent pricing with no hidden fees",
        "Direct communication via WhatsApp, email, or phone",
        "Monthly financial reports in English",
        "Corporate tax, VAT, and payroll handled together",
        "Business advisory for restructuring and growth",
        "10+ years serving foreign businesses in Thailand",
      ]}
    />
  );
}
