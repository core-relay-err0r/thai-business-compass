import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Users } from "lucide-react";

export default function PND50PayrollServices() {
  return (
    <SEOServicePage
      badge="PND50 Payroll"
      title="PND50"
      titleAccent="Payroll Services"
      description="Complete payroll services for foreign-owned companies in Thailand. PND50 handles employee salaries, social security, withholding tax, and compliance with Thai labor regulations."
      primaryKeyword="PND50 Payroll Services - Employee Payroll Management Thailand"
      icon={Users}
      features={[
        {
          title: "Monthly Payroll Processing",
          description: "Accurate salary calculations including overtime, bonuses, and deductions.",
        },
        {
          title: "Social Security Submissions",
          description: "Monthly social security (SSO) contributions calculated and filed on time.",
        },
        {
          title: "Withholding Tax (PND 1)",
          description: "Employee income tax withholding calculated and submitted monthly.",
        },
        {
          title: "Pay Slip Generation",
          description: "Professional pay slips for each employee in Thai and English.",
        },
        {
          title: "Annual Withholding Certificates",
          description: "50 Tawi certificates prepared for all employees at year-end.",
        },
        {
          title: "Provident Fund Management",
          description: "Optional provident fund contributions processed and reported.",
        },
      ]}
      benefits={[
        "Full Thai labor law compliance guaranteed",
        "On-time salary payments every month",
        "Social security and tax filings handled",
        "English and Thai pay slips for employees",
        "Year-end tax certificates prepared automatically",
        "Integration with bookkeeping for accurate reporting",
      ]}
      relatedServices={[
        {
          title: "Bookkeeping Services",
          href: "/pnd50-bookkeeping-services",
          description: "Monthly bookkeeping that includes payroll journal entries.",
        },
        {
          title: "Company Registration",
          href: "/pnd50-company-registration",
          description: "Register your Thai company before hiring employees.",
        },
        {
          title: "Thai Payroll Compliance",
          href: "/thai-payroll-compliance",
          description: "Full compliance with Thai employment regulations.",
        },
      ]}
      ctaText="Calculate Payroll Cost"
      ctaHref="/services#accounting"
    />
  );
}
