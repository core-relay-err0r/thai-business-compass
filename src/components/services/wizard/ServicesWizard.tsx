import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, SkipForward, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEstimate } from "./useEstimate";
import { MonthlyStep } from "./MonthlyStep";
import { AnnualStep } from "./AnnualStep";
import { CompanyStep } from "./CompanyStep";
import { ReviewStep, buildEstimateText } from "./ReviewStep";
import { formatUsd, formatThbFromUsd } from "./data";

const STEPS = [
  { id: "monthly", title: "Monthly", full: "Monthly accounting", next: "Year-end" },
  { id: "annual", title: "Year-end", full: "Year-end & audit", next: "Company" },
  { id: "company", title: "Company", full: "Company services", next: "Review" },
  { id: "review", title: "Review", full: "Review your estimate", next: "Request" },
] as const;

export function ServicesWizard() {
  const { state, setState, blocks, totals, reset } = useEstimate();
  const [step, setStep] = useState(0);

  const set = (p: Parameters<typeof setState>[0]) => setState(p);

  const estimateText = useMemo(() => buildEstimateText(blocks, totals), [blocks, totals]);

  const goto = (i: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const skip = () => {
    if (step === 0) set({ monthlyEnabled: false });
    if (step === 1) set({ fiscalYears: 0, catchUpNeeded: false });
    goto(step + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Services & estimate</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Answer a few questions to see the likely monthly, yearly, and one-time cost. Prices are in USD, Thai VAT is shown separately, THB is reference only.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <div className="uppercase tracking-wider text-muted-foreground">Service VAT</div>
            <strong className="text-foreground text-sm">7%</strong>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">THB / USD</Label>
            <Input className="w-20 h-8 text-sm" inputMode="decimal" value={state.fxRate}
              onChange={(e) => set({ fxRate: Number(e.target.value) || 32 })} />
          </div>
        </div>
      </header>

      {/* Stepper */}
      <nav aria-label="Wizard steps" className="grid grid-cols-4 gap-2 sm:gap-3">
        {STEPS.map((s, i) => {
          const active = i === step;
          const complete = i < step;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goto(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors min-h-[52px]",
                active ? "border-primary bg-primary/5 text-foreground"
                  : complete ? "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                active ? "bg-primary text-primary-foreground"
                  : complete ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                {complete ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{s.title}</div>
              </div>
            </button>
          );
        })}
      </nav>

      <p className="text-xs text-muted-foreground -mt-4">Go step by step, or jump to any section. The estimate updates live.</p>

      {/* Layout */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <section>
          {step === 0 && <MonthlyStep state={state} set={set} />}
          {step === 1 && <AnnualStep state={state} set={set} />}
          {step === 2 && <CompanyStep state={state} set={set} />}
          {step === 3 && <ReviewStep blocks={blocks} totals={totals} fxRate={state.fxRate} onReset={reset} estimateText={estimateText} />}
        </section>

        {/* Sticky estimate */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 rounded-lg border border-border bg-card p-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Live estimate</div>
              <h3 className="text-base font-semibold mt-1">First-year total</h3>
            </div>
            <div>
              <div className="text-3xl font-bold">{totals.firstYear.from ? "From " : ""}{formatUsd(totals.firstYear.total)}</div>
              <div className="text-xs text-muted-foreground mt-1">{formatThbFromUsd(totals.firstYear.total, state.fxRate)}</div>
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <Row label="Monthly" value={`${formatUsd(totals.monthly.total)}/mo`} />
              <Row label="Yearly" value={formatUsd(totals.yearly.total)} />
              <Row label="One-time" value={formatUsd(totals.oneTime.total)} />
            </div>
            {totals.dueNow.customItems.length > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">Includes items needing manual pricing.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Step controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={() => goto(step - 1)} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="text-xs text-muted-foreground text-center">
          <strong className="block text-foreground">Step {step + 1} of {STEPS.length}</strong>
          {STEPS[step].full}
        </div>
        <div className="flex gap-2">
          {step < STEPS.length - 1 && (
            <Button variant="outline" onClick={skip}>
              <SkipForward className="w-4 h-4 mr-2" /> Skip
            </Button>
          )}
          {step < STEPS.length - 1 && (
            <Button onClick={() => goto(step + 1)}>
              Next: {STEPS[step].next} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <strong className="font-medium">{value}</strong>
    </div>
  );
}