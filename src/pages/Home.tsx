import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ModuleCards } from "@/components/home/ModuleCards";
import { TrustSection } from "@/components/home/TrustSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BottomCTA } from "@/components/home/BottomCTA";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <ModuleCards />
      <TrustSection />
      <HowItWorks />
      <BottomCTA />
    </Layout>
  );
}