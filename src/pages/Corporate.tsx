import { Layout } from "@/components/layout/Layout";
import { CorporateServices } from "@/components/corporate/CorporateServices";

export default function Corporate() {
  return (
    <Layout>
      {/* Section Head Block */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Corporate actions, without unnecessary complexity.
            </h1>
            <p className="text-lg text-muted-foreground">
              One-time corporate services for starting or managing a Thai company. Select what applies and see the scope instantly.
            </p>
            <p className="mt-4 text-sm text-muted-foreground/60">
              Focused on clarity, not paperwork volume.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto pb-24 md:pb-0">
            <CorporateServices />
          </div>
        </div>
      </section>
    </Layout>
  );
}
