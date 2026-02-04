import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { Users } from "lucide-react";

export default function PayrollServicesThailand() {
  return (
    <SEOServicePage
      badge="Payroll Services"
      title="Payroll Services"
      titleAccent="Thailand"
      description="Complete payroll services for businesses in Thailand. We handle employee salaries, social security contributions, withholding tax, and all Thai labor compliance requirements."
      primaryKeyword="Payroll Services Thailand - Thai Employee Payroll Management"
      icon={Users}
      features={[
        {
          title: "Monthly Payroll Processing",
          description: "Accurate salary calculations with overtime, bonuses, and deductions.",
        },
        {
          title: "Social Security (SSO)",
          description: "Monthly social security contributions calculated and filed.",
        },
        {
          title: "Withholding Tax (PND 1)",
          description: "Employee income tax withholding and monthly submissions.",
        },
        {
          title: "Pay Slips",
          description: "Professional pay slips in Thai and English for all employees.",
        },
        {
          title: "Year-End Certificates",
          description: "50 Tawi withholding certificates prepared for all employees.",
        },
        {
          title: "Labor Compliance",
          description: "Full compliance with Thai labor laws and regulations.",
        },
      ]}
      benefits={[
        "Accurate and timely payroll every month",
        "Full Thai labor law compliance",
        "Social security and tax handled",
        "Bilingual pay slips",
        "Year-end certificates prepared",
        "Integration with accounting",
      ]}
      relatedServices={[
        {
          title: "Thai Payroll Compliance",
          href: "/thai-payroll-compliance",
          description: "Full payroll compliance services.",
        },
        {
          title: "Employee Payroll Management",
          href: "/employee-payroll-management",
          description: "Complete employee payroll solutions.",
        },
        {
          title: "PND50 Payroll",
          href: "/pnd50-payroll-services",
          description: "PND50's branded payroll services.",
        },
      ]}
      ctaText="Calculate Payroll Cost"
      ctaHref="/services#accounting"
    />
  );
}
