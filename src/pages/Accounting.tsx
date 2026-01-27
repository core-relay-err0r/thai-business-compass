import { Layout } from "@/components/layout/Layout";
import { AccountingWizard } from "@/components/accounting/AccountingWizard";

export default function Accounting() {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Accounting Calculator
            </h1>
            <p className="text-lg text-muted-foreground">
              Answer a few questions about your Thai company. See exactly what accounting services you need and the cost.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <AccountingWizard />
          </div>
        </div>
      </section>
    </Layout>
  );
}
