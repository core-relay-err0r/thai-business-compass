import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const CALCULATOR_URL = "https://calculator.pnd50.com";

const primaryServices = [
  {
    index: "01",
    eyebrow: "Stop compliance debt",
    title: "Accounting that closes the gaps",
    description: "Know what must be filed, when it is due, and what it costs before small omissions become expensive cleanup.",
    features: ["Monthly bookkeeping", "Corporate tax filing", "VAT reporting", "Payroll services Thailand"],
    cta: "Check monthly cost",
  },
  {
    index: "02",
    eyebrow: "Build it correctly once",
    title: "Corporate work without loose ends",
    description: "Define the structure, documents, and price of incorporation or company changes before anyone starts filing paperwork.",
    features: ["Company registration Thailand", "Director changes", "Share transfers", "Business setup Thailand"],
    cta: "Estimate setup cost",
  },
];

export function ModuleCards() {
  return (
    <section className="border-b border-border bg-secondary py-16 sm:py-20 lg:py-28">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Choose your exposure</p>
          <div className="flex flex-col gap-4">
            <h2 className="text-balance font-serif text-3xl font-medium tracking-tight sm:text-5xl">The work is predictable. The consequences of ignoring it are not.</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Separate recurring compliance from one-time corporate actions. See the scope, challenge the assumptions, then decide.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2">
          {primaryServices.map((service, index) => (
            <article key={service.title} className={`flex flex-col border-border py-10 lg:py-14 ${index === 0 ? "lg:border-r lg:pr-12" : "border-t lg:border-t-0 lg:pl-12"}`}>
              <div className="flex items-start justify-between gap-6">
                <span className="font-serif text-4xl text-muted-foreground/50">{service.index}</span>
                <span className="text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{service.eyebrow}</span>
              </div>
              <div className="mt-12 flex flex-1 flex-col gap-6">
                <h3 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">{service.title}</h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{service.description}</p>
                <ul className="grid gap-0 border-t border-border sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="border-b border-border py-3 text-sm">{feature}</li>
                  ))}
                </ul>
                <a href={CALCULATOR_URL} className="mt-auto inline-flex min-h-[44px] items-center justify-between border border-foreground px-5 py-3 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground">
                  {service.cta}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid gap-6 border-t border-border pt-8 md:grid-cols-[0.35fr_1fr_auto] md:items-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Secondary advisory</p>
          <div>
            <h3 className="font-serif text-xl font-medium">Consulting for decisions that fall outside routine compliance.</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Market entry, due diligence, restructuring, business advisory, and tax planning in Thailand.</p>
          </div>
          <a href={CALCULATOR_URL} className="inline-flex min-h-[44px] items-center gap-3 text-sm font-medium underline underline-offset-4">
            Check advisory options <ArrowUpRight aria-hidden="true" />
          </a>
        </aside>
      </AnimatedSection>
    </section>
  );
}
