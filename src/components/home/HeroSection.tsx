import { HeroSection as HeroSectionUI } from "@/components/ui/hero-section-2";
import heroStrategyThailand from "@/assets/hero-strategy-thailand.webp";

export function HeroSection() {
  const slides = [{
    image: heroStrategyThailand,
    title: "Your business is not a package",
    description: "Bring the ambition, constraint, or problem. We will turn it into a clear path through Thailand."
  }];

  return (
    <HeroSectionUI
      title={<>You know the <span className="text-primary">need.</span><br />We design the move.</>}
      subtitle="Start with the business reality—not a catalogue. We clarify what matters, challenge what does not, and build the most useful route forward in Thailand."
      callToAction={{
        text: "Put the situation on the table",
        href: "/submit"
      }}
      secondaryAction={{
        text: "Map it in six questions",
        href: "#diagnosis"
      }}
      tagline="If it does not solve the need, it does not belong in the scope."
      slides={slides}
      contactInfo={{
        website: "info@pnd50.com",
        phone: "+66(0)2 017 2950 / +66(0)2 017 2949",
        address: "Bangkok, Thailand"
      }}
    />
  );
}
