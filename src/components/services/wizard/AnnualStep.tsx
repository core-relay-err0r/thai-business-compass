import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";
import { AUDIT_BANDS, AuditBandKey, priceImpactText } from "./data";
import { WizardState } from "./useEstimate";
import { OptionRow } from "./MonthlyStep";
import { PriceNote } from "./PriceBadge";

interface Props {
  state: WizardState;
  set: (p: Partial<WizardState>) => void;
}

export function AnnualStep({ state, set }: Props) {
  const band = AUDIT_BANDS[state.revenueBand];
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Step 2 of 4</p>
          <h2 className="text-2xl font-semibold mt-1">Year-end report and audit</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => set({ fiscalYears: 0, catchUpNeeded: false })}>
          <SkipForward className="w-4 h-4 mr-2" /> Not needed
        </Button>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Fiscal years to close</Label>
          <Input inputMode="numeric" value={state.fiscalYears}
            onChange={(e) => set({ fiscalYears: Number(e.target.value) || 0 })} />
          <PriceNote>Leave 0 if no annual statements / audit / cleanup needed.</PriceNote>
          <PriceNote>
            {state.fiscalYears > 0
              ? `Year-end report: ${priceImpactText(state.fiscalYears * 800, { mode: "from" })}`
              : "Year-end report: $0 while fiscal years = 0"}
          </PriceNote>
        </div>

        <div className="space-y-2">
          <Label>Total revenue for the year</Label>
          <Select value={state.revenueBand} onValueChange={(v) => set({ revenueBand: v as AuditBandKey })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(AUDIT_BANDS) as AuditBandKey[]).map((k) => (
                <SelectItem key={k} value={k}>{AUDIT_BANDS[k].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PriceNote custom={band.mode === "custom" && state.fiscalYears > 0}>
            {state.fiscalYears === 0
              ? "Audit: $0 until fiscal years is 1 or more"
              : band.mode === "custom"
                ? "Annual audit: Custom quote above 300m THB revenue"
                : `Audit band: ${priceImpactText(band.usd * state.fiscalYears)}`}
          </PriceNote>
        </div>
      </div>

      <OptionRow
        checked={state.catchUpNeeded}
        onChange={(v) => set({ catchUpNeeded: v })}
        title="Books were not maintained properly"
        desc="Past bookkeeping is missing, messy, or needs reconstruction before audit."
      />

      {state.catchUpNeeded && state.fiscalYears > 0 && (
        <div className="ml-7 space-y-2 max-w-xs">
          <Label>Backlog years needing catch-up</Label>
          <Input inputMode="numeric" value={state.backlogYears}
            onChange={(e) => set({ backlogYears: Number(e.target.value) || 1 })} />
          <PriceNote>{`Catch-up: ${priceImpactText(state.backlogYears * 1000, { mode: "from" })}`}</PriceNote>
        </div>
      )}
    </div>
  );
}