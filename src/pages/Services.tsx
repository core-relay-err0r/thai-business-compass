import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CorporateServicesContent } from "@/components/corporate/CorporateServices";
import { AccountingWizard } from "@/components/accounting/AccountingWizard";
import { ConsultingServices } from "@/components/consulting/ConsultingServices";
import { Building2, Calculator, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveSection = "corporate" | "accounting" | "consulting";

const sectionData = {
  corporate: {
    icon: Building2,
    title: "Corporate Services",
    description: "One-time corporate actions for starting or managing a Thai company.",
  },
  accounting: {
    icon: Calculator,
    title: "Accounting Calculator",
    description: "Understand your accounting setup before committing.",
  },
  consulting: {
    icon: MessageSquare,
    title: "Business Consulting",
    description: "Choose the business question, not a consulting package.",
  },
};

export default function Services() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("corporate");
  
  const corporateRef = useRef<HTMLDivElement>(null);
  const accountingRef = useRef<HTMLDivElement>(null);
  const consultingRef = useRef<HTMLDivElement>(null);

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
      {/* Section Head Block */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to operate in Thailand.
            </h1>
            <p className="text-lg text-muted-foreground">
              Corporate setup, accounting, and strategic consulting — all in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex gap-12 max-w-7xl mx-auto">
            {/* Sticky Sidebar - Desktop Only */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-32 space-y-8">
                {/* Current Section Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <SectionIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">{currentSection.title}</h2>
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
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
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
              </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 space-y-24 pb-24 lg:pb-0">
              {/* Corporate Section */}
              <div ref={corporateRef} id="corporate" className="scroll-mt-32">
                <div className="lg:hidden mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Corporate Services</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    One-time corporate actions for starting or managing a Thai company.
                  </p>
                </div>
                <CorporateServicesContent />
              </div>

              {/* Accounting Section */}
              <div ref={accountingRef} id="accounting" className="scroll-mt-32">
                <div className="lg:hidden mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Accounting Calculator</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Understand your accounting setup before committing.
                  </p>
                </div>
                <AccountingWizard />
              </div>

              {/* Consulting Section */}
              <div ref={consultingRef} id="consulting" className="scroll-mt-32">
                <div className="lg:hidden mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Business Consulting</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Choose the business question, not a consulting package.
                  </p>
                </div>
                <ConsultingServices />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
