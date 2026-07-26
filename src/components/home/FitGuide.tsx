import { AnimatedSection } from "@/components/ui/animated-section";

const audiences = [
  "Foreign-owned companies",
  "International founders",
  "Thailand market entrants",
  "SMEs requiring English-speaking support",
  "Existing companies changing accountants",
];

export function FitGuide() {
  return (
    <section className="border-b border-border bg-secondary py-14 sm:py-16 lg:py-20" aria-labelledby="who-we-help-heading">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-7 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Who we help</p>
          <div>
            <h2 id="who-we-help-heading" className="text-balance font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
              Built for international business in Thailand.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">Clear English-speaking coordination for companies that need their accounting, tax and corporate obligations to work together.</p>
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-3" aria-label="Businesses PND50 supports">
          {audiences.map((audience, index) => (
            <li key={audience} className="inline-flex min-h-11 items-center gap-3 border border-border bg-background px-4 py-2 text-sm font-medium">
              <span className="text-xs text-primary" aria-hidden="true">0{index + 1}</span>
              {audience}
            </li>
          ))}
        </ul>

        <aside className="mt-12 grid gap-5 border-t border-border pt-8 lg:grid-cols-[0.55fr_1.45fr]" aria-labelledby="why-pnd50-heading">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">About the name</p>
          <div>
            <h2 id="why-pnd50-heading" className="font-serif text-3xl font-medium sm:text-4xl">Why PND50?</h2>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">P.N.D.50 is Thailand’s annual corporate income tax return. We chose the name because it represents a critical moment in the compliance cycle, but our work goes beyond one form: bookkeeping, payroll, tax filings, company support and year-end close.</p>
          </div>
        </aside>
      </AnimatedSection>
    </section>
  );
}
