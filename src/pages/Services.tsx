import { Layout } from "@/components/layout/Layout";
import { ServicesWizard } from "@/components/services/wizard/ServicesWizard";
import { SEOHead } from "@/components/seo/SEOHead";
import { FAQSchema, ServiceSchema } from "@/components/seo/StructuredData";

const servicesList = [
  {
    name: "Company Registration Thailand",
    description: "Full support for registering a Thai Limited Company, including BOI applications and work permit processing.",
  },
  {
    name: "Monthly Bookkeeping",
    description: "Comprehensive bookkeeping services including transaction recording, bank reconciliation, and financial reporting.",
  },
  {
    name: "Corporate Tax Filing",
    description: "PND50 and PND51 corporate income tax filing, VAT returns, and withholding tax compliance.",
  },
  {
    name: "Payroll Services Thailand",
    description: "Full payroll processing including salary calculations, social security contributions, and tax withholding.",
  },
  {
    name: "Business Consulting",
    description: "Strategic advisory on tax optimization, visa requirements, and corporate restructuring for foreign businesses.",
  },
];

const serviceFAQs = [
  {
    question: "What accounting services does PND50 offer in Thailand?",
    answer: "PND50 offers comprehensive accounting services including monthly bookkeeping, corporate tax filing (PND50, PND51), VAT returns, payroll processing, social security contributions, and financial statement preparation for foreign-owned businesses in Thailand.",
  },
  {
    question: "How much does accounting cost in Thailand?",
    answer: "Accounting fees in Thailand vary based on transaction volume and complexity. PND50 offers transparent pricing starting from ฿5,000/month for basic bookkeeping, with customized quotes based on your specific business needs.",
  },
  {
    question: "Do I need a Thai accountant if I'm a foreign company?",
    answer: "Yes, all companies registered in Thailand must maintain proper accounting records and file taxes in Thai. PND50 specializes in helping foreign-owned businesses with English-speaking accountants who understand international business practices.",
  },
  {
    question: "What is the corporate tax rate in Thailand?",
    answer: "The standard corporate tax rate in Thailand is 20%. Small and medium enterprises may qualify for reduced rates. PND50 helps optimize your tax position while ensuring full compliance with Thai Revenue Department requirements.",
  },
];

export default function Services() {
  return (
    <Layout>
      <SEOHead
        title="Accounting Services Thailand | Tax Filing & Bookkeeping | PND50"
        description="Professional accounting services in Thailand for foreign companies. Monthly bookkeeping, corporate tax filing, VAT returns, payroll, and financial reporting by English-speaking accountants."
        path="/services"
        keywords="accounting services Thailand, Thai tax filing, bookkeeping Thailand, payroll Thailand, corporate tax Thailand, VAT Thailand, foreign company accounting"
      />
      <FAQSchema items={serviceFAQs} />
      <ServiceSchema services={servicesList} />
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <ServicesWizard />
          </div>
        </div>
      </section>
    </Layout>
  );
}
