import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/contexts/ServiceContext";
import { formatUSD, formatPrice, USD_TO_THB } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trash2, ChevronLeft, ChevronRight, Building2, Calculator, Users } from "lucide-react";

type PageType = "corporate" | "accounting" | "consulting";

const pages: { id: PageType; label: string; icon: React.ElementType }[] = [
  { id: "corporate", label: "Corporate", icon: Building2 },
  { id: "accounting", label: "Accounting", icon: Calculator },
  { id: "consulting", label: "Consulting", icon: Users },
];

export function LiveEstimate() {
  const navigate = useNavigate();
  const { 
    selectedCorporateServices, 
    selectedConsultingServices, 
    liveAccountingResult,
    clearAll
  } = useServices();

  const [currentPage, setCurrentPage] = useState<PageType>("corporate");

  // Calculate totals
  const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
  const consultingMin = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.min, 0);
  const consultingMax = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.max, 0);

  // Check which pages have content
  const hasCorporate = selectedCorporateServices.length > 0;
  const hasAccounting = !!liveAccountingResult;
  const hasConsulting = selectedConsultingServices.length > 0;

  const hasAnything = hasCorporate || hasAccounting || hasConsulting;

  // Auto-navigate to first page with content
  useEffect(() => {
    if (!hasAnything) return;
    
    const pageHasContent = {
      corporate: hasCorporate,
      accounting: hasAccounting,
      consulting: hasConsulting,
    };

    if (!pageHasContent[currentPage]) {
      if (hasCorporate) setCurrentPage("corporate");
      else if (hasAccounting) setCurrentPage("accounting");
      else if (hasConsulting) setCurrentPage("consulting");
    }
  }, [hasCorporate, hasAccounting, hasConsulting, currentPage, hasAnything]);

  const currentPageIndex = pages.findIndex(p => p.id === currentPage);

  const goToPrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPage(pages[currentPageIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPage(pages[currentPageIndex + 1].id);
    }
  };

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

  const renderCorporatePage = () => (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Building2 className="w-3.5 h-3.5" />
        One-time Services
      </div>
      {selectedCorporateServices.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No corporate services selected</p>
      ) : (
        <>
          {selectedCorporateServices.map((service) => (
            <div key={service.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground truncate pr-2">{service.name}</span>
              <span className="font-medium">{formatUSD(service.price)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-3 border-t border-border/50">
            <span className="font-medium">Subtotal</span>
            <span className="font-semibold">{formatUSD(corporateTotal)}</span>
          </div>
          <div className="text-xs text-muted-foreground/60">
            ≈ ฿{formatPrice(corporateTotal * USD_TO_THB)}
          </div>
        </>
      )}
    </div>
  );

  const renderAccountingPage = () => (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Calculator className="w-3.5 h-3.5" />
        Recurring Services
      </div>
      {!liveAccountingResult ? (
        <p className="text-sm text-muted-foreground italic">No accounting package configured</p>
      ) : (
        <>
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
          <div className="text-xs text-muted-foreground/60 pt-2">
            ≈ ฿{formatPrice(liveAccountingResult.totalAnnual * USD_TO_THB)}/yr
          </div>
        </>
      )}
    </div>
  );

  const renderConsultingPage = () => (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Users className="w-3.5 h-3.5" />
        Consulting Services
      </div>
      {selectedConsultingServices.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No consulting services selected</p>
      ) : (
        <>
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
              <div className="flex justify-between text-sm pt-3 border-t border-border/50">
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
        </>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex-shrink-0 mb-4">
        Live Estimate
      </h3>

      {/* Page Navigation */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={goToPrev}
          disabled={currentPageIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          {pages.map((page, index) => {
            const hasContent = 
              (page.id === "corporate" && hasCorporate) ||
              (page.id === "accounting" && hasAccounting) ||
              (page.id === "consulting" && hasConsulting);
            
            return (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentPage === page.id 
                    ? "bg-primary w-4" 
                    : hasContent 
                      ? "bg-primary/40 hover:bg-primary/60" 
                      : "bg-muted-foreground/20"
                }`}
                title={page.label}
              />
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={goToNext}
          disabled={currentPageIndex === pages.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page Content */}
      <div className="flex-1 min-h-0">
        {currentPage === "corporate" && renderCorporatePage()}
        {currentPage === "accounting" && renderAccountingPage()}
        {currentPage === "consulting" && renderConsultingPage()}
      </div>

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
