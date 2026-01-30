import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CorporateServicesContent } from "@/components/corporate/CorporateServices";
import { AccountingWizard } from "@/components/accounting/AccountingWizard";
import { LiveEstimate } from "@/components/accounting/LiveEstimate";
import { ConsultingServices } from "@/components/consulting/ConsultingServices";
import { Building2, Calculator, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActiveSection = "corporate" | "accounting" | "consulting";

const sectionData = {
  corporate: {
    icon: Building2,
    title: "Corporate",
    description: "One-time corporate actions for starting or managing a Thai company.",
  },
  accounting: {
    icon: Calculator,
    title: "Accounting",
    description: "Understand your accounting setup before committing.",
  },
  consulting: {
    icon: MessageSquare,
    title: "Consulting",
    description: "Choose the business question, not a consulting package.",
  },
};

export default function Services() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ActiveSection>("corporate");

  // Handle hash on page load
  useEffect(() => {
    const hash = location.hash.replace("#", "") as ActiveSection;
    if (hash && ["corporate", "accounting", "consulting"].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

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
            {/* Main Content with Tabs */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveSection)}>
                <TabsList className="w-full mb-8 h-auto p-1 grid grid-cols-3">
                  {(Object.keys(sectionData) as ActiveSection[]).map((section) => {
                    const Icon = sectionData[section].icon;
                    return (
                      <TabsTrigger
                        key={section}
                        value={section}
                        className="flex items-center gap-2 py-3"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{sectionData[section].title}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {/* Section Description - Mobile */}
                <div className="lg:hidden mb-6 p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {sectionData[activeTab].description}
                  </p>
                </div>

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
            </div>

            {/* Sticky Sidebar with Live Estimate - Desktop Only */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-32 space-y-6">
                {/* Current Section Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {(() => {
                        const Icon = sectionData[activeTab].icon;
                        return <Icon className="w-5 h-5 text-primary" />;
                      })()}
                    </div>
                    <h2 className="text-lg font-semibold">{sectionData[activeTab].title}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {sectionData[activeTab].description}
                  </p>
                </div>

                {/* Live Estimate - Always visible */}
                <div className="pt-6 border-t border-border">
                  <LiveEstimate />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Live Estimate - Fixed at bottom */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40">
            <LiveEstimate />
          </div>
        </div>
      </section>
    </Layout>
  );
}
