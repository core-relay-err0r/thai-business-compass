import { useState } from "react";
import { useServices } from "@/contexts/ServiceContext";
import { formatUSD, formatPrice, USD_TO_THB } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type DetailCategory = "corporate" | "accounting" | "consulting" | null;

export function LiveEstimate() {
  const { 
    selectedCorporateServices, 
    selectedConsultingServices, 
    liveAccountingResult,
    clearAll
  } = useServices();

  const [detailOpen, setDetailOpen] = useState<DetailCategory>(null);

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
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex-shrink-0 mb-4">
        Live Estimate
      </h3>

      {/* Category summaries */}
      <div className="space-y-2 flex-1">
        {/* Corporate Services */}
        {selectedCorporateServices.length > 0 && (
          <button
            onClick={() => setDetailOpen("corporate")}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-left"
          >
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Corporate
              </div>
              <div className="text-sm font-semibold mt-0.5">
                {formatUSD(corporateTotal)}
                <span className="text-xs text-muted-foreground font-normal ml-2">
                  {selectedCorporateServices.length} item{selectedCorporateServices.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* Accounting */}
        {liveAccountingResult && (
          <button
            onClick={() => setDetailOpen("accounting")}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-left"
          >
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Accounting
              </div>
              <div className="text-sm font-semibold mt-0.5">
                {formatUSD(liveAccountingResult.totalAnnual)}
                <span className="text-xs text-muted-foreground font-normal">/yr</span>
                {liveAccountingResult.potentialAnnual.length > 0 && (
                  <span className="text-xs text-muted-foreground font-normal ml-1">
                    (up to {formatUSD(liveAccountingResult.totalAnnualMax)})
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* Consulting */}
        {selectedConsultingServices.length > 0 && (
          <button
            onClick={() => setDetailOpen("consulting")}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-left"
          >
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Consulting
              </div>
              <div className="text-sm font-semibold mt-0.5">
                {formatUSD(consultingMin)}–{formatPrice(consultingMax)}
                <span className="text-xs text-muted-foreground font-normal ml-2">
                  {selectedConsultingServices.length} item{selectedConsultingServices.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Clear all button */}
      <div className="pt-4 border-t border-border mt-auto flex-shrink-0">
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full text-muted-foreground"
          onClick={clearAll}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear all
        </Button>
      </div>

      {/* Detail Dialogs */}
      <Dialog open={detailOpen === "corporate"} onOpenChange={(open) => !open && setDetailOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Corporate Services</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 pr-2">
              {selectedCorporateServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0">
                  <span className="text-foreground">{service.name}</span>
                  <span className="font-medium">{formatUSD(service.price)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-3 border-t border-border">
                <span className="font-semibold">Total</span>
                <div className="text-right">
                  <div className="font-semibold">{formatUSD(corporateTotal)}</div>
                  <div className="text-xs text-muted-foreground">
                    ≈ ฿{formatPrice(corporateTotal * USD_TO_THB)}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen === "accounting"} onOpenChange={(open) => !open && setDetailOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Accounting Services</DialogTitle>
          </DialogHeader>
          {liveAccountingResult && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-2">
                {/* Monthly breakdown */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Monthly Services
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base bookkeeping</span>
                    <span className="font-medium">{formatUSD(liveAccountingResult.monthlyBase)}</span>
                  </div>
                  {liveAccountingResult.monthlyAddons.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium">{formatUSD(item.amount)}</span>
                    </div>
                  ))}
                  {liveAccountingResult.potentialMonthly.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <div className="text-xs text-muted-foreground italic">Potential add-ons:</div>
                      {liveAccountingResult.potentialMonthly.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                          <span>{item.name}</span>
                          <span>+{formatUSD(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Annual breakdown */}
                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Annual Services
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Year-end base</span>
                    <span className="font-medium">{formatUSD(liveAccountingResult.annualBase)}</span>
                  </div>
                  {liveAccountingResult.annualAddons.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium">{formatUSD(item.amount)}</span>
                    </div>
                  ))}
                  {liveAccountingResult.potentialAnnual.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <div className="text-xs text-muted-foreground italic">Potential add-ons:</div>
                      {liveAccountingResult.potentialAnnual.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                          <span>{item.name}</span>
                          <span>+{formatUSD(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Monthly</span>
                    <span className="font-semibold">
                      {formatUSD(liveAccountingResult.totalMonthly)}
                      {liveAccountingResult.potentialMonthly.length > 0 && (
                        <span className="text-muted-foreground font-normal">
                          –{formatPrice(liveAccountingResult.totalMonthlyMax)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Annual total</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatUSD(liveAccountingResult.totalAnnual)}
                        {liveAccountingResult.potentialAnnual.length > 0 && (
                          <span className="text-muted-foreground font-normal">
                            –{formatPrice(liveAccountingResult.totalAnnualMax)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ≈ ฿{formatPrice(liveAccountingResult.totalAnnual * USD_TO_THB)}/yr
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen === "consulting"} onOpenChange={(open) => !open && setDetailOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Consulting Services</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 pr-2">
              {selectedConsultingServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0">
                  <span className="text-foreground">{service.name}</span>
                  <span className="font-medium">
                    {formatUSD(service.priceRange.min)}–{formatPrice(service.priceRange.max)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-3 border-t border-border">
                <span className="font-semibold">Total Range</span>
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
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
