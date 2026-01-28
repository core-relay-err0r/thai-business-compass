import { Layout } from "@/components/layout/Layout";
import { AccountingWizard } from "@/components/accounting/AccountingWizard";

export default function Accounting() {
  return (
    <Layout>
      {/* Section Head Block */}
      <section className="py-12 md:py-16 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Understand your accounting setup before committing.
            </h1>
            <p className="text-lg text-muted-foreground">
              Answer a few questions to see what is required, what is optional, and what it costs — based on your actual business.
            </p>
            <p className="mt-4 text-sm text-muted-foreground/60">
              No accounting knowledge required.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <AccountingWizard />
          </div>
        </div>
      </section>
    </Layout>
  );
}
