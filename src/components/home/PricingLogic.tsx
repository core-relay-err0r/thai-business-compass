import { PRICING, CORPORATE_PRICING, formatPrice } from "@/lib/pricing";

export function PricingLogic() {
  return (
    <section id="pricing-logic" className="py-20">
      <div className="container">
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
                  <span>Base accounting fee</span>
                  <span className="font-medium">฿{formatPrice(PRICING.BASE_ACCOUNTING)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ VAT reporting (if registered)</span>
                  <span>+฿{formatPrice(PRICING.VAT_ADDON)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ Payroll base</span>
                  <span>+฿{formatPrice(PRICING.PAYROLL_BASE)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ Per employee</span>
                  <span>+฿{formatPrice(PRICING.PAYROLL_PER_EMPLOYEE)}/employee/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ Medium transaction volume</span>
                  <span>+฿{formatPrice(PRICING.TX_MEDIUM_ADDON)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ High transaction volume</span>
                  <span>+฿{formatPrice(PRICING.TX_HIGH_ADDON)}/month</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ International payments</span>
                  <span>+฿{formatPrice(PRICING.INTL_PAYMENTS_ADDON)}/month</span>
                </div>
              </div>
            </div>

            {/* Annual */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Annual Services</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Year-end financial statements</span>
                  <span className="font-medium">฿{formatPrice(PRICING.YEAR_END_STATEMENTS)}/year</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>+ Annual audit (if required)</span>
                  <span>+฿{formatPrice(PRICING.AUDIT_ADDON)}/year</span>
                </div>
              </div>
            </div>

            {/* Corporate */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Corporate Services (One-time)</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Company incorporation</span>
                  <span className="font-medium">฿{formatPrice(CORPORATE_PRICING.INCORPORATION)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Director change</span>
                  <span>฿{formatPrice(CORPORATE_PRICING.DIRECTOR_CHANGE)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shareholder change / share transfer</span>
                  <span>฿{formatPrice(CORPORATE_PRICING.SHAREHOLDER_CHANGE)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Registered address update</span>
                  <span>฿{formatPrice(CORPORATE_PRICING.ADDRESS_UPDATE)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Company cleanup (multiple updates)</span>
                  <span>From ฿{formatPrice(CORPORATE_PRICING.COMPANY_CLEANUP)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
