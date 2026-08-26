import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const fitCriteria = [
  "Clear and honest advice",
  "Documents provided on time",
  "Correct work, not shortcuts",
  "A team that takes responsibility",
  "Quality over the lowest price",
];

export function ClientFitSection() {
  return (
    <section id="client-fit" className="scroll-mt-20 border-b border-border bg-foreground text-background">
      <div className="container px-4 sm:px-6">
        <div className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.65fr)] lg:gap-16 lg:py-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
              Before we start
            </p>
            <h2 className="mt-5 max-w-3xl text-balance font-serif text-4xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Is PND50 right for you?
            </h2>
            <div className="mt-7 flex max-w-3xl flex-col gap-4 text-base leading-relaxed text-background/75 sm:text-lg">
              <p>
                You know your business. We know accounting, tax and compliance.
              </p>
              <p>
                We do not guess what you need. First, we ask questions. We check the facts. We find the real problem. Then we tell you clearly what must be done—and we do it properly.
              </p>
            </div>

            <div className="mt-8 border-l-4 border-primary bg-background/10 px-5 py-5 sm:px-6">
              <p className="text-balance font-serif text-2xl font-medium leading-tight sm:text-3xl">
                We are not cheap. We do not compete on price.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background/75 sm:text-base">
                If you want the lowest price, we are not for you.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-background/25 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/55">
                We are a good fit if you want
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {fitCriteria.map((criterion) => (
                  <li key={criterion} className="flex items-start gap-3 text-sm font-medium leading-relaxed sm:text-base">
                    <Check aria-hidden="true" className="mt-0.5 shrink-0 text-primary-foreground" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/contact"
              className="group mt-10 inline-flex min-h-[54px] items-center justify-between gap-6 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              This sounds right — let&apos;s talk
              <ArrowUpRight aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
