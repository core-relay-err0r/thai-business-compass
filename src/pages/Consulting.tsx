import { Layout } from "@/components/layout/Layout";
import { ConsultingServices } from "@/components/consulting/ConsultingServices";

export default function Consulting() {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Consulting
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the business problem. Get expected outcomes and price range.
            </p>
          </div>

          <div className="max-w-5xl mx-auto pb-24 md:pb-0">
            <ConsultingServices />
          </div>
        </div>
      </section>
    </Layout>
  );
}
