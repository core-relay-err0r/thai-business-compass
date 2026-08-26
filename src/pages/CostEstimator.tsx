import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { InternalPageHeader } from "@/components/layout/InternalPageHeader";
import { AIRecommender } from "@/components/services/AIRecommender";
import { AccountingWizard } from "@/components/accounting/AccountingWizard";
import { LiveEstimate } from "@/components/accounting/LiveEstimate";
import { MobileEstimateSheet } from "@/components/accounting/MobileEstimateSheet";
import { SEOHead } from "@/components/seo/SEOHead";

export default function CostEstimator() {
  return (
    <Layout>
      <SEOHead
        title="Accounting Cost Estimator Thailand | PND50"
        description="Build a preliminary accounting and compliance estimate for your Thai company. Final scope and fees are confirmed after review by PND50."
        path="/tools/cost-estimator"
        keywords="Thailand accounting cost calculator, bookkeeping estimate Thailand, PND50 cost estimator"
        noIndex
      />
      <InternalPageHeader
        eyebrow="Optional planning tool"
        meta="Preliminary estimate · Final scope by review"
        title={<>Map the likely scope. <span className="text-primary">Then confirm it with us.</span></>}
        description="Use this tool if you already want a planning estimate. You do not need to complete it before contacting PND50, and its result is not a final quote."
      />

      <section className="border-b border-border py-8 sm:py-10">
        <div className="container flex flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl items-start gap-4">
            <Calculator className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Not sure what to select? Skip the estimator and tell us the situation in your own words. Our team will identify the appropriate scope.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/services" className="inline-flex min-h-11 items-center justify-center gap-2 border border-border px-4 text-sm font-medium hover:bg-muted">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Services
            </Link>
            <Link to="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Contact us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-16">
        <div className="container px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <AIRecommender />
            <div className="mt-10 flex gap-10 lg:mt-14">
              <div className="min-w-0 flex-1">
                <AccountingWizard />
              </div>
              <aside className="hidden w-80 shrink-0 lg:block" aria-label="Current estimate">
                <div className="sticky top-24 border-l border-border pl-8">
                  <LiveEstimate />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
      <MobileEstimateSheet />
    </Layout>
  );
}
