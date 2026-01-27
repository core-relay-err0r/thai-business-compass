import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingDown, Globe, Search, GitBranch, Building, Check, X, ArrowRight, ShoppingCart, Clock } from "lucide-react";
import { useServices, ConsultingService } from "@/contexts/ServiceContext";
import { CONSULTING_PRICING, formatPrice } from "@/lib/pricing";

const SERVICES = [
  {
    id: "reduce-costs",
    icon: TrendingDown,
    title: "Reduce Costs",
    priceRange: CONSULTING_PRICING.REDUCE_COSTS,
    description: "Identify opportunities to reduce operational and tax costs.",
    deliverables: [
      "Cost structure analysis",
      "Tax optimization recommendations",
      "Expense benchmarking report",
      "Actionable savings roadmap",
    ],
  },
  {
    id: "new-market",
    icon: Globe,
    title: "Enter a New Market",
    priceRange: CONSULTING_PRICING.NEW_MARKET,
    description: "Evaluate and plan market entry strategy for Thailand or ASEAN.",
    deliverables: [
      "Market feasibility assessment",
      "Competitor landscape analysis",
      "Entry strategy options",
      "Regulatory requirements summary",
      "Implementation timeline",
    ],
  },
  {
    id: "due-diligence",
    icon: Search,
    title: "Due Diligence / Risk Check",
    priceRange: CONSULTING_PRICING.DUE_DILIGENCE,
    description: "Comprehensive review of a target company or potential partner.",
    deliverables: [
      "Corporate structure verification",
      "Financial health assessment",
      "Legal compliance check",
      "Risk summary report",
      "Red flags identification",
    ],
  },
  {
    id: "structure-strategy",
    icon: GitBranch,
    title: "Business Structure Strategy",
    priceRange: CONSULTING_PRICING.STRUCTURE_STRATEGY,
    description: "Optimize your corporate structure for growth, tax, or liability.",
    deliverables: [
      "Current structure analysis",
      "Alternative structure options",
      "Tax implications comparison",
      "Restructuring roadmap",
    ],
  },
  {
    id: "bank-compliance",
    icon: Building,
    title: "Bank & Compliance Readiness",
    priceRange: CONSULTING_PRICING.BANK_COMPLIANCE,
    description: "Prepare for bank account opening or compliance requirements.",
    deliverables: [
      "Document preparation checklist",
      "Compliance gap analysis",
      "Bank requirement alignment",
      "Application support guidance",
    ],
  },
];

export function ConsultingServices() {
  const navigate = useNavigate();
  const { selectedConsultingServices, addConsultingService, removeConsultingService } = useServices();
  const [selectedService, setSelectedService] = useState<(typeof SERVICES)[0] | null>(null);

  const isSelected = (id: string) => selectedConsultingServices.some((s) => s.id === id);

  const toggleService = (service: (typeof SERVICES)[0]) => {
    if (isSelected(service.id)) {
      removeConsultingService(service.id);
    } else {
      addConsultingService({
        id: service.id,
        name: service.title,
        priceRange: service.priceRange,
        timeline: service.priceRange.timeline,
      });
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const selected = isSelected(service.id);
          
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedService(service)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {selected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg mt-4">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">
                      ฿{formatPrice(service.priceRange.min)}–{formatPrice(service.priceRange.max)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.priceRange.timeline}
                  </div>
                </div>
                <Button
                  variant={selected ? "secondary" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleService(service);
                  }}
                >
                  {selected ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added
                    </>
                  ) : (
                    "Add to request"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection summary */}
      {selectedConsultingServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg md:relative md:mt-8 md:border md:rounded-lg md:shadow-none">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{selectedConsultingServices.length} problem(s) selected</span>
            </div>
            <Button onClick={() => navigate("/submit")}>
              Continue to submit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-lg">
          {selectedService && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <selectedService.icon className="h-5 w-5 text-primary" />
                  </div>
                  <DialogTitle>{selectedService.title}</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <p className="text-muted-foreground">{selectedService.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">What you will get</h4>
                  <ul className="space-y-2">
                    {selectedService.deliverables.map((item) => (
                      <li key={item} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Price range</div>
                    <div className="font-bold">
                      ฿{formatPrice(selectedService.priceRange.min)}–{formatPrice(selectedService.priceRange.max)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Timeline</div>
                    <div className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedService.priceRange.timeline}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button
                    onClick={() => {
                      toggleService(selectedService);
                      setSelectedService(null);
                    }}
                  >
                    {isSelected(selectedService.id) ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Add to request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
