import { PRICING, CORPORATE_PRICING, formatUSD, formatPrice } from "@/lib/pricing";
import { AnimatedSection } from "@/components/ui/animated-section";

export function PricingLogic() {
  return (
    <section id="pricing-logic" className="py-20">
      <AnimatedSection className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pricing Logic</h2>
            <p className="text-muted-foreground">
              Transparent, predictable pricing. Base fee + add-ons based on your setup.
            </p>
          </div>

          <div className="space-y-8">
            {/* Monthly Accounting */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Monthly Accounting</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Base bookkeeping (up to 50 txns)</span>
                  <span className="font-medium">{formatUSD(PRICING.BASE_ACCOUNTING)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ VAT reporting (PP.30)</span>
                  <span>+{formatUSD(PRICING.VAT_ADDON)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ Recurring WHT (PND3/PND53)</span>
                  <span>+{formatUSD(PRICING.RECURRING_WHT_ADDON)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ Payroll & social security (per block of 5)</span>
                  <span>+{formatUSD(PRICING.PAYROLL_BLOCK)}/block/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ Medium volume (&gt;50 txns)</span>
                  <span>+{formatUSD(PRICING.TX_MEDIUM_ADDON)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ High volume / complex scope</span>
                  <span>Custom quote</span>
                </div>
              </div>
            </div>

            {/* Annual */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Annual Services</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Year-end financial statements</span>
                  <span className="font-medium">From {formatUSD(PRICING.YEAR_END_STATEMENTS)}/year</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Catch-up / backlog work</span>
                  <span>From {formatUSD(PRICING.CATCHUP_BACKLOG)}/year</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ Annual audit (if required)</span>
                  <span>From +{formatUSD(PRICING.AUDIT_ADDON)}/year</span>
                </div>
              </div>
            </div>

            {/* Corporate */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Corporate Services (Turnkey, USD)</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Company incorporation</span>
                  <span className="font-medium">{formatUSD(CORPORATE_PRICING.INCORPORATION)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Registered office</span>
                  <span>From {formatUSD(CORPORATE_PRICING.REGISTERED_OFFICE)}/year</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Structural change (directors/shareholders)</span>
                  <span>{formatUSD(CORPORATE_PRICING.STRUCTURAL_CHANGE)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Company review / cleanup</span>
                  <span>{formatUSD(CORPORATE_PRICING.COMPANY_REVIEW)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Corporate documents</span>
                  <span>{formatUSD(CORPORATE_PRICING.CORPORATE_DOCUMENTS)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax residency certificate</span>
                  <span>{formatUSD(CORPORATE_PRICING.TAX_RESIDENCY)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
