import { AIRecommender } from "@/components/services/AIRecommender";
import { AnimatedSection } from "@/components/ui/animated-section";

export function GuidedDiagnosis() {
  return (
    <section id="diagnosis" className="scroll-mt-20 border-b border-border bg-foreground py-16 text-background sm:py-20 lg:py-24">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-8 border-b border-background/20 pb-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Prepare the conversation</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/60">
              No account required. Use this short diagnosis to organise your situation before we discuss the right approach together.
            </p>
          </div>
          <div>
            <h2 className="text-balance font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Tell us what you need to achieve. We will work out what it takes.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-background/70 sm:text-base">
              Answer six practical questions to map the problem. The result is a starting point for discussion—not a package you are expected to buy. Together, we will confirm what is necessary, what is optional, and what you do not need at all.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <AIRecommender defaultOpen handoffToServices />
        </div>
      </AnimatedSection>
    </section>
  );
}
