"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface Stat { value: string; label: string; }
export interface Testimonial { name: string; title: string; quote?: string; avatarSrc: string; rating: number; }
export interface ClientsSectionProps {
  tagLabel: string; title: string; description: string; stats: Stat[]; testimonials: Testimonial[];
  primaryActionLabel: string; secondaryActionLabel: string; primaryActionHref?: string; secondaryActionHref?: string; className?: string;
}

export const ClientsSection = ({
  tagLabel, title, description, stats, testimonials, primaryActionLabel, secondaryActionLabel,
  primaryActionHref = "#", secondaryActionHref = "#", className,
}: ClientsSectionProps) => (
  <section className={cn("border-b border-border py-16 sm:py-20 lg:py-28", className)}>
    <div className="container px-4 sm:px-6">
      <div className="grid gap-10 border-b border-border pb-10 lg:grid-cols-[0.55fr_1.45fr] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{tagLabel}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <h2 className="text-balance font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">{title}</h2>
      </div>

      <div className="grid border-b border-border sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={stat.label} className={cn("py-7 sm:px-7", index > 0 && "border-t border-border sm:border-l sm:border-t-0")}>
            <p className="font-serif text-5xl leading-none text-primary sm:text-6xl">{stat.value}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.article
            key={testimonial.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className={cn("flex min-h-[30rem] flex-col py-8 sm:p-8 lg:p-10", index > 0 && "border-t border-border lg:border-l lg:border-t-0")}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-serif text-5xl text-muted-foreground/35">0{index + 1}</span>
              <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            {testimonial.quote && <blockquote className="mt-12 text-balance font-serif text-xl leading-relaxed sm:text-2xl">“{testimonial.quote}”</blockquote>}
            <div className="mt-auto flex items-center gap-4 pt-10">
              <Avatar className="h-12 w-12 border border-border">
                <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name.replace(/^(Mr\.|Mrs\.|Ms\.)\s*/, "").split(" ").map((word) => word[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{testimonial.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{testimonial.title}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" size="lg"><a href={secondaryActionHref}>{secondaryActionLabel}</a></Button>
        <Button asChild size="lg"><a href={primaryActionHref}>{primaryActionLabel}<ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></Button>
      </div>
    </div>
  </section>
);
