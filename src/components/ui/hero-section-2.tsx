import React from "react";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
  title: React.ReactNode;
  subtitle: string;
  callToAction: { text: string; href: string };
  secondaryAction?: { text: string; href: string };
  slides?: { image: string; title: string; description: string }[];
  contactInfo?: { website: string; phone: string; address: string };
  tagline?: string;
}

const isExternal = (href: string) => href.startsWith("http");

const ActionLink = ({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) => {
  const className = cn(
    "group inline-flex min-h-[50px] items-center justify-between gap-8 border px-5 py-3 text-sm font-semibold transition-colors",
    primary
      ? "border-primary bg-primary text-primary-foreground hover:bg-foreground"
      : "border-foreground/30 bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
  );

  const content = <>{children}<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></>;

  if (isExternal(href) || href.startsWith("#")) {
    return <a href={href} className={className}>{content}</a>;
  }

  return <Link to={href} className={className}>{content}</Link>;
};

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(({
  className,
  title,
  subtitle,
  callToAction,
  secondaryAction,
  slides,
  contactInfo,
  tagline,
  ...props
}, ref) => {
  const image = slides?.[0];

  return (
    <section ref={ref} className={cn("home-editorial-hero relative overflow-hidden border-b border-border bg-background", className)} {...props}>
      <div className="container px-4 sm:px-6">
        <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col py-5 lg:min-h-[740px] lg:py-0">
          <div className="flex items-center justify-between border-b border-foreground/20 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:py-5">
            <span>Independent business strategy · Bangkok</span>
            <span className="hidden sm:inline">Situation → Strategy → Only what works</span>
          </div>

          <div className="relative grid flex-1 gap-8 py-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.72fr)] lg:gap-0 lg:py-0">
            <div className="relative z-10 flex flex-col justify-between lg:py-10 lg:pr-8 xl:py-12">
              <div>
                <div className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <span className="flex size-6 items-center justify-center rounded-full border border-primary">01</span>
                  Start before the service list
                </div>
                <h1 className="max-w-5xl text-balance font-serif text-[clamp(3.2rem,7.1vw,8.1rem)] font-medium leading-[0.82] tracking-[-0.06em]">
                  {title}
                </h1>
              </div>

              <div className="mt-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.65fr)] lg:items-end xl:mt-14">
                <div>
                  <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {subtitle}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <ActionLink href={callToAction.href} primary>{callToAction.text}</ActionLink>
                    {secondaryAction && <ActionLink href={secondaryAction.href}>{secondaryAction.text}</ActionLink>}
                  </div>
                </div>

                {tagline && (
                  <div className="border-l-2 border-primary pl-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">The filter</p>
                    <p className="text-sm leading-relaxed text-foreground">{tagline}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative lg:border-l lg:border-foreground/20 lg:pl-6 xl:pl-8">
              {image && (
                <figure className="relative h-full min-h-[520px] overflow-hidden bg-foreground lg:min-h-0">
                  <img
                    src={image.image}
                    alt={image.title}
                    className="home-editorial-image absolute inset-0 size-full object-cover object-center"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-background mix-blend-difference sm:p-5">
                    <span>PND50 / Strategy room</span>
                    <span>Bangkok · TH</span>
                  </div>
                  <div className="absolute bottom-0 left-0 max-w-[85%] bg-background p-5 sm:p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{image.title}</p>
                    <p className="mt-2 max-w-sm font-serif text-xl leading-tight sm:text-2xl">{image.description}</p>
                  </div>
                  <a href="#diagnosis" aria-label="Continue to needs diagnosis" className="absolute bottom-0 right-0 flex size-14 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-foreground sm:size-16">
                    <ArrowDownRight aria-hidden="true" />
                  </a>
                </figure>
              )}
            </div>
          </div>

          <div className="grid border-t border-foreground/20 text-xs sm:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1fr_1fr_1fr]">
            <div className="flex items-center gap-3 py-4 sm:border-r sm:px-4 lg:px-0">
              <span className="font-serif text-2xl text-primary">01</span>
              <span>Clarify the real need</span>
            </div>
            <div className="flex items-center gap-3 border-t py-4 sm:border-t-0 sm:px-4 lg:border-r">
              <span className="font-serif text-2xl text-primary">02</span>
              <span>Design the right strategy</span>
            </div>
            {contactInfo && (
              <div className="flex items-center justify-between gap-4 border-t py-4 sm:col-span-2 lg:col-span-1 lg:border-t-0 lg:pl-5">
                <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" aria-hidden="true" />{contactInfo.address}</span>
                <Link to="/contact" className="font-medium underline decoration-primary underline-offset-4">Talk directly</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
export { HeroSection };
