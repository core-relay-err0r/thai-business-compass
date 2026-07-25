import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const CALCULATOR_URL = "/services";

const primaryServices = [
  {
    index: "01",
    eyebrow: "Recurring control",
    title: "Close the gaps before they become history.",
    description: "Map bookkeeping, filings, payroll, and deadlines around the company you actually operate—not an idealised package.",
    features: ["Monthly bookkeeping", "Corporate tax filing", "VAT reporting", "Payroll"],
    cta: "Explore accounting scope",
  },
  {
    index: "02",
    eyebrow: "Structural control",
    title: "Build it correctly. Change it deliberately.",
    description: "Define the structure, documents, sequence, and ownership before anyone starts moving corporate paperwork.",
    features: ["Company registration", "Director changes", "Share transfers", "Company review"],
    cta: "Explore corporate scope",
  },
];

export function ModuleCards() {
  return (
    <section className="border-b border-border bg-background py-16 sm:py-20 lg:py-28">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-8 pb-12 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Possible solutions</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Not packages to buy. Working areas we combine only after the need is clear.</p>
          </div>
          <h2 className="text-balance font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            The work is predictable. <span className="text-muted-foreground">The consequences are not.</span>
          </h2>
        </div>

        <div className="grid border border-border lg:grid-cols-2">
          {primaryServices.map((service, index) => (
            <article key={service.title} className={`group flex min-h-[34rem] flex-col p-6 transition-[background-color,color,transform] duration-500 ease-out hover:-translate-y-1 hover:bg-foreground hover:text-background sm:p-8 lg:p-10 ${index === 0 ? "border-b border-border lg:border-b-0 lg:border-r" : ""}`}>
              <div className="flex items-start justify-between gap-6">
                <span className="font-serif text-7xl leading-none text-primary sm:text-8xl">{service.index}</span>
                <span className="max-w-32 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground group-hover:text-background/60">{service.eyebrow}</span>
              </div>
              <div className="mt-auto pt-16">
                <h3 className="max-w-xl text-balance font-serif text-3xl font-medium leading-tight tracking-tight sm:text-5xl">{service.title}</h3>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground group-hover:text-background/70 sm:text-base">{service.description}</p>
                <ul className="mt-8 grid border-t border-border group-hover:border-background/25 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="border-b border-border py-3 text-xs uppercase tracking-[0.1em] group-hover:border-background/25">{feature}</li>
                  ))}
                </ul>
                <a href={CALCULATOR_URL} className="mt-8 inline-flex min-h-12 w-full items-center justify-between border border-foreground px-5 text-sm font-medium transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  {service.cta}
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid gap-6 border-x border-b border-border p-6 sm:p-8 md:grid-cols-[0.35fr_1fr_auto] md:items-center lg:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Beyond compliance</p>
          <div>
            <h3 className="font-serif text-2xl font-medium">Some decisions need a strategy, not another filing.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Market entry, commercial diligence, cost, and structure analysis—scoped around the decision.</p>
          </div>
          <a href={CALCULATOR_URL} className="inline-flex min-h-12 items-center gap-3 border-b border-foreground text-sm font-medium">
            Explore advisory <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </aside>
      </AnimatedSection>
    </section>
  );
}
