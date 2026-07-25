import { ArrowDownRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const steps = [
  {
    number: "01",
    label: "Your side",
    title: "Bring the reality.",
    description: "Tell us what is happening, what must change, and what success looks like. No service vocabulary required.",
  },
  {
    number: "02",
    label: "Our side",
    title: "Challenge the assumptions.",
    description: "We connect the facts, expose hidden dependencies, and separate essential work from optional noise.",
  },
  {
    number: "03",
    label: "The outcome",
    title: "Commit to less—confidently.",
    description: "Only then do we agree the focused scope, ownership, sequence, and relevant planning price.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border bg-primary text-primary-foreground">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid border-x border-primary-foreground/25 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="flex min-h-56 flex-col justify-between border-b border-primary-foreground/25 p-6 sm:p-8 lg:min-h-[30rem] lg:border-b-0 lg:border-r lg:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">The method</p>
            <div>
              <p className="font-serif text-7xl leading-none sm:text-8xl lg:text-9xl">3</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/75">One disciplined sequence. No premature package. No inflated scope.</p>
            </div>
          </div>

          <div>
            <header className="border-b border-primary-foreground/25 p-6 sm:p-8 lg:p-10">
              <h2 className="max-w-4xl text-balance font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Need first. Strategy second. Services last.
              </h2>
            </header>
            <ol>
              {steps.map((step) => (
                <li key={step.number} className="group grid gap-5 border-b border-primary-foreground/25 p-6 last:border-b-0 sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:p-8 lg:p-10">
                  <span className="font-serif text-3xl text-primary-foreground/45">{step.number}</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/65">{step.label}</p>
                    <h3 className="mt-2 font-serif text-2xl font-medium sm:text-3xl">{step.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/75">{step.description}</p>
                  </div>
                  <ArrowDownRight className="hidden h-7 w-7 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 sm:block" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
