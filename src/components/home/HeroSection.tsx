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
    title: "Business consulting",
    description: "Strategic advisory for business challenges, restructuring, and market entry."
  }];

  return (
    <HeroSectionUI
        title={<>
          Thailand rewards prepared businesses. <span className="text-primary">Not expensive mistakes.</span>
        </>} 
        subtitle="See the compliance, corporate work, and likely cost behind your next move — before a missed filing, weak structure, or vague quote turns into a bigger problem."
        callToAction={{
          text: "Find what I actually need",
          href: "#diagnosis"
        }} 
        secondaryAction={{
          text: "I already know my scope",
          href: "/services"
        }} 
        tagline="No mystery packages. No grey-area structures. No pressure to buy what you do not need."
        slides={slides} 
        contactInfo={{
          website: "info@pnd50.com",
          phone: "+66 84 356 3805",
          address: "Bangkok, Thailand"
        }} 
      />
  );
}
