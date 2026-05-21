import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, ChevronDown } from "lucide-react";
import { Block, Totals } from "./useEstimate";
import { formatThbFromUsd, formatUsd } from "./data";

interface Props {
  blocks: Block[];
  totals: Totals;
  fxRate: number;
  onReset: () => void;
  estimateText: string;
}

function topAmount(b: { total: number; from: boolean; customItems: string[] }) {
  if (b.total === 0 && b.customItems.length === 0) return "$0";
  if (b.customItems.length > 0 && b.total === 0) return "Custom quote";
  const prefix = (b.customItems.length > 0 ? "Known " : "") + (b.from ? "From " : "");
  return formatUsd(b.total, prefix);
}

function TotalCard({ title, amount, note, variant }: { title: string; amount: string; note: string; variant?: "accent" | "highlight" | "wide" }) {
  const wide = variant === "wide";
  return (
    <div className={`rounded-lg border p-4 sm:p-5 ${
      variant === "highlight" ? "bg-primary text-primary-foreground border-primary" :
      variant === "accent" ? "bg-primary/5 border-primary/20" :
      "bg-card border-border"
    } ${wide ? "sm:col-span-2" : ""}`}>
      <div className={`text-xs uppercase tracking-wider ${variant === "highlight" ? "opacity-80" : "text-muted-foreground"}`}>{title}</div>
      <div className="text-2xl sm:text-3xl font-bold mt-1">{amount}</div>
      <div className={`text-xs mt-1 ${variant === "highlight" ? "opacity-80" : "text-muted-foreground"}`}>{note}</div>
    </div>
  );
}

export function ReviewStep({ blocks, totals, fxRate, onReset, estimateText }: Props) {
  const navigate = useNavigate();
  const hasFrom = blocks.some((b) => b.enabled && b.from);
  const customItems = totals.dueNow.customItems;

  let alert: { kind: "info" | "warn"; msg: string };
  if (customItems.length > 0) {
    alert = { kind: "warn", msg: `Some items need manual pricing: ${customItems.join(", ")}. Send the request so the scope can be confirmed.` };
  } else if (hasFrom) {
    alert = { kind: "warn", msg: "Some items are starting prices. Send the request so the final scope can be confirmed." };
  } else {
    alert = { kind: "info", msg: "Your selected items have fixed estimate pricing. Send the request when you're ready for confirmation." };
  }

  const note = (b: { total: number; from: boolean; customItems: string[] }, empty: string, extra = "") => {
    if (b.total > 0) {
      const prefix = (b.customItems.length > 0 ? "Known " : "") + (b.from ? "From " : "");
      return `${formatThbFromUsd(b.total, fxRate, prefix)}${extra}`;
    }
    return b.customItems.length > 0 ? "Manual review required" : empty;
  };

  const handleProceed = () => {
    navigate("/submit", { state: { prefillNote: estimateText } });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Step 4 of 4</p>
          <h2 className="text-2xl font-semibold mt-1">Review your estimate</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onReset} title="Reset"><RotateCcw className="w-4 h-4" /></Button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalCard title="Monthly services" amount={topAmount(totals.monthly)}
          note={note(totals.monthly, "No monthly service selected",
            totals.monthly.total > 0 ? ` · Annualized: ${formatUsd(totals.monthly.total * 12)} incl. VAT` : "")} />
        <TotalCard title="Yearly services" amount={topAmount(totals.yearly)}
          note={note(totals.yearly, "No yearly services selected")} variant="accent" />
        <TotalCard title="One-time services" amount={topAmount(totals.oneTime)}
          note={note(totals.oneTime, "No one-time services selected")} />
        <TotalCard title="Due now estimate" amount={topAmount(totals.dueNow)}
          note="First month + yearly + one-time" variant="highlight" />
        <TotalCard title="Estimated first-year total" amount={topAmount(totals.firstYear)}
          note="Monthly × 12 + yearly + one-time" variant="wide" />
      </div>

      <div className={`rounded-lg border px-4 py-3 text-sm ${
        alert.kind === "warn" ? "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300" : "border-border bg-muted/30 text-muted-foreground"
      }`}>
        {alert.msg}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={handleProceed}>
          Proceed to request <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <details className="rounded-lg border border-border">
        <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium">
          <span>Estimate details</span>
          <ChevronDown className="w-4 h-4" />
        </summary>
        <div className="px-4 pb-4 space-y-4">
          {blocks.map((b) => (
            <article key={b.title} className="rounded-md border border-border bg-card p-4">
              <header className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{b.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {!b.enabled ? "Not selected"
                    : b.customItems.length > 0 && b.subtotal === 0 ? "Custom quote"
                    : b.from ? "Starting price" : "Fixed estimate"}
                </span>
              </header>
              {b.enabled && (
                <div className="space-y-1.5 text-sm">
                  {b.lines.map((l, i) => (
                    <div key={i} className="flex justify-between gap-3">
                      <span className="text-muted-foreground">
                        {l.label}
                        {l.note && <small className="block text-xs opacity-70">{l.note}</small>}
                      </span>
                      <strong className="font-medium whitespace-nowrap">{formatUsd(l.usd, l.mode === "from" ? "From " : "")}</strong>
                    </div>
                  ))}
                  {b.customItems.map((c, i) => (
                    <div key={`c-${i}`} className="text-muted-foreground italic text-xs">• {c} (custom quote)</div>
                  ))}
                  {b.subtotal > 0 && (
                    <div className="border-t border-border mt-2 pt-2 space-y-0.5 text-xs">
                      <div className="flex justify-between"><span>Subtotal before VAT</span><strong>{formatUsd(b.subtotal, b.from ? "From " : "")}</strong></div>
                      <div className="flex justify-between"><span>VAT 7%</span><strong>{formatUsd(b.vat, b.from ? "From " : "")}</strong></div>
                      <div className="flex justify-between"><span>Total incl. VAT</span><strong>{formatUsd(b.total, b.from ? "From " : "")}</strong></div>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </details>
    </div>
  );
}

export function buildEstimateText(blocks: Block[], totals: Totals): string {
  const lines: string[] = ["PND50 Services Estimate", ""];
  blocks.forEach((b) => {
    lines.push(`${b.title}: ${!b.enabled ? "Not selected" : b.from ? "Starting price" : "Fixed estimate"}`);
    if (!b.enabled) { lines.push("  (not selected)", ""); return; }
    b.lines.forEach((l) => lines.push(`  - ${l.label}: ${formatUsd(l.usd, l.mode === "from" ? "From " : "")} before VAT`));
    b.customItems.forEach((c) => lines.push(`  - ${c}: Custom quote`));
    if (b.subtotal > 0) {
      const p = b.from ? "From " : "";
      lines.push(`  Subtotal: ${formatUsd(b.subtotal, p)}`);
      lines.push(`  VAT 7%: ${formatUsd(b.vat, p)}`);
      lines.push(`  Total incl. VAT: ${formatUsd(b.total, p)}`);
    }
    lines.push("");
  });
  lines.push("Totals");
  lines.push(`  Monthly: ${formatUsd(totals.monthly.total)}`);
  lines.push(`  Yearly: ${formatUsd(totals.yearly.total)}`);
  lines.push(`  One-time: ${formatUsd(totals.oneTime.total)}`);
  lines.push(`  Estimated first-year total: ${formatUsd(totals.firstYear.total, totals.firstYear.from ? "From " : "")}`);
  lines.push("");
  lines.push("This is an estimate. Final quote confirmed after document and scope review.");
  return lines.join("\n");
}