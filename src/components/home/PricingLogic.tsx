import { PRICING, CORPORATE_PRICING, formatUSD } from "@/lib/pricing";
import { AnimatedSection } from "@/components/ui/animated-section";

const priceDrivers = [
  ["Transaction volume", "The number and complexity of monthly records"],
  ["Registrations", "VAT, withholding tax, payroll, and social security"],
  ["People", "Employee count and payroll filing scope"],
  ["History", "Current records versus catch-up or cleanup work"],
];

export function PricingLogic() {
  return (
    <section id="pricing-logic" className="border-b border-border bg-background py-16 sm:py-20 lg:py-24">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Understand the quote</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Prices are shown in US dollars with an approximate Thai-baht reference at ฿33 per dollar. Final scope and fees are confirmed after reviewing the company facts and records.
            </p>
          </div>
          <div>
            <h2 className="text-balance font-serif text-3xl font-medium tracking-tight sm:text-5xl">
              Price should follow the work—not the confidence of the salesperson.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Use these four drivers to compare quotes. If a provider cannot explain how each one changes the fee, the headline price is not yet comparable.
            </p>
          </div>
        </div>

        <div className="grid border-b border-border md:grid-cols-4">
          {priceDrivers.map(([title, description], index) => (
            <div key={title} className={`py-5 md:px-5 ${index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3">
          <article className="border-b border-border py-8 lg:border-b-0 lg:border-r lg:pr-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Recurring</p>
            <h3 className="mt-3 font-serif text-2xl font-medium">Monthly accounting</h3>
            <dl className="mt-6 flex flex-col gap-4 text-sm">
              <PriceRow label="Base bookkeeping (up to 50 transactions)" value={`${formatUSD(PRICING.BASE_ACCOUNTING)}/month`} strong />
              <PriceRow label="VAT reporting (PP.30)" value={`+${formatUSD(PRICING.VAT_ADDON)}/month`} />
              <PriceRow label="Recurring WHT (PND3/PND53)" value={`+${formatUSD(PRICING.RECURRING_WHT_ADDON)}/month`} />
              <PriceRow label="Payroll and social security (per 5 employees)" value={`+${formatUSD(PRICING.PAYROLL_BLOCK)}/month`} />
              <PriceRow label="Medium transaction volume" value={`+${formatUSD(PRICING.TX_MEDIUM_ADDON)}/month`} />
            </dl>
          </article>

          <article className="border-b border-border py-8 lg:border-b-0 lg:border-r lg:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Year end</p>
            <h3 className="mt-3 font-serif text-2xl font-medium">Annual closing without monthly bookkeeping</h3>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Annual closing = accounting preparation + independent audit.</p>
            <dl className="mt-6 flex flex-col gap-4 text-sm">
              <PriceRow label="1. Reconstruct accounting and prepare financial statements" value="From 30% of audit fee" strong />
              <PriceRow label="2. Independent annual audit" value={`From ${formatUSD(PRICING.AUDIT_ADDON)}`} />
              <PriceRow label="Complete annual closing" value={`From ${formatUSD(PRICING.AUDIT_ADDON * 1.3)}`} strong />
              <PriceRow label="High volume, inventory, incomplete or complex records" value="Higher quote after review" />
            </dl>
          </article>

          <article className="py-8 lg:pl-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">One time</p>
            <h3 className="mt-3 font-serif text-2xl font-medium">Corporate work</h3>
            <dl className="mt-6 flex flex-col gap-4 text-sm">
              <PriceRow label="Company incorporation" value={formatUSD(CORPORATE_PRICING.INCORPORATION)} strong />
              <PriceRow label="Registered office" value={`From ${formatUSD(CORPORATE_PRICING.REGISTERED_OFFICE)}/year`} />
              <PriceRow label="Director or shareholder change" value={formatUSD(CORPORATE_PRICING.STRUCTURAL_CHANGE)} />
              <PriceRow label="Company review or cleanup" value={formatUSD(CORPORATE_PRICING.COMPANY_REVIEW)} />
            </dl>
          </article>
        </div>
      </AnimatedSection>
    </section>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-border pt-4 first:border-t-0 first:pt-0">
      <dt className="max-w-[65%] leading-relaxed text-muted-foreground">{label}</dt>
      <dd className={`shrink-0 text-right ${strong ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{value}</dd>
    </div>
  );
}
