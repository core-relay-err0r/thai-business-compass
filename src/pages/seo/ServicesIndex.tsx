import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ArrowRight, Building2, Calculator, Users, FileText, Globe, Briefcase } from "lucide-react";

const serviceCategories = [
  {
    title: "Accounting & Bookkeeping",
    icon: Calculator,
    description: "Monthly bookkeeping, financial reporting, and Thai accounting standards compliance.",
    services: [
      { name: "Accounting Services Thailand", href: "/accounting-services-thailand" },
      { name: "Corporate Accounting", href: "/corporate-accounting-thailand" },
      { name: "Bookkeeping Services", href: "/bookkeeping-services-thailand" },
      { name: "Thai Accounting Standards", href: "/thai-accounting-standards" },
      { name: "Accounting Firm Thailand", href: "/accounting-firm-thailand" },
      { name: "For Foreign Companies", href: "/accountant-for-foreign-companies" },
    ],
  },
  {
    title: "Tax & Compliance",
    icon: FileText,
    description: "Corporate income tax, VAT, withholding tax, and full compliance management.",
    services: [
      { name: "PND50 Tax Filing", href: "/pnd50-tax-filing" },
      { name: "Corporate Income Tax", href: "/corporate-income-tax-thailand" },
      { name: "Tax Compliance", href: "/thai-corporate-tax-compliance" },
      { name: "Tax Filing Services", href: "/tax-filing-services-thailand" },
      { name: "Annual Tax Return", href: "/annual-corporate-tax-return" },
      { name: "Tax Advisory", href: "/thai-tax-advisory-services" },
    ],
  },
  {
    title: "Payroll Services",
    icon: Users,
    description: "Employee payroll, social security, and Thai labor compliance.",
    services: [
      { name: "Payroll Services Thailand", href: "/payroll-services-thailand" },
      { name: "Thai Payroll Compliance", href: "/thai-payroll-compliance" },
      { name: "Employee Payroll Management", href: "/employee-payroll-management" },
      { name: "PND50 Payroll Services", href: "/pnd50-payroll-services" },
    ],
  },
  {
    title: "Company Setup",
    icon: Building2,
    description: "Thai company registration, business setup, and corporate structuring.",
    services: [
      { name: "Company Registration Thailand", href: "/company-registration-thailand" },
      { name: "Business Setup Thailand", href: "/business-setup-thailand" },
      { name: "Foreign Company Registration", href: "/foreign-company-registration" },
      { name: "PND50 Company Registration", href: "/pnd50-company-registration" },
    ],
  },
  {
    title: "Business Advisory",
    icon: Briefcase,
    description: "Strategic consulting, restructuring, and tax planning.",
    services: [
      { name: "Business Advisory Services", href: "/business-advisory-services-thailand" },
      { name: "Tax Planning Thailand", href: "/tax-planning-thailand" },
      { name: "PND50 Business Advisory", href: "/pnd50-business-advisory" },
      { name: "PND50 Corporate Tax", href: "/pnd50-corporate-tax" },
    ],
  },
  {
    title: "For Foreigners & Expats",
    icon: Globe,
    description: "Specialized services for foreign entrepreneurs and expatriates.",
    services: [
      { name: "Accountant for Foreigners", href: "/accountant-for-foreigners-thailand" },
      { name: "English Speaking Accountant", href: "/english-speaking-accountant-thailand" },
      { name: "Accounting for Expats", href: "/accounting-services-for-expats" },
      { name: "Tax for Foreign Businesses", href: "/tax-services-for-foreign-businesses" },
    ],
  },
];

export default function ServicesIndex() {
  return (
    <Layout>
      {/* SEO H1 */}
      <h1 className="sr-only">PND50 Services - Accounting, Tax, and Corporate Services in Thailand</h1>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-border">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Our Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to operate in{" "}
              <span className="text-primary">Thailand</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comprehensive accounting services Thailand businesses trust: bookkeeping, tax filing, payroll, company registration, and business advisory — designed for foreign-owned companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="min-h-[44px] w-full sm:w-auto">
                  Get in touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pnd50-thailand">
                <Button variant="outline" size="lg" className="min-h-[44px] w-full sm:w-auto">
                  Why PND50
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {serviceCategories.map((category) => (
              <Card key={category.title} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.services.map((service) => (
                      <li key={service.href}>
                        <Link 
                          to={service.href}
                          className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <ArrowRight className="h-3 w-3" />
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Not Sure What You Need?
            </h2>
            <p className="text-muted-foreground mb-8">
              Use our interactive tools to discover exactly what services apply to your business and calculate costs instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services/calculator">
                <Button size="lg" className="min-h-[44px] w-full sm:w-auto">
                  See what applies to you
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="min-h-[44px] w-full sm:w-auto">
                  Talk to an expert
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Foreigner Focus Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                For Foreigners
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Built for International Business Owners
              </h2>
              <p className="text-muted-foreground">
                PND50 specializes in serving foreign-owned companies and expatriates in Thailand. 
                English-first communication, international standards, and deep understanding of your unique needs.
              </p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/accountant-for-foreigners-thailand" className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">For Foreigners</h4>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/english-speaking-accountant-thailand" className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">English Speaking</h4>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/accounting-services-for-expats" className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">For Expats</h4>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/tax-services-for-foreign-businesses" className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">Foreign Businesses</h4>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
