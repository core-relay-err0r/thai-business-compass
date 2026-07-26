import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/ui/animated-section";

const servicePillars = [
  {
    index: "01",
    title: "Accounting & Tax",
    description: "Ongoing financial records and reporting organised around your Thailand operations.",
    items: [
      "Monthly bookkeeping",
      "Tax filing and compliance",
      "Payroll support",
      "Financial statements",
      "Year-end accounting and tax close",
    ],
  },
  {
    index: "02",
    title: "Corporate Setup & Compliance",
    description: "Practical coordination for establishing and maintaining a compliant company structure.",
    items: [
      "Company registration support",
      "Accounting and tax setup",
      "Corporate changes and statutory filings",
      "Ongoing compliance coordination",
      "Support for foreign-owned businesses",
    ],
  },
];

export function ModuleCards() {
  return (
    <section id="services" className="scroll-mt-20 border-b border-border bg-background py-16 sm:py-20 lg:py-28" aria-labelledby="services-heading">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-8 pb-12 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">What we do</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Two connected areas of work, scoped around the obligations your business actually has.</p>
          </div>
          <h2 id="services-heading" className="text-balance font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            Accounting clarity. <span className="text-muted-foreground">Corporate continuity.</span>
          </h2>
        </div>

        <div className="grid border border-border lg:grid-cols-2">
          {servicePillars.map((service, index) => (
            <article key={service.title} className={`flex flex-col p-6 sm:p-8 lg:p-10 ${index === 0 ? "border-b border-border lg:border-b-0 lg:border-r" : ""}`}>
              <div className="flex items-start justify-between gap-6">
                <span className="font-serif text-6xl leading-none text-primary sm:text-7xl">{service.index}</span>
                <span className="max-w-32 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Service pillar</span>
              </div>
              <div className="mt-12 sm:mt-16">
                <h3 className="text-balance font-serif text-3xl font-medium leading-tight tracking-tight sm:text-5xl">{service.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{service.description}</p>
                <ul className="mt-8 border-t border-border">
                  {service.items.map((item) => (
                    <li key={item} className="flex min-h-12 items-center gap-3 border-b border-border py-3 text-sm">
                      <Check aria-hidden="true" className="shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-x border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:p-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Next step</p>
            <p className="mt-2 max-w-2xl font-serif text-2xl font-medium">See the full scope and choose the support your company needs.</p>
          </div>
          <Link to="/services#corporate" className="inline-flex min-h-12 shrink-0 items-center justify-between gap-6 border border-foreground bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground">
            View our services
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

      </AnimatedSection>
    </section>
  );
}
