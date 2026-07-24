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
          You understand your business needs. <span className="text-primary">We know how to solve them in Thailand.</span>
        </>} 
        subtitle="Start with the problem, not a service package. We will clarify what your business actually needs, find the right strategy, and tell you what you can safely leave out."
        callToAction={{
          text: "Let’s discuss your situation",
          href: "/submit"
        }} 
        secondaryAction={{
          text: "Map my needs first",
          href: "#diagnosis"
        }} 
        tagline="A useful conversation should define both what you need and what you do not."
        slides={slides} 
        contactInfo={{
          website: "info@pnd50.com",
          phone: "+66 84 356 3805",
          address: "Bangkok, Thailand"
        }} 
      />
  );
}
