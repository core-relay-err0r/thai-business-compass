import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ModuleCards } from "@/components/home/ModuleCards";
import { TrustSection } from "@/components/home/TrustSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PricingLogic } from "@/components/home/PricingLogic";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <ModuleCards />
      <TrustSection />
      <HowItWorks />
      <PricingLogic />
      
      {/* Simple footer */}
      <footer className="py-12 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PND50 Co., Ltd. All rights reserved.</p>
          <p className="mt-2">Thai corporate & accounting services for foreign founders.</p>
        </div>
      </footer>
    </Layout>
  );
}
