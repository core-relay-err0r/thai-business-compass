import { Layout } from "@/components/layout/Layout";
import { ConsultingServices } from "@/components/consulting/ConsultingServices";

export default function Consulting() {
  return (
    <Layout>
      {/* Section Head Block */}
      <section className="py-12 md:py-16 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Choose the business question, not a consulting package.
            </h1>
            <p className="text-lg text-muted-foreground">
              Select the problem you want to solve and see expected scope, timeline, and price range.
            </p>
            <p className="mt-4 text-sm text-muted-foreground/60">
              Advisory focused on decisions, not presentations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto pb-24 md:pb-0">
            <ConsultingServices />
          </div>
        </div>
      </section>
    </Layout>
  );
}
