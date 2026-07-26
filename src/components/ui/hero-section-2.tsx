import React from "react";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  callToAction: { text: string; href: string };
  secondaryAction: { text: string; href: string };
  image: { src: string; alt: string };
  clarification: string;
  contactInfo?: { address: string };
}

function ActionLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const className = cn(
    "group inline-flex min-h-[50px] items-center justify-between gap-6 border px-5 py-3 text-sm font-semibold transition-colors",
    primary
      ? "border-primary bg-primary text-primary-foreground hover:border-foreground hover:bg-foreground"
      : "border-foreground/30 text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
  );

  return (
    <Link to={href} className={className}>
      {children}
      <ArrowUpRight aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(({
  className,
  eyebrow,
  title,
  subtitle,
  callToAction,
  secondaryAction,
  image,
  clarification,
  contactInfo,
  ...props
}, ref) => (
  <section ref={ref} className={cn("home-editorial-hero overflow-hidden border-b border-border bg-background", className)} {...props}>
    <div className="container px-4 sm:px-6">
      <div className="flex flex-col py-5 lg:min-h-[760px] lg:py-0">
        <div className="flex items-center justify-between border-b border-foreground/20 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:py-5">
          <span>{eyebrow}</span>
          <span className="hidden sm:inline">Accounting · Tax · Corporate compliance</span>
        </div>

        <div className="grid flex-1 gap-8 py-7 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.68fr)] lg:gap-0 lg:py-0">
          <div className="flex flex-col justify-between lg:py-10 lg:pr-10 xl:py-12">
            <div>
              <p className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="flex size-6 items-center justify-center rounded-full border border-primary">01</span>
                Bangkok accounting &amp; compliance
              </p>
              <h1 className="max-w-5xl text-balance font-serif text-[clamp(2.85rem,5.7vw,6.7rem)] font-medium leading-[0.9] tracking-[-0.055em]">
                {title}
              </h1>
            </div>

            <div className="mt-10 max-w-3xl xl:mt-14">
              <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ActionLink href={callToAction.href} primary>{callToAction.text}</ActionLink>
                <ActionLink href={secondaryAction.href}>{secondaryAction.text}</ActionLink>
              </div>
              <a
                href="#client-fit"
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-primary"
              >
                Check if we are the right fit
                <ArrowDownRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative lg:border-l lg:border-foreground/20 lg:pl-6 xl:pl-8">
            <figure className="relative h-full min-h-[520px] overflow-hidden bg-foreground lg:min-h-0">
              <img
                src={image.src}
                alt={image.alt}
                className="home-editorial-image absolute inset-0 size-full object-cover object-[50%_55%] contrast-125 saturate-[0.78]"
                width={1024}
                height={1024}
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 border-b border-background/50 bg-foreground/90 p-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-background sm:p-5">
                <span>PND50 Co., Ltd.</span>
                <span>Bangkok · TH</span>
              </div>
              <div aria-hidden="true" className="absolute right-0 top-20 bg-primary px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground [writing-mode:vertical-rl]">
                No shortcuts · No excuses
              </div>
              <div className="absolute bottom-0 left-0 max-w-[88%] border-t-4 border-primary bg-foreground p-5 text-background sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">The cost of getting it wrong</p>
                <p className="mt-2 max-w-sm font-serif text-2xl leading-[0.95] sm:text-3xl">Your business should never stand under a question mark.</p>
              </div>
              <a href="#services" aria-label="Continue to services" className="absolute bottom-0 right-0 flex size-14 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-background hover:text-foreground sm:size-16">
                <ArrowDownRight aria-hidden="true" />
              </a>
            </figure>
          </div>
        </div>

        <div className="grid border-t border-foreground/20 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">{clarification}</p>
          {contactInfo && (
            <span className="mt-4 flex items-center gap-2 text-sm font-medium lg:mt-0">
              <MapPin aria-hidden="true" className="text-primary" />
              {contactInfo.address}
            </span>
          )}
        </div>
      </div>
    </div>
  </section>
));

HeroSection.displayName = "HeroSection";
export { HeroSection };
