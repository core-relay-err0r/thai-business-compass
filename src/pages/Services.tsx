import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CorporateServicesContent } from "@/components/corporate/CorporateServices";
import { AccountingWizard } from "@/components/accounting/AccountingWizard";
import { LiveEstimate } from "@/components/accounting/LiveEstimate";
import { ConsultingServices } from "@/components/consulting/ConsultingServices";
import { Building2, Calculator, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ActiveSection>("corporate");

  // Set tab based on hash on page load or hash change
  useEffect(() => {
    const hash = location.hash.replace("#", "") as ActiveSection;
    if (hash && ["corporate", "accounting", "consulting"].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const currentSection = sectionData[activeTab];
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
                    const isActive = activeTab === section;
                    return (
                      <button
                        key={section}
                        onClick={() => setActiveTab(section)}
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

                {/* Live Estimate - Always visible */}
                <div className="pt-6 border-t border-border">
                  <LiveEstimate />
                </div>
              </div>
            </div>

            {/* Main Content - Tabbed */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveSection)}>
                {/* Mobile Tab List */}
                <TabsList className="lg:hidden w-full mb-6">
                  <TabsTrigger value="corporate" className="flex-1 gap-2">
                    <Building2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Corporate</span>
                  </TabsTrigger>
                  <TabsTrigger value="accounting" className="flex-1 gap-2">
                    <Calculator className="w-4 h-4" />
                    <span className="hidden sm:inline">Accounting</span>
                  </TabsTrigger>
                  <TabsTrigger value="consulting" className="flex-1 gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Consulting</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <TabsContent value="corporate" className="mt-0">
                  <CorporateServicesContent />
                </TabsContent>

                <TabsContent value="accounting" className="mt-0">
                  <AccountingWizard />
                </TabsContent>

                <TabsContent value="consulting" className="mt-0">
                  <ConsultingServices />
                </TabsContent>
              </Tabs>

              {/* Mobile Live Estimate */}
              <div className="lg:hidden mt-8 pt-6 border-t border-border">
                <LiveEstimate />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
