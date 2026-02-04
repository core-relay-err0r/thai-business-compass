import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Shield } from "lucide-react";

export default function ThaiPayrollCompliance() {
  return (
    <SEOServicePage
      badge="Payroll Compliance"
      title="Thai Payroll"
      titleAccent="Compliance"
      description="Expert Thai payroll compliance services ensuring full adherence to labor laws, social security regulations, and tax requirements. Protect your business from penalties and legal issues."
      primaryKeyword="Thai Payroll Compliance - Labor Law Compliance Thailand"
      icon={Shield}
      features={[
        {
          title: "Labor Law Compliance",
          description: "Full compliance with Thai Labor Protection Act requirements.",
        },
        {
          title: "Social Security Compliance",
          description: "Proper registration and contribution management with SSO.",
        },
        {
          title: "Withholding Tax Compliance",
          description: "Accurate calculation and timely submission of PND 1 returns.",
        },
        {
          title: "Provident Fund Compliance",
          description: "Management of optional provident fund contributions.",
        },
        {
          title: "Record Keeping",
          description: "Proper maintenance of employee records as required by law.",
        },
        {
          title: "Compliance Audits",
          description: "Regular review of payroll practices against Thai regulations.",
        },
      ]}
      benefits={[
        "Avoid labor law penalties",
        "Proper social security management",
        "Accurate tax withholding",
        "Complete record keeping",
        "Regular compliance reviews",
        "Expert guidance on regulations",
      ]}
      relatedServices={[
        {
          title: "Payroll Services",
          href: "/payroll-services-thailand",
          description: "Complete payroll processing services.",
        },
        {
          title: "Employee Management",
          href: "/employee-payroll-management",
          description: "Full employee payroll management.",
        },
        {
          title: "PND50 Payroll",
          href: "/pnd50-payroll-services",
          description: "PND50's payroll services.",
        },
      ]}
      ctaText="Get Compliance Support"
      ctaHref="/services#accounting"
    />
  );
}
