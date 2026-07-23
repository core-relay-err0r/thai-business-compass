import React from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
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
    "inline-flex min-h-[44px] items-center justify-between gap-6 border px-5 py-3 text-sm font-medium transition-colors",
    primary
      ? "border-primary bg-primary text-primary-foreground hover:bg-foreground/90"
      : "border-foreground/30 bg-background text-foreground hover:bg-secondary"
  );

  if (isExternal(href)) {
    return <a href={href} className={className}>{children}</a>;
  }

  return <Link to={href} className={className}>{children}</Link>;
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
  const image = slides?.[1] ?? slides?.[0];

  return (
    <section ref={ref} className={cn("border-b border-border bg-background", className)} {...props}>
      <div className="container px-4 sm:px-6">
        <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col py-8 sm:py-10 lg:min-h-[680px] lg:py-0">
          <div className="flex items-center justify-between border-b border-border pb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground lg:pt-6">
            <span>Thai business advisory</span>
            <span className="hidden sm:inline">Accounting · Tax · Corporate</span>
          </div>

          <div className="grid flex-1 items-stretch lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col justify-between border-border py-8 lg:border-r lg:py-10 lg:pr-12 xl:pr-16">
              <div className="flex max-w-4xl flex-col gap-6">
                <p className="font-serif text-lg text-primary">Clarity before commitment.</p>
                <h1 className="text-balance font-serif text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl xl:text-[4.75rem]">
                  {title}
                </h1>
                <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {subtitle}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ActionLink href={callToAction.href} primary>
                    {callToAction.text}
                    <ArrowUpRight aria-hidden="true" />
                  </ActionLink>
                  {secondaryAction && (
                    <ActionLink href={secondaryAction.href}>
                      {secondaryAction.text}
                      <ArrowUpRight aria-hidden="true" />
                    </ActionLink>
                  )}
                </div>
              </div>

              {tagline && (
                <p className="mt-12 border-l border-foreground pl-4 text-sm leading-relaxed text-muted-foreground">
                  {tagline}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6 py-8 lg:justify-between lg:py-10 lg:pl-12 xl:pl-16">
              {image && (
                <figure className="flex flex-col gap-3">
                  <div className="aspect-[16/10] overflow-hidden border border-border bg-secondary">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="size-full object-cover saturate-[0.65]"
                      loading="eager"
                    />
                  </div>
                  <figcaption className="flex items-start justify-between gap-6 text-xs leading-relaxed text-muted-foreground">
                    <span>{image.title}</span>
                    <span className="max-w-xs text-right">{image.description}</span>
                  </figcaption>
                </figure>
              )}

              {contactInfo && (
                <div className="grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Direct</p>
                    <Link to="/contact" className="hover:underline">{contactInfo.website}</Link>
                    <p>{contactInfo.phone}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Office</p>
                    <p className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-4" />{contactInfo.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
export { HeroSection };
