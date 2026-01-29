import { useState } from "react";
import { useServices } from "@/contexts/ServiceContext";
import { formatUSD, formatPrice, USD_TO_THB } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DetailType = "corporate" | "accounting" | "consulting" | null;

export function LiveEstimate() {
  const navigate = useNavigate();
  const [openDetail, setOpenDetail] = useState<DetailType>(null);
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
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Live Estimate
        </h3>
        <p className="text-sm text-muted-foreground">
          Select services to see your estimate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Live Estimate
      </h3>

      {/* Corporate Summary Card */}
      {selectedCorporateServices.length > 0 && (
        <button
          onClick={() => setOpenDetail("corporate")}
          className="w-full text-left p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Corporate
              </div>
              <div className="text-lg font-semibold">{formatUSD(corporateTotal)}</div>
              <div className="text-xs text-muted-foreground">
                {selectedCorporateServices.length} service{selectedCorporateServices.length !== 1 ? "s" : ""} • One-time
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      )}

      {/* Accounting Summary Card */}
      {liveAccountingResult && (
        <button
          onClick={() => setOpenDetail("accounting")}
          className="w-full text-left p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Accounting
              </div>
              <div className="text-lg font-semibold">
                {formatUSD(liveAccountingResult.totalMonthly)}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatUSD(liveAccountingResult.totalAnnual)}/yr • Recurring
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      )}

      {/* Consulting Summary Card */}
      {selectedConsultingServices.length > 0 && (
        <button
          onClick={() => setOpenDetail("consulting")}
          className="w-full text-left p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Consulting
              </div>
              <div className="text-lg font-semibold">
                {formatUSD(consultingMin)}–{formatPrice(consultingMax)}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedConsultingServices.length} task{selectedConsultingServices.length !== 1 ? "s" : ""} • Estimate range
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      )}

      {/* Sticky CTA Section */}
      <div className="pt-4 border-t border-border space-y-2">
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
          className="w-full text-muted-foreground hover:text-destructive"
          onClick={clearAll}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear all
        </Button>
      </div>

      {/* Corporate Details Dialog */}
      <Dialog open={openDetail === "corporate"} onOpenChange={(open) => !open && setOpenDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Corporate Services</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedCorporateServices.map((service) => (
              <div key={service.id} className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">{service.name}</span>
                <span className="font-medium">{formatUSD(service.price)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-medium">Total</span>
              <div className="text-right">
                <div className="font-semibold">{formatUSD(corporateTotal)}</div>
                <div className="text-xs text-muted-foreground">
                  ≈ ฿{formatPrice(corporateTotal * USD_TO_THB)}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Accounting Details Dialog */}
      <Dialog open={openDetail === "accounting"} onOpenChange={(open) => !open && setOpenDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accounting Services</DialogTitle>
          </DialogHeader>
          {liveAccountingResult && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Monthly
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">Base accounting</span>
                  <span className="font-medium">{formatUSD(liveAccountingResult.monthlyBase)}</span>
                </div>
                {liveAccountingResult.monthlyAddons.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">+{formatUSD(item.amount)}</span>
                  </div>
                ))}
              </div>

              {liveAccountingResult.potentialMonthly.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Potential Add-ons (Monthly)
                  </div>
                  {liveAccountingResult.potentialMonthly.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium">+{formatUSD(item.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              {liveAccountingResult.annualAddons.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Annual Fees
                  </div>
                  {liveAccountingResult.annualAddons.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium">{formatUSD(item.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              {liveAccountingResult.potentialAnnual.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Potential Add-ons (Annual)
                  </div>
                  {liveAccountingResult.potentialAnnual.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium">+{formatUSD(item.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-medium">Totals</span>
                <div className="text-right space-y-1">
                  <div>
                    <span className="font-semibold">{formatUSD(liveAccountingResult.totalMonthly)}</span>
                    {liveAccountingResult.potentialMonthly.length > 0 && (
                      <span className="text-muted-foreground">–{formatPrice(liveAccountingResult.totalMonthlyMax)}</span>
                    )}
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  <div>
                    <span className="font-semibold">{formatUSD(liveAccountingResult.totalAnnual)}</span>
                    {liveAccountingResult.potentialAnnual.length > 0 && (
                      <span className="text-muted-foreground">–{formatPrice(liveAccountingResult.totalAnnualMax)}</span>
                    )}
                    <span className="text-muted-foreground text-sm">/yr</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ≈ ฿{formatPrice(liveAccountingResult.totalAnnual * USD_TO_THB)}/yr
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Consulting Details Dialog */}
      <Dialog open={openDetail === "consulting"} onOpenChange={(open) => !open && setOpenDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consulting Services</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedConsultingServices.map((service) => (
              <div key={service.id} className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">{service.name}</span>
                <span className="font-medium">
                  {formatUSD(service.priceRange.min)}–{formatPrice(service.priceRange.max)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-medium">Total Range</span>
              <div className="text-right">
                <div className="font-semibold">
                  {formatUSD(consultingMin)}–{formatPrice(consultingMax)}
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ ฿{formatPrice(consultingMin * USD_TO_THB)}–{formatPrice(consultingMax * USD_TO_THB)}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
