import { HeroSection as HeroSectionUI } from "@/components/ui/hero-section-2";

export function HeroSection() {
  return (
    <HeroSectionUI
      title={
        <>
          Figure out what your business actually needs in Thailand —{" "}
          <span className="text-muted-foreground">before you talk to anyone.</span>
        </>
      }
      subtitle="An interactive way for foreign founders to understand their company setup, accounting, corporate actions, and advisory scope — with clear structure and transparent cost."
      callToAction={{
        text: "See what applies to you",
        href: "/services",
      }}
      secondaryAction={{
        text: "See how it works",
        href: "#how-it-works",
      }}
      tagline="Understand first. Decide later. No pressure."
      contactInfo={{
        website: "pnd50.com",
        phone: "+66 84 356 3805",
        address: "Bangkok, Thailand",
      }}
    />
  );
}
