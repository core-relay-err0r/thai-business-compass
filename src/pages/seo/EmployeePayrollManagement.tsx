import { SEOServicePage } from "@/components/seo/SEOServicePage";
import { UserCheck } from "lucide-react";

export default function EmployeePayrollManagement() {
  return (
    <SEOServicePage
      badge="Payroll Management"
      title="Employee Payroll Management"
      titleAccent="Thailand"
      description="Complete employee payroll management services for Thai businesses. From salary processing to compliance reporting, we handle all aspects of your employee compensation."
      primaryKeyword="Employee Payroll Management Thailand - Staff Payroll Services"
      icon={UserCheck}
      features={[
        {
          title: "Salary Processing",
          description: "Monthly salary calculations including all allowances and deductions.",
        },
        {
          title: "Leave Management",
          description: "Tracking and calculation of annual leave, sick leave, and absences.",
        },
        {
          title: "Overtime Calculations",
          description: "Proper calculation of overtime per Thai labor law requirements.",
        },
        {
          title: "Benefits Administration",
          description: "Management of employee benefits and allowances.",
        },
        {
          title: "Employee Records",
          description: "Maintenance of complete employee files and documentation.",
        },
        {
          title: "Reporting",
          description: "Regular payroll reports for management review.",
        },
      ]}
      benefits={[
        "Complete payroll management",
        "Accurate leave tracking",
        "Proper overtime calculations",
        "Benefits administration included",
        "Complete employee records",
        "Regular management reports",
      ]}
      relatedServices={[
        {
          title: "Payroll Services",
          href: "/payroll-services-thailand",
          description: "Core payroll processing services.",
        },
        {
          title: "Payroll Compliance",
          href: "/thai-payroll-compliance",
          description: "Compliance with Thai labor laws.",
        },
        {
          title: "Bookkeeping",
          href: "/bookkeeping-services-thailand",
          description: "Payroll integrated with bookkeeping.",
        },
      ]}
      ctaText="Get Payroll Quote"
      ctaHref="/services#accounting"
    />
  );
}
