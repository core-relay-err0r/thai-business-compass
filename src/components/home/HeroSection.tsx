import { HeroSection as HeroSectionUI } from "@/components/ui/hero-section-2";
import heroProvocativeCompliance from "@/assets/hero-provocative-compliance.webp";

export function HeroSection() {
  return (
    <HeroSectionUI
      eyebrow="PND50 Co., Ltd. · Bangkok"
      title="Accounting and corporate compliance for foreign-owned businesses in Thailand."
      subtitle="From company setup and monthly bookkeeping to payroll, tax filings and year-end close, PND50 helps international businesses stay organised and compliant in Thailand."
      callToAction={{
        text: "View our services",
        href: "/services#corporate",
      }}
      secondaryAction={{
        text: "Tell us what you need",
        href: "/submit",
      }}
      image={{
        src: heroProvocativeCompliance,
        alt: "A business owner facing a monumental blue compliance blade above Bangkok",
      }}
      clarification="PND50 Co., Ltd. is a Bangkok accounting and corporate compliance company. Our name is inspired by Thailand’s P.N.D.50 annual corporate income tax return, while our work covers the wider business compliance cycle."
      contactInfo={{ address: "Bangkok, Thailand" }}
    />
  );
}
