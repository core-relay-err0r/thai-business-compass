import { useServices } from "@/contexts/ServiceContext";
import { formatUSD, formatPrice, USD_TO_THB } from "@/lib/pricing";

export function LiveEstimate() {
  const { liveAccountingResult } = useServices();

  if (!liveAccountingResult) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Live Estimate</h3>
        <p className="text-sm text-muted-foreground">
          Complete the steps to see your estimate.
        </p>
      </div>
    );
  }

  const result = liveAccountingResult;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Live Estimate</h3>
      
      <div>
        <div className="text-sm text-muted-foreground mb-1">Monthly</div>
        <div className="text-2xl font-bold">
          {formatUSD(result.totalMonthly)}
          {result.potentialMonthly.length > 0 && (
            <span className="text-lg font-normal text-muted-foreground">
              –{formatPrice(result.totalMonthlyMax)}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          ≈ ฿{formatPrice(result.totalMonthly * USD_TO_THB)}
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground mb-1">Annual (incl. year-end)</div>
        <div className="text-2xl font-bold">
          {formatUSD(result.totalAnnual)}
          {result.potentialAnnual.length > 0 && (
            <span className="text-lg font-normal text-muted-foreground">
              –{formatPrice(result.totalAnnualMax)}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          ≈ ฿{formatPrice(result.totalAnnual * USD_TO_THB)}
        </div>
      </div>

      <div className="pt-4 border-t border-border space-y-2">
        <div className="text-sm font-medium">Included:</div>
        <div className="text-sm text-muted-foreground">Base accounting</div>
        {result.monthlyAddons.map((addon) => (
          <div key={addon.name} className="text-sm text-muted-foreground">
            + {addon.name}
          </div>
        ))}
        {result.annualAddons.map((addon) => (
          <div key={addon.name} className="text-sm text-muted-foreground">
            + {addon.name}
          </div>
        ))}
      </div>

      {(result.potentialMonthly.length > 0 || result.potentialAnnual.length > 0) && (
        <div className="pt-4 border-t border-border space-y-2">
          <div className="text-sm font-medium text-amber-600">Potential (if needed):</div>
          {result.potentialMonthly.map((p) => (
            <div key={p.name} className="text-sm text-muted-foreground">
              {p.name}: +{formatUSD(p.amount)}/mo
            </div>
          ))}
          {result.potentialAnnual.map((p) => (
            <div key={p.name} className="text-sm text-muted-foreground">
              {p.name}: +{formatUSD(p.amount)}/yr
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
