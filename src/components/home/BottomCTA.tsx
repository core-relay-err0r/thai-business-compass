import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export function BottomCTA() {
  return (
    <section className="bg-primary text-primary-foreground">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid border-x border-primary-foreground/25 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="border-b border-primary-foreground/25 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">The next move</p>
            <h2 className="mt-20 max-w-5xl text-balance font-serif text-5xl font-medium leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
              Put the situation on the table.
            </h2>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
              You know what your business needs. We know how to turn that need into a focused plan—and what to leave out.
            </p>
          </div>
          <a href="/contact" className="group flex min-h-72 flex-col justify-between p-6 transition-colors hover:bg-foreground hover:text-background sm:p-10 lg:min-h-[34rem] lg:p-12">
            <ArrowUpRight className="ml-auto h-12 w-12 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" aria-hidden="true" />
            <div>
              <p className="font-serif text-3xl font-medium sm:text-4xl">Contact us</p>
              <p className="mt-3 text-sm opacity-70">No package selection required.</p>
            </div>
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}
