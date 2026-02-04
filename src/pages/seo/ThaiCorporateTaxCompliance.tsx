import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Shield } from "lucide-react";

export default function ThaiCorporateTaxCompliance() {
  return (
    <SEOServicePage
      badge="Tax Compliance"
      title="Thai Corporate Tax"
      titleAccent="Compliance"
      description="Complete Thai corporate tax compliance services. We manage all your tax obligations — corporate income tax, VAT, withholding tax — so you never miss a deadline."
      primaryKeyword="Thai Corporate Tax Compliance - Corporate Tax Management Thailand"
      icon={Shield}
      features={[
        {
          title: "Corporate Income Tax",
          description: "PND 50, PND 51, and all corporate income tax obligations.",
        },
        {
          title: "VAT Compliance",
          description: "Monthly PP 30 VAT returns and input/output tax reconciliation.",
        },
        {
          title: "Withholding Tax",
          description: "PND 1, 3, 53, 54 withholding tax returns for all payment types.",
        },
        {
          title: "Deadline Calendar",
          description: "Proactive management of all tax filing deadlines.",
        },
        {
          title: "Payment Processing",
          description: "Timely tax payments with proper documentation.",
        },
        {
          title: "Compliance Reporting",
          description: "Regular reports on your tax compliance status.",
        },
      ]}
      benefits={[
        "Never miss a tax deadline",
        "All tax types handled together",
        "Proactive deadline reminders",
        "Accurate calculations verified",
        "Electronic filing for all returns",
        "One point of contact for all taxes",
      ]}
      relatedServices={[
        {
          title: "Tax Filing Services",
          href: "/tax-filing-services-thailand",
          description: "Individual tax return preparation.",
        },
        {
          title: "Corporate Income Tax",
          href: "/corporate-income-tax-thailand",
          description: "Corporate income tax expertise.",
        },
        {
          title: "Tax Advisory",
          href: "/thai-tax-advisory-services",
          description: "Strategic tax planning services.",
        },
      ]}
      ctaText="Get Compliance Quote"
      ctaHref="/services#accounting"
    />
  );
}
