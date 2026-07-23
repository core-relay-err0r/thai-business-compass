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
    <section className="border-b border-border py-16 sm:py-20 lg:py-28">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">A useful line in the sand</p>
            <h2 className="text-balance font-serif text-3xl font-medium tracking-tight sm:text-5xl">If the structure cannot survive scrutiny, we will not sell it.</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              PND50 handles Thai corporate accounting and tax for foreign-owned companies. We work in English, define our responsibility clearly, and say no to arrangements that create more risk than value.
            </p>
          </div>

          <div className="grid border-t border-border sm:grid-cols-2">
            <div className="border-b border-border py-8 sm:border-r sm:pr-8">
              <h3 className="mb-8 text-sm font-semibold">Within our scope</h3>
              <ol className="flex flex-col">
                {included.map((item, index) => (
                  <li key={item} className="flex gap-4 border-t border-border py-4 text-sm leading-relaxed">
                    <span className="text-xs text-muted-foreground">0{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-b border-border py-8 sm:pl-8">
              <h3 className="mb-8 text-sm font-semibold">Outside our scope</h3>
              <ol className="flex flex-col">
                {excluded.map((item, index) => (
                  <li key={item} className="flex gap-4 border-t border-border py-4 text-sm leading-relaxed text-muted-foreground">
                    <span className="text-xs">0{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
