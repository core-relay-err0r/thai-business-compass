import { cn } from "@/lib/utils";
import { PriceMode, totalWithVat } from "./data";

interface Props {
  usd: number;
  mode?: PriceMode;
  period?: string;
  className?: string;
}

const usd0 = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function PriceBadge({ usd, mode = "fixed", period = "", className }: Props) {
  if (mode === "custom") {
    return <span className={cn("text-xs font-medium text-muted-foreground", className)}>Custom quote</span>;
  }
  const prefix = mode === "from" ? "From +" : "+";
  return (
    <span className={cn("flex flex-col items-end text-right leading-tight", className)}>
      <strong className="text-sm font-semibold text-foreground">
        {prefix}{usd0(usd)}{period}{" "}
        <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-wide">before VAT</span>
      </strong>
      <small className="text-xs text-muted-foreground">
        {prefix}{usd0(totalWithVat(usd))}{period} incl. VAT
      </small>
    </span>
  );
}

export function PriceNote({ children, custom }: { children: React.ReactNode; custom?: boolean }) {
  return (
    <p className={cn("text-xs mt-1", custom ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
      {children}
    </p>
  );
}