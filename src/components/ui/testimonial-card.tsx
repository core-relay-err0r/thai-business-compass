"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// --- Type Definitions for props ---
export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  title: string;
  quote?: string;
  avatarSrc: string;
  rating: number;
}

export interface ClientsSectionProps {
  tagLabel: string;
  title: string;
  description: string;
  stats: Stat[];
  testimonials: Testimonial[];
  primaryActionLabel: string;
  secondaryActionLabel: string;
  primaryActionHref?: string;
  secondaryActionHref?: string;
  className?: string;
}

// --- Internal Sub-Components ---

const StatCard = ({ value, label }: Stat) => (
  <Card className="bg-card border-border/50">
    <CardContent className="p-4 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

const StickyTestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) => {
  return (
    <div
      className="sticky"
      style={{ top: `calc(6rem + ${index * 2}rem)` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="border-border/50 shadow-lg overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Top section: Image and Author */}
            <div className="flex items-center gap-4 mb-5">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} />
                <AvatarFallback>
                  {testimonial.name
                    .replace(/^(Mr\.|Mrs\.|Ms\.)\s*/, "")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
              </div>
            </div>

            {/* Middle section: Rating */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg font-bold text-foreground">
                {testimonial.rating.toFixed(1)}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(testimonial.rating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Bottom section: Quote */}
            {testimonial.quote && (
              <p className="text-muted-foreground leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// --- Main Exported Component ---

export const ClientsSection = ({
  tagLabel,
  title,
  description,
  stats,
  testimonials,
  primaryActionLabel,
  secondaryActionLabel,
  primaryActionHref = "#",
  secondaryActionHref = "#",
  className,
}: ClientsSectionProps) => {
  return (
    <section className={cn("py-8 sm:py-16 md:py-24", className)}>
      <div className="container px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Sticky Content */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-sm text-muted-foreground mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {tagLabel}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md">
              {description}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg">
                <a href={secondaryActionHref}>{secondaryActionLabel}</a>
              </Button>
              <Button asChild size="lg">
                <a href={primaryActionHref}>{primaryActionLabel}</a>
              </Button>
            </div>
          </div>

          {/* Right Column: Container for the sticky card stack */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <StickyTestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
