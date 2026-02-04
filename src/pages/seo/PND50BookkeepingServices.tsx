import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { BookOpen } from "lucide-react";

export default function PND50BookkeepingServices() {
  return (
    <SEOServicePage
      badge="PND50 Bookkeeping"
      title="PND50"
      titleAccent="Bookkeeping Services"
      description="Professional bookkeeping services for foreign-owned businesses in Thailand. PND50 handles your monthly accounts, bank reconciliations, and financial reporting to Thai accounting standards."
      primaryKeyword="PND50 Bookkeeping Services - Monthly Accounting Thailand"
      icon={BookOpen}
      features={[
        {
          title: "Monthly Transaction Recording",
          description: "All income, expenses, and transactions recorded according to Thai accounting standards.",
        },
        {
          title: "Bank Reconciliation",
          description: "Monthly reconciliation of all bank accounts with clear exception reporting.",
        },
        {
          title: "Accounts Receivable/Payable",
          description: "Customer and supplier ledger management with aging analysis.",
        },
        {
          title: "Financial Statements",
          description: "Monthly profit & loss, balance sheet, and cash flow reports in English.",
        },
        {
          title: "Chart of Accounts Setup",
          description: "Customized chart of accounts aligned with Thai standards and your reporting needs.",
        },
        {
          title: "Document Management",
          description: "Organized storage and retrieval of source documents for audits and reviews.",
        },
      ]}
      benefits={[
        "Thai accounting standards compliance guaranteed",
        "English financial reports delivered monthly",
        "Clean records ready for tax filing and audits",
        "Transparent pricing based on transaction volume",
        "Dedicated accountant who knows your business",
        "Cloud-based access to your financial data",
      ]}
      relatedServices={[
        {
          title: "PND50 Tax Filing",
          href: "/pnd50-tax-filing",
          description: "Annual corporate tax returns from your bookkeeping records.",
        },
        {
          title: "Payroll Services",
          href: "/pnd50-payroll-services",
          description: "Employee payroll processing integrated with your accounts.",
        },
        {
          title: "Accounting Services",
          href: "/accounting-services-thailand",
          description: "Full-service accounting for Thai companies.",
        },
      ]}
      ctaText="Calculate Bookkeeping Cost"
      ctaHref="/services#accounting"
    />
  );
}
