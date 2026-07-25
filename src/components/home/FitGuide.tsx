import { ArrowRight, Check, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/ui/animated-section";

const comparisonCriteria = [
  ["Scope", "Which filings, records, and year-end tasks are included—and which are not?"],
  ["Ownership", "Who tracks deadlines, requests missing documents, and confirms submission?"],
  ["Communication", "Can the provider explain Thai obligations and assumptions in working English?"],
  ["Pricing", "Is the quote tied to transaction volume, registrations, employees, and backlog?"],
  ["Boundaries", "Will legal, immigration, audit, or BOI work be referred or separately scoped?"],
];

export function FitGuide() {
  return (
    <section className="border-y border-border bg-secondary py-16 sm:py-20 lg:py-24" aria-labelledby="fit-guide-heading">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">How to compare providers</p>
          <div>
            <h2 id="fit-guide-heading" className="text-balance font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Choose for control, not for the longest service list.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A good quote should let you see who owns the work, what assumptions set the fee, and where another licensed specialist may be required.
            </p>
          </div>
        </div>

        <div className="mt-10 grid border border-border lg:grid-cols-2">
          <article className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="font-serif text-2xl font-medium">PND50 is likely a strong fit when</h3>
            </div>
            <ul className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
              <li>You need one English-speaking team to connect recurring accounting, tax filings, payroll, and corporate records.</li>
              <li>Your company has foreign ownership, employees, VAT, transaction volume, structural changes, or an existing backlog.</li>
              <li>You want the scope and assumptions documented before committing to a final quote.</li>
            </ul>
          </article>

          <article className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Minus className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <h3 className="font-serif text-2xl font-medium">A simpler option may be enough when</h3>
            </div>
            <ul className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
              <li>You only need a single standard document and already understand the authority, filing process, and deadline.</li>
              <li>Your internal team owns Thai-language coordination and only needs a narrowly defined execution task.</li>
              <li>You are looking exclusively for immigration, litigation, statutory audit, or regulated legal advice.</li>
            </ul>
          </article>
        </div>

        <div className="mt-8 grid border-t border-border md:grid-cols-5">
          {comparisonCriteria.map(([title, description], index) => (
            <div key={title} className={`py-5 md:px-5 ${index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link to="/services" className="inline-flex min-h-[44px] items-center gap-3 text-sm font-medium underline underline-offset-4">
            Explore possible solutions and planning tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}
