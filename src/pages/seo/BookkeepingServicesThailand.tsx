import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { BookOpen } from "lucide-react";

export default function BookkeepingServicesThailand() {
  return (
    <SEOServicePage
      badge="Bookkeeping Services"
      title="Bookkeeping Services"
      titleAccent="Thailand"
      description="Reliable bookkeeping services for Thai businesses. Accurate transaction recording, bank reconciliation, and financial reporting compliant with Thai accounting standards."
      primaryKeyword="Bookkeeping Services Thailand - Thai Business Bookkeeping"
      icon={BookOpen}
      features={[
        {
          title: "Transaction Recording",
          description: "Daily and monthly recording of all business transactions.",
        },
        {
          title: "Bank Reconciliation",
          description: "Monthly reconciliation of all bank and credit card accounts.",
        },
        {
          title: "Accounts Management",
          description: "Accounts receivable and payable tracking with aging reports.",
        },
        {
          title: "Expense Classification",
          description: "Proper classification of expenses for tax optimization.",
        },
        {
          title: "Document Organization",
          description: "Systematic filing of invoices, receipts, and supporting documents.",
        },
        {
          title: "Cloud Accounting",
          description: "Online access to your books via cloud accounting platforms.",
        },
      ]}
      benefits={[
        "Accurate records for tax and audit purposes",
        "Thai accounting standards compliance",
        "Monthly reports in English",
        "Transparent pricing based on volume",
        "Dedicated bookkeeper for your account",
        "Integration with Thai tax systems",
      ]}
      relatedServices={[
        {
          title: "Accounting Services",
          href: "/accounting-services-thailand",
          description: "Full-service accounting including bookkeeping.",
        },
        {
          title: "PND50 Bookkeeping",
          href: "/pnd50-bookkeeping-services",
          description: "PND50's branded bookkeeping services.",
        },
        {
          title: "Tax Filing",
          href: "/tax-filing-services-thailand",
          description: "Tax returns prepared from your bookkeeping records.",
        },
      ]}
      ctaText="Calculate Bookkeeping Cost"
      ctaHref="/services#accounting"
    />
  );
}
