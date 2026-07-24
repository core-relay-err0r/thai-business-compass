import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export function BottomCTA() {
  return (
    <section className="border-b border-border bg-foreground py-16 text-background sm:py-20 lg:py-28">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Start with a useful conversation</p>
            <h2 className="text-balance font-serif text-4xl font-medium leading-none tracking-tight sm:text-6xl">
              You know what your business needs. We know how to turn it into the right plan.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-background/70 sm:text-base">
              Let’s clarify the outcome, review the facts, and define exactly what you need—and what you definitely do not—before choosing services or agreeing a fee.
            </p>
          </div>
          <a href="/submit">
            <Button size="lg" className="group min-h-[52px] border border-primary bg-primary px-6 text-primary-foreground hover:bg-background hover:text-foreground">
              Discuss your situation
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}
