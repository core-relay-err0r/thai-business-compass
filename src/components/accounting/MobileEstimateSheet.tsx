import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/contexts/ServiceContext";
import { formatUSD, formatPrice, USD_TO_THB } from "@/lib/pricing";
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
            <span className="font-medium">View Estimate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatUSD(grandTotal)}</span>
            <ChevronUp className="w-4 h-4" />
          </div>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl px-4 pb-8">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-left">Your Estimate</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Corporate Section */}
          {selectedCorporateServices.length > 0 && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Corporate Services
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
                Accounting Services
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base accounting</span>
                  <span className="font-medium">{formatUSD(liveAccountingResult.monthlyBase)}/mo</span>
                </div>
                {liveAccountingResult.monthlyAddons.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">+{formatUSD(item.amount)}/mo</span>
                  </div>
                ))}
                {liveAccountingResult.annualAddons.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{formatUSD(item.amount)}/yr</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-border/50">
                <span className="text-sm font-medium">Annual Total</span>
                <span className="font-semibold">
                  {liveAccountingResult.annualAddons.some(a => a.isFrom) ? "From " : ""}{formatUSD(liveAccountingResult.totalAnnual)}/yr
                </span>
              </div>
            </div>
          )}

          {/* Consulting Section */}
          {selectedConsultingServices.length > 0 && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Consulting Services
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
              <div className="text-2xl font-bold">{formatUSD(grandTotal)}</div>
              <div className="text-xs text-muted-foreground">
                ≈ ฿{formatPrice(grandTotal * USD_TO_THB)}
              </div>
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
