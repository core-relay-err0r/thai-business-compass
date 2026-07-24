import { AIRecommender } from "@/components/services/AIRecommender";
import { AnimatedSection } from "@/components/ui/animated-section";

export function GuidedDiagnosis() {
  return (
    <section id="diagnosis" className="scroll-mt-20 border-b border-border bg-foreground py-16 text-background sm:py-20 lg:py-24">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-8 border-b border-background/20 pb-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Start with the decision</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/60">
              No account required. Your answers are used to map likely scope, not to lock you into a package.
            </p>
          </div>
          <div>
            <h2 className="text-balance font-serif text-3xl font-medium tracking-tight sm:text-5xl">
              First understand what your company needs. Then compare the price.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-background/70 sm:text-base">
              Answer six practical questions. We will show the likely work, the assumptions behind it, and where a human review is still necessary.
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
