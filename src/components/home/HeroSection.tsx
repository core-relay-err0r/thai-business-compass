import { HeroSection as HeroSectionUI } from "@/components/ui/hero-section-2";
import heroCorporate from "@/assets/hero-corporate.jpg";
import heroAccounting from "@/assets/hero-accounting.jpg";
import heroConsulting from "@/assets/hero-consulting.jpg";
export function HeroSection() {
  const slides = [{
    image: heroCorporate,
    title: "Corporate",
    description: "Company setup, registration, and structural changes for your Thai business."
  }, {
    image: heroAccounting,
    title: "Accounting",
    description: "Monthly bookkeeping, tax filings, and financial compliance handled for you."
  }, {
    image: heroConsulting,
    title: "Consulting",
    description: "Strategic advisory for business challenges, restructuring, and market entry."
  }];
  return (
    <>
      {/* SEO-optimized H1 for search engines */}
      <h1 className="sr-only">PND50 - Thai Accounting Firm in Bangkok, Thailand | Accountant for Foreigners</h1>
      <HeroSectionUI title={<>
            Figure out what your business actually needs in Thailand —{" "}
            <span className="text-accent">before you talk to anyone.</span>
          </>} subtitle="An interactive way for foreign founders to understand their company setup, accounting, corporate actions, and advisory scope — with clear structure and transparent cost." callToAction={{
      text: "See what applies to you",
      href: "/services/calculator"
    }} secondaryAction={{
      text: "See how it works",
      href: "#how-it-works"
    }} tagline="Understand first. Decide later. No pressure." slides={slides} contactInfo={{
      website: "info@pnd50.com",
      phone: "+66 84 356 3805",
      address: "Bangkok, Thailand"
    }} />
    </>
  );
}