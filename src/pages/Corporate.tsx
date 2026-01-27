import { Layout } from "@/components/layout/Layout";
import { CorporateServices } from "@/components/corporate/CorporateServices";

export default function Corporate() {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-5xl mx-auto pb-24 md:pb-0">
            <CorporateServices />
          </div>
        </div>
      </section>
    </Layout>
  );
}
