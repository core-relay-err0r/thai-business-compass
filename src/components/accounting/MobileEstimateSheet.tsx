import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/contexts/ServiceContext";
import { formatUSD } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, ChevronUp, Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileEstimateSheet() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { 
    selectedCorporateServices, 
    selectedConsultingServices, 
    liveAccountingResult,
    clearAll
  } = useServices();

  // Calculate totals
  const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
  const consultingTotal = selectedConsultingServices.reduce((sum, s) => sum + s.price, 0);
  const hasFromConsulting = selectedConsultingServices.some((s) => s.isFrom);

  const hasAnything = 
    selectedCorporateServices.length > 0 || 
    selectedConsultingServices.length > 0 || 
    liveAccountingResult;

  const itemCount = 
    selectedCorporateServices.length + 
    selectedConsultingServices.length + 
    (liveAccountingResult ? 1 : 0);

  const grandTotal = corporateTotal + (liveAccountingResult?.totalAnnual || 0) + consultingTotal;

  if (!hasAnything) {
    return null;
  }

  const handleProceed = () => {
    setOpen(false);
    navigate("/submit");
  };

  const handleClearAll = () => {
    clearAll();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "fixed bottom-4 left-4 right-4 z-50 lg:hidden",
            "flex items-center justify-between",
            "bg-primary text-primary-foreground",
            "px-4 py-3 rounded-xl shadow-lg",
            "transition-all active:scale-[0.98]"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-background text-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <span className="font-medium">View estimate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {liveAccountingResult?.isCustomQuote ? "Quote required" : formatUSD(grandTotal)}
            </span>
            <ChevronUp className="w-4 h-4" />
          </div>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl px-4 pb-8">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-left">Your estimate</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Corporate Section */}
          {selectedCorporateServices.length > 0 && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Corporate services
              </div>
              <div className="space-y-2">
                {selectedCorporateServices.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{service.name}</span>
                    <span className="font-medium">{formatUSD(service.price)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-border/50">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="font-semibold">{formatUSD(corporateTotal)}</span>
              </div>
            </div>
          )}

          {/* Accounting Section */}
          {liveAccountingResult && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Accounting
              </div>
              {liveAccountingResult.isCustomQuote ? (
                <div className="rounded-lg bg-primary/5 p-3">
                  <div className="font-semibold text-primary">Custom quote required</div>
                  <p className="mt-1 text-xs text-muted-foreground">We will confirm the accounting price after reviewing the scope.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {liveAccountingResult.monthlyBase > 0 ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base accounting</span>
                      <span className="font-medium">{formatUSD(liveAccountingResult.monthlyBase)}/month</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly recurring</span>
                      <span className="font-medium">None</span>
                    </div>
                  )}
                  {liveAccountingResult.monthlyAddons.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium">+{formatUSD(item.amount)}/month</span>
                    </div>
                  ))}
                  {liveAccountingResult.rushFee && liveAccountingResult.rushSurcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600">Rush surcharge (+30%)</span>
                      <span className="font-medium text-amber-600">+{formatUSD(liveAccountingResult.rushSurcharge)}/month</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 mt-1 border-t border-border/50 text-sm">
                    <span className="font-medium">Monthly total</span>
                    <span className="font-semibold">{formatUSD(liveAccountingResult.totalMonthly)}/month</span>
                  </div>
                </div>
              )}

              {liveAccountingResult.annualAddons.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Billed annually when due
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Known fees are shown separately from any custom quote.
                  </div>
                  <div className="space-y-2">
                    {liveAccountingResult.annualAddons.map((item, idx) => (
                      <div key={idx} className="flex justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-medium text-right">
                          {item.amount === 0 ? "Custom quote" : `${item.isFrom ? "From " : ""}${formatUSD(item.amount)}/year`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-3 pt-2 mt-2 border-t border-border/50">
                <span className="text-sm font-medium">
                  {liveAccountingResult.isCustomQuote ? "Known first-year fees" : "First-year accounting"}
                </span>
                <span className="font-semibold text-right">
                  {liveAccountingResult.isCustomQuote
                    ? liveAccountingResult.annualAddons.some((item) => item.amount > 0)
                      ? formatUSD(liveAccountingResult.annualAddons.reduce((sum, item) => sum + item.amount, 0))
                      : "Quote required"
                    : `${liveAccountingResult.annualAddons.some((item) => item.isFrom) ? "From " : ""}${formatUSD(liveAccountingResult.totalAnnual)}`}
                </span>
              </div>
            </div>
          )}

          {/* Consulting Section */}
          {selectedConsultingServices.length > 0 && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Business consulting
              </div>
              <div className="space-y-2">
                {selectedConsultingServices.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{service.name}</span>
                    <span className="font-medium">
                      {service.isFrom ? "From " : ""}{formatUSD(service.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-border/50">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="font-semibold">
                  {hasFromConsulting ? "From " : ""}{formatUSD(consultingTotal)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border space-y-4">
          {/* Grand Total */}
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-muted-foreground">Estimated Total</div>
              {liveAccountingResult?.isCustomQuote ? (
                <div className="text-2xl font-bold text-primary">Quote required</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {hasFromConsulting || liveAccountingResult?.annualAddons.some((a) => a.isFrom) ? "From " : ""}{formatUSD(grandTotal)}
                  </div>

                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-destructive hover:bg-transparent"
              onClick={handleClearAll}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button className="flex-1" onClick={handleProceed}>
              Proceed to request
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
