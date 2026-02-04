import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { FileCheck } from "lucide-react";

export default function ThaiAccountingStandards() {
  return (
    <SEOServicePage
      badge="Thai GAAP"
      title="Thai Accounting"
      titleAccent="Standards"
      description="Expert guidance on Thai accounting standards for your business. We ensure full compliance with TFRS, NPAE, and Thai GAAP requirements for statutory reporting and tax purposes."
      primaryKeyword="Thai Accounting Standards - TFRS NPAE Thai GAAP Compliance"
      icon={FileCheck}
      features={[
        {
          title: "TFRS Compliance",
          description: "Full compliance with Thai Financial Reporting Standards for PAEs.",
        },
        {
          title: "NPAE Standards",
          description: "Simplified standards for Non-Publicly Accountable Entities.",
        },
        {
          title: "Revenue Recognition",
          description: "Proper revenue recognition under Thai accounting standards.",
        },
        {
          title: "Asset Valuation",
          description: "Fixed asset and inventory valuation per Thai requirements.",
        },
        {
          title: "Disclosure Requirements",
          description: "Complete financial statement disclosures for statutory purposes.",
        },
        {
          title: "Standard Updates",
          description: "Stay current with changes to Thai accounting regulations.",
        },
      ]}
      benefits={[
        "Full TFRS/NPAE compliance",
        "Proper classification and recognition",
        "Complete disclosure requirements met",
        "Audit-ready financial statements",
        "Regular updates on standard changes",
        "Expert guidance on complex issues",
      ]}
      relatedServices={[
        {
          title: "Corporate Accounting",
          href: "/corporate-accounting-thailand",
          description: "Full corporate accounting services.",
        },
        {
          title: "Accounting Firm",
          href: "/accounting-firm-thailand",
          description: "PND50 as your Thai accounting partner.",
        },
        {
          title: "For Foreign Companies",
          href: "/accountant-for-foreign-companies",
          description: "Thai standards explained for foreign businesses.",
        },
      ]}
      ctaText="Get Compliance Support"
      ctaHref="/services#accounting"
    />
  );
}
