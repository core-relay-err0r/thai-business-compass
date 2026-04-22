import { CheckCircle2, XCircle, Shield } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export function TrustSection() {
  return (
    <section className="py-8 sm:py-12 md:py-20">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Focus & Boundaries</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              PND50 specializes in Thai corporate accounting and tax services for foreign-owned companies. We're the English-speaking accountant in Thailand that understands your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                What we do
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span>Thai corporate accounting & tax filings</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span>Company incorporation & corporate changes</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span>Business consulting for foreign-owned companies</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span>Clear, compliant structures only</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                What we don't handle
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2" />
                  <span>Visas or work permits</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2" />
                  <span>Immigration services</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2" />
                  <span>Non-compliant or gray-area structures</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2" />
                  <span>Nominee arrangements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
