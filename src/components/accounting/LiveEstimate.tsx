import { useNavigate } from "react-router-dom";
import { useServices } from "@/contexts/ServiceContext";
import { formatUSD, formatPrice, USD_TO_THB } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Trash2 } from "lucide-react";

export function LiveEstimate() {
  const navigate = useNavigate();
  const { 
    selectedCorporateServices, 
    selectedConsultingServices, 
    liveAccountingResult,
    clearAll
  } = useServices();

  // Calculate totals
  const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
  
  const consultingMin = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.min, 0);
  const consultingMax = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.max, 0);

  const hasAnything = 
    selectedCorporateServices.length > 0 || 
    selectedConsultingServices.length > 0 || 
    liveAccountingResult;

  if (!hasAnything) {
    return (
      <div className="h-full flex flex-col">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Live Estimate
        </h3>
        <p className="text-sm text-muted-foreground mt-4">
          Select services to see your estimate.
        </p>
      </div>
    );
  }

  // Calculate one-time total for display
  const oneTimeTotal = corporateTotal;

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex-shrink-0 mb-4">
        Live Estimate
      </h3>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 min-h-0 max-h-[400px]">
        <div className="space-y-6 pr-3">
          {/* One-time (Corporate) */}
          {selectedCorporateServices.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                One-time
              </div>
              {selectedCorporateServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">{service.name}</span>
                  <span className="font-medium">{formatUSD(service.price)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">{formatUSD(corporateTotal)}</span>
              </div>
              <div className="text-xs text-muted-foreground/60">
                ≈ ฿{formatPrice(corporateTotal * USD_TO_THB)}
              </div>
            </div>
          )}

          {/* Recurring (Accounting) */}
          {liveAccountingResult && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recurring
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly</span>
                <span className="font-medium">
                  {formatUSD(liveAccountingResult.totalMonthly)}
                  {liveAccountingResult.potentialMonthly.length > 0 && (
                    <span className="text-muted-foreground font-normal">
                      –{formatPrice(liveAccountingResult.totalMonthlyMax)}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Annual (incl. year-end)</span>
                <span className="font-medium">
                  {formatUSD(liveAccountingResult.totalAnnual)}
                  {liveAccountingResult.potentialAnnual.length > 0 && (
                    <span className="text-muted-foreground font-normal">
                      –{formatPrice(liveAccountingResult.totalAnnualMax)}
                    </span>
                  )}
                </span>
              </div>
              <div className="text-xs text-muted-foreground/60">
                ≈ ฿{formatPrice(liveAccountingResult.totalAnnual * USD_TO_THB)}/yr
              </div>
            </div>
          )}

          {/* Consulting (Ranges) */}
          {selectedConsultingServices.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Consulting
              </div>
              {selectedConsultingServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">{service.name}</span>
                  <span className="font-medium">
                    {formatUSD(service.priceRange.min)}–{formatPrice(service.priceRange.max)}
                  </span>
                </div>
              ))}
              {selectedConsultingServices.length > 1 && (
                <>
                  <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                    <span className="font-medium">Range</span>
                    <span className="font-semibold">
                      {formatUSD(consultingMin)}–{formatPrice(consultingMax)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground/60">
                    ≈ ฿{formatPrice(consultingMin * USD_TO_THB)}–{formatPrice(consultingMax * USD_TO_THB)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Sticky CTA Section */}
      <div className="pt-4 border-t border-border space-y-3 mt-auto flex-shrink-0">
        <Button 
          className="w-full" 
          onClick={() => navigate("/submit")}
        >
          Proceed to request
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full text-muted-foreground hover:bg-transparent hover:text-destructive [&:hover_svg]:text-destructive"
          onClick={clearAll}
        >
          <Trash2 className="w-3 h-3 mr-1 transition-colors" />
          Clear all
        </Button>
      </div>
    </div>
  );
}
