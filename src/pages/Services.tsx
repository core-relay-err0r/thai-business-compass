import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { InternalPageHeader } from "@/components/layout/InternalPageHeader";
import { CorporateServicesContent } from "@/components/corporate/CorporateServices";
import { AccountingWizard } from "@/components/accounting/AccountingWizard";
import { LiveEstimate } from "@/components/accounting/LiveEstimate";
import { MobileEstimateSheet } from "@/components/accounting/MobileEstimateSheet";
import { ConsultingServices } from "@/components/consulting/ConsultingServices";
import { AIRecommender } from "@/components/services/AIRecommender";
import { Building2, Calculator, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEOHead } from "@/components/seo/SEOHead";
import { FAQSchema, ServiceSchema } from "@/components/seo/StructuredData";

const servicesList = [
  {
    name: "Company Registration Thailand",
    description: "Scope and filing support for a standard Thai limited company. BOI, licensing, visa, and work-permit matters are assessed and quoted separately when relevant.",
  },
  {
    name: "Monthly Bookkeeping",
    description: "Monthly transaction recording and reconciliation, with filing and reporting scope based on the company’s registrations and activity.",
  },
  {
    name: "Corporate Tax Filing",
    description: "Preparation and filing support for applicable corporate income tax, VAT, and withholding tax returns based on the company’s facts and registrations.",
  },
  {
    name: "Payroll Services Thailand",
    description: "Payroll calculations and support for applicable social security and payroll withholding filings, scoped to the employee data supplied.",
  },
  {
    name: "Business consulting",
    description: "Decision support for cost, market entry, commercial risk, and corporate structure. Regulated legal, immigration, and investment-promotion work is separately scoped.",
  },
];

const serviceFAQs = [
  {
    question: "What accounting services does PND50 offer in Thailand?",
    answer: "PND50 covers monthly bookkeeping, corporate income tax filing (PND50, PND51), VAT returns, payroll and social security filings, and annual financial statement preparation for foreign-owned businesses in Thailand. The exact services depend on your registrations and activity and are confirmed in the engagement scope.",
  },
  {
    question: "How much does accounting cost in Thailand?",
    answer: "Accounting fees in Thailand vary with transaction volume, registrations, and complexity. PND50 uses transparent pricing that starts from ฿5,000/month for basic bookkeeping; final fees are confirmed by quote after reviewing your specific business needs.",
  },
  {
    question: "Do I need a Thai accountant if I'm a foreign company?",
    answer: "Thai-registered companies are generally subject to Thai bookkeeping, financial-statement, and tax-filing obligations. The exact returns and supporting work depend on the entity, registrations, transactions, and filing period. PND50 works in English while preparing the Thai compliance records and filings within the agreed scope.",
  },
  {
    question: "What is the corporate tax rate in Thailand?",
    answer: "Thailand’s standard corporate income tax rate is currently 20% of net profit. Certain qualifying SMEs and promoted activities may be subject to different rates or incentives. The applicable treatment depends on current law and the company’s facts; PND50 prepares filings and identifies issues within the agreed engagement scope.",
  },
];

type ActiveSection = "corporate" | "accounting" | "consulting";

const sectionData = {
  corporate: {
    icon: Building2,
    title: "Corporate services",
    description: "Set up or change the company without leaving legal and documentary loose ends.",
  },
  accounting: {
    icon: Calculator,
    title: "Accounting Calculator",
    description: "Expose recurring filings, records, payroll, and year-end work before committing.",
  },
  consulting: {
    icon: MessageSquare,
    title: "Business consulting",
    description: "Pressure-test the business decision, not a generic consulting package.",
  },
};

export default function Services() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<ActiveSection>("corporate");
  
  const corporateRef = useRef<HTMLDivElement>(null);
  const accountingRef = useRef<HTMLDivElement>(null);
  const consultingRef = useRef<HTMLDivElement>(null);

  // Scroll to hash on page load or hash change (only if hash exists)
  useEffect(() => {
    const hash = location.hash.replace("#", "") as ActiveSection;
    if (hash && ["corporate", "accounting", "consulting"].includes(hash)) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const refs = {
          corporate: corporateRef,
          accounting: accountingRef,
          consulting: consultingRef,
        };
        refs[hash].current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      const corporateTop = corporateRef.current?.offsetTop || 0;
      const accountingTop = accountingRef.current?.offsetTop || 0;
      const consultingTop = consultingRef.current?.offsetTop || 0;

      if (scrollPosition >= consultingTop) {
        setActiveSection("consulting");
      } else if (scrollPosition >= accountingTop) {
        setActiveSection("accounting");
      } else {
        setActiveSection("corporate");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (section: ActiveSection) => {
    const refs = {
      corporate: corporateRef,
      accounting: accountingRef,
      consulting: consultingRef,
    };
    
    refs[section].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const currentSection = sectionData[activeSection];
  const SectionIcon = currentSection.icon;

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
      <InternalPageHeader
        eyebrow="Map the exposure"
        meta="Corporate · Accounting · Advisory"
        title={<>Do not buy a package. <span className="text-primary">Diagnose the work.</span></>}
        description="Build the scope around your actual company, filings, people, and plans. See known fees immediately; use a custom quote only where complexity makes one necessary."
      />

      <section className="py-8 sm:py-10 md:py-16">
        <div className="container px-4 sm:px-6">
          <div className="max-w-7xl mx-auto mb-8 sm:mb-10">
            <AIRecommender />
          </div>
          <div className="flex gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* Sticky Sidebar - Desktop Only */}
            <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <div className="sticky top-24 xl:top-32 space-y-6 xl:space-y-8">
                {/* Current Section Info */}
                <div className="space-y-3 xl:space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <SectionIcon className="w-4 h-4 xl:w-5 xl:h-5 text-primary" />
                    </div>
                    <h2 className="text-lg xl:text-xl font-semibold">{currentSection.title}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {currentSection.description}
                  </p>
                </div>

                {/* Section Navigation */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Sections
                  </p>
                  {(Object.keys(sectionData) as ActiveSection[]).map((section) => {
                    const Icon = sectionData[section].icon;
                    const isActive = activeSection === section;
                    return (
                      <button
                        key={section}
                        onClick={() => scrollToSection(section)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors min-h-[44px]",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{sectionData[section].title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Estimate - Always visible */}
                <div className="pt-6 border-t border-border">
                  <LiveEstimate />
                </div>
              </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 space-y-16 sm:space-y-20 md:space-y-24 pb-16 sm:pb-20 md:pb-24 lg:pb-0">
              {/* Corporate Section */}
              <div ref={corporateRef} id="corporate" className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
                <div className="lg:hidden mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <h2 className="text-lg sm:text-xl font-semibold">Corporate services</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Set up or change the company without leaving legal and documentary loose ends.
                  </p>
                </div>
                <CorporateServicesContent />
              </div>

              {/* Accounting Section */}
              <div ref={accountingRef} id="accounting" className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
                <div className="lg:hidden mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <h2 className="text-lg sm:text-xl font-semibold">Accounting Calculator</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Expose recurring filings, records, payroll, and year-end work before committing.
                  </p>
                </div>
                <AccountingWizard />
              </div>

              {/* Consulting Section */}
              <div ref={consultingRef} id="consulting" className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
                <div className="lg:hidden mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <h2 className="text-lg sm:text-xl font-semibold">Business consulting</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Pressure-test the business decision, not a generic consulting package.
                  </p>
                </div>
                <ConsultingServices />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Floating Estimate Button */}
      <MobileEstimateSheet />
    </Layout>
  );
}
