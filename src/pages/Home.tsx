import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ModuleCards } from "@/components/home/ModuleCards";
import { TrustSection } from "@/components/home/TrustSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BottomCTA } from "@/components/home/BottomCTA";
import { SEOHead } from "@/components/seo/SEOHead";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/seo/StructuredData";

export default function Home() {
  return (
    <Layout>
      <SEOHead
        title="PND50 | Thai Accounting Firm & Corporate Services | Bangkok"
        description="PND50 is a Bangkok-based accounting firm for foreign-owned companies in Thailand. Corporate tax, bookkeeping, payroll, and business advisory services. English-speaking accountants."
        path="/"
        keywords="PND50, PND50 accounting, PND50 Thailand, PND50 Bangkok, accounting services Thailand, Thai accounting firm, accountant for foreigners Thailand, English speaking accountant Thailand"
      />
      <LocalBusinessSchema />
      <OrganizationSchema />
      <HeroSection />
      <ModuleCards />
      <TrustSection />
      <HowItWorks />
      <BottomCTA />
    </Layout>
  );
}