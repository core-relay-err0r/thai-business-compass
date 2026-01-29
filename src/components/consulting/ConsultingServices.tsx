import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Globe, Search, GitBranch, Building, Check, ArrowRight, ShoppingCart, Clock } from "lucide-react";
import { useServices } from "@/contexts/ServiceContext";
import { CONSULTING_PRICING, formatPrice } from "@/lib/pricing";
const SERVICES = [{
  id: "reduce-costs",
  icon: TrendingDown,
  title: "Reduce Costs",
  priceRange: CONSULTING_PRICING.REDUCE_COSTS,
  description: "Identify opportunities to reduce operational and tax costs."
}, {
  id: "new-market",
  icon: Globe,
  title: "Enter a New Market",
  priceRange: CONSULTING_PRICING.NEW_MARKET,
  description: "Evaluate and plan market entry strategy for Thailand or ASEAN."
}, {
  id: "due-diligence",
  icon: Search,
  title: "Due Diligence / Risk Check",
  priceRange: CONSULTING_PRICING.DUE_DILIGENCE,
  description: "Comprehensive review of a target company or potential partner."
}, {
  id: "structure-strategy",
  icon: GitBranch,
  title: "Business Structure Strategy",
  priceRange: CONSULTING_PRICING.STRUCTURE_STRATEGY,
  description: "Optimize your corporate structure for growth, tax, or liability."
}, {
  id: "bank-compliance",
  icon: Building,
  title: "Bank & Compliance Readiness",
  priceRange: CONSULTING_PRICING.BANK_COMPLIANCE,
  description: "Prepare for bank account opening or compliance requirements."
}];
export function ConsultingServices() {
  const navigate = useNavigate();
  const {
    selectedConsultingServices,
    addConsultingService,
    removeConsultingService
  } = useServices();
  const isSelected = (id: string) => selectedConsultingServices.some(s => s.id === id);
  const toggleService = (service: (typeof SERVICES)[0]) => {
    if (isSelected(service.id)) {
      removeConsultingService(service.id);
    } else {
      addConsultingService({
        id: service.id,
        name: service.title,
        priceRange: {
          min: service.priceRange.min,
          max: service.priceRange.max
        },
        timeline: service.priceRange.timeline
      });
    }
  };
  return <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map(service => {
        const Icon = service.icon;
        const selected = isSelected(service.id);
        return <Card key={service.id} className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selected ? "border-primary/50 bg-primary/[0.02] shadow-sm" : "hover:border-border/80"}`} onClick={() => toggleService(service)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {selected && <Badge variant="secondary" className="text-xs font-medium">
                      Added
                    </Badge>}
                </div>
                <CardTitle className="text-lg mt-4">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tracking-tight">
                      ${formatPrice(service.priceRange.min)}–${formatPrice(service.priceRange.max)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70">
                    ≈ ฿{formatPrice(service.priceRange.minTHB)}–฿{formatPrice(service.priceRange.maxTHB)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {service.priceRange.timeline}
                </div>

                <Button variant={selected ? "secondary" : "outline"} className={`w-full transition-all ${selected ? "border-primary/20" : ""}`} onClick={e => {
              e.stopPropagation();
              toggleService(service);
            }}>
                  {selected ? <>
                      <Check className="mr-2 h-4 w-4" />
                      Added to request
                    </> : "Add to request"}
                </Button>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Selection summary */}
      {selectedConsultingServices.length > 0}
    </>;
}