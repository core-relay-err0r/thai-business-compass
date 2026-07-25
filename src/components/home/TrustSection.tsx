import { Check, X } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const included = [
  "Thai corporate accounting & tax filings",
  "Company incorporation & corporate changes",
  "Business consulting for foreign-owned companies",
  "Clear, compliant structures only",
];

const excluded = [
  "Visas or work permits",
  "Immigration services",
  "Non-compliant or gray-area structures",
  "Nominee arrangements",
];

export function TrustSection() {
  return (
    <section className="border-b border-border bg-foreground py-16 text-background sm:py-20 lg:py-28">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="border border-background/20">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            <div className="border-b border-background/20 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Our non-negotiable</p>
              <h2 className="mt-20 max-w-5xl text-balance font-serif text-5xl font-medium leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
                If it cannot survive scrutiny, <span className="text-background/35">we will not sell it.</span>
              </h2>
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
              <span className="font-serif text-8xl leading-none text-primary">NO.</span>
              <p className="mt-16 text-sm leading-relaxed text-background/65 sm:text-base">
                We work in English, define responsibility clearly, and refuse arrangements that create more risk than value.
              </p>
            </div>
          </div>

          <div className="grid border-t border-background/20 lg:grid-cols-2">
            <ScopeList title="What we own" items={included} positive />
            <ScopeList title="What we refuse" items={excluded} />
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

function ScopeList({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  const Icon = positive ? Check : X;
  return (
    <div className={`p-6 sm:p-8 lg:p-10 ${positive ? "border-b border-background/20 lg:border-b-0 lg:border-r" : ""}`}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-background/55">{title}</h3>
      <ol className="mt-8">
        {items.map((item, index) => (
          <li key={item} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-t border-background/20 py-5 text-sm leading-relaxed sm:text-base">
            <span className="text-xs text-background/40">0{index + 1}</span>
            <span>{item}</span>
            <Icon className={`h-4 w-4 ${positive ? "text-primary" : "text-background/35"}`} aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}
