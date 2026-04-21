import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Globe, Search, GitBranch, Building, Check, ArrowRight, ShoppingCart, Clock } from "lucide-react";
import { useServices } from "@/contexts/ServiceContext";
import { CONSULTING_PRICING, formatPrice, USD_TO_THB } from "@/lib/pricing";

const SERVICES = [
  {
    id: "reduce-costs",
    icon: TrendingDown,
    title: "Reduce Costs",
    pricing: CONSULTING_PRICING.REDUCE_COSTS,
    description: "Identify opportunities to reduce operational and tax costs.",
  },
  {
    id: "new-market",
    icon: Globe,
    title: "Enter a New Market",
    pricing: CONSULTING_PRICING.NEW_MARKET,
    description: "Evaluate and plan market entry strategy for Thailand or ASEAN.",
  },
  {
    id: "due-diligence",
    icon: Search,
    title: "Due Diligence / Risk Check",
    pricing: CONSULTING_PRICING.DUE_DILIGENCE,
    description: "Comprehensive review of a target company or potential partner.",
  },
  {
    id: "structure-strategy",
    icon: GitBranch,
    title: "Business Structure Strategy",
    pricing: CONSULTING_PRICING.STRUCTURE_STRATEGY,
    description: "Optimize your corporate structure for growth, tax, or liability.",
  },
  {
    id: "bank-compliance",
    icon: Building,
    title: "Bank & Compliance Readiness",
    pricing: CONSULTING_PRICING.BANK_COMPLIANCE,
    description: "Prepare for bank account opening or compliance requirements.",
  },
];

export function ConsultingServices() {
  const navigate = useNavigate();
  const { selectedConsultingServices, addConsultingService, removeConsultingService } = useServices();

  const isSelected = (id: string) => selectedConsultingServices.some((s) => s.id === id);

  const toggleService = (service: (typeof SERVICES)[0]) => {
    if (isSelected(service.id)) {
      removeConsultingService(service.id);
    } else {
      addConsultingService({
        id: service.id,
        name: service.title,
        price: service.pricing.price,
        isFrom: service.pricing.isFrom,
        timeline: service.pricing.timeline,
        note: "note" in service.pricing ? (service.pricing as any).note : undefined,
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const selected = isSelected(service.id);
          
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selected 
                  ? "border-2 border-green-400 bg-green-50/50 shadow-sm" 
                  : "hover:border-border/80"
              }`}
              onClick={() => toggleService(service)}
            >
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  {selected && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      Added
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base sm:text-lg mt-3 sm:mt-4">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-semibold tracking-tight">
                      {service.pricing.isFrom ? "From " : ""}${formatPrice(service.pricing.price)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70">
                    ≈ {service.pricing.isFrom ? "From " : ""}฿{formatPrice(service.pricing.price * USD_TO_THB)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {service.pricing.timeline}
                </div>

                {"note" in service.pricing && (
                  <p className="text-xs text-muted-foreground/70 italic">
                    {(service.pricing as any).note}
                  </p>
                )}

                <Button
                  variant={selected ? "secondary" : "outline"}
                  className={`w-full transition-all min-h-[44px] ${selected ? "border-primary/20" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleService(service);
                  }}
                >
                  {selected ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added to request
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

    </>
  );
}
