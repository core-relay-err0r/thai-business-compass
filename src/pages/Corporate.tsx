import { Layout } from "@/components/layout/Layout";
import { CorporateServices } from "@/components/corporate/CorporateServices";

export default function Corporate() {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Corporate Services
            </h1>
            <p className="text-lg text-muted-foreground">
              One-time corporate changes and registrations. Select what you need and see the scope instantly.
            </p>
          </div>

          <div className="max-w-5xl mx-auto pb-24 md:pb-0">
            <CorporateServices />
          </div>
        </div>
      </section>
    </Layout>
  );
}
