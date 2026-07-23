import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InternalPageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  meta?: ReactNode;
  className?: string;
};

export function InternalPageHeader({
  eyebrow,
  title,
  description,
  meta,
  className,
}: InternalPageHeaderProps) {
  return (
    <section className={cn("border-b border-border", className)}>
      <div className="container px-4 sm:px-6">
        <div className="border-x border-border">
          <div className="flex items-center justify-between gap-6 border-b border-border px-5 py-4 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
            {meta && (
              <div className="hidden text-xs uppercase tracking-[0.16em] text-muted-foreground sm:block">
                {meta}
              </div>
            )}
          </div>
          <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
            <div className="px-5 py-10 sm:px-8 sm:py-14 lg:border-r lg:border-border lg:py-16">
              <h1 className="max-w-4xl text-balance font-serif text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
            </div>
            <div className="flex items-end border-t border-border px-5 py-8 sm:px-8 lg:border-t-0">
              <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InternalSectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-border pb-4">
      <span className="text-xs font-semibold text-primary">{index}</span>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {children}
      </h2>
    </div>
  );
}
