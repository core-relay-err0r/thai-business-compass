import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ModuleCards } from "@/components/home/ModuleCards";
import { TrustSection } from "@/components/home/TrustSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PricingLogic } from "@/components/home/PricingLogic";
export default function Home() {
  return <Layout>
      <HeroSection />
      <ModuleCards />
      <TrustSection />
      <HowItWorks />
      <PricingLogic />
      
      {/* Simple footer */}
      
    </Layout>;
}