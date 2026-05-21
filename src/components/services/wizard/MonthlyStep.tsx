import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WizardState } from "./useEstimate";
import { PriceBadge, PriceNote } from "./PriceBadge";
import { getMonthlyBand, priceImpactText, transactionFee } from "./data";

interface Props {
  state: WizardState;
  set: (p: Partial<WizardState>) => void;
}

export function MonthlyStep({ state, set }: Props) {
  const band = getMonthlyBand(state.transactions);
  const payrollBlocks = state.employees > 0 ? Math.ceil(state.employees / 5) : 0;
  const payrollFee = payrollBlocks * 100;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Step 1 of 4</p>
          <h2 className="text-2xl font-semibold mt-1">Monthly accounting</h2>
        </div>
        <label className="flex items-center gap-3 text-sm">
          <Switch checked={state.monthlyEnabled} onCheckedChange={(v) => set({ monthlyEnabled: v })} />
          <span className="text-muted-foreground">Include monthly service</span>
        </label>
      </header>

      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
        <div><strong className="block text-foreground">1.</strong> Payments & receipts</div>
        <div><strong className="block text-foreground">2.</strong> VAT, WHT, payroll</div>
        <div><strong className="block text-foreground">3.</strong> Monthly close</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Business payments / receipts per month</Label>
          <Input
            inputMode="numeric" value={state.transactions}
            onChange={(e) => set({ transactions: Number(e.target.value) || 0 })}
          />
          <PriceNote>
            Count customer money in and supplier money out. Skip bank fees, tax filings, payroll, and SSO entries.
          </PriceNote>
          <PriceNote custom={!band}>
            {band ? `Base: ${priceImpactText(band.usd, { period: "/mo" })}` : "Monthly base: Custom quote above 1,000 transactions"}
          </PriceNote>
        </div>

        <div className="space-y-2">
          <Label>Employees / workers</Label>
          <Input
            inputMode="numeric" value={state.employees}
            onChange={(e) => set({ employees: Number(e.target.value) || 0 })}
          />
          <PriceNote>If above zero, payroll, PND1, and social security are added automatically.</PriceNote>
          <PriceNote>
            {state.employees > 0 ? `Payroll added: ${priceImpactText(payrollFee, { period: "/mo" })}` : "Payroll: $0 while employees = 0"}
          </PriceNote>
        </div>
      </div>

      <div className="space-y-4">
        <OptionRow
          checked={state.vatReporting}
          onChange={(v) => set({ vatReporting: v })}
          title="VAT filing"
          desc="Choose if VAT registered. Monthly PP.30 filing. Count only VAT-related transactions."
          badge={<PriceBadge usd={100} period="/mo" />}
        />
        {state.vatReporting && (
          <div className="ml-7 space-y-2">
            <Label>VAT transactions per month</Label>
            <Input inputMode="numeric" value={state.vatTransactions}
              onChange={(e) => set({ vatTransactions: Number(e.target.value) || 0 })} />
            <PriceNote>{`VAT filing: ${priceImpactText(transactionFee(state.vatTransactions), { period: "/mo" })}`}</PriceNote>
          </div>
        )}

        <OptionRow
          checked={state.vendorWht}
          onChange={(v) => set({ vendorWht: v })}
          title="Withholding tax on payments"
          desc="Local payments, dividends, vendors, rent, contractors, taxable services. Employee salary WHT is inside payroll."
          badge={<PriceBadge usd={100} period="/mo" />}
        />
        {state.vendorWht && (
          <div className="ml-7 space-y-2">
            <Label>WHT / local payment transactions per month</Label>
            <Input inputMode="numeric" value={state.whtTransactions}
              onChange={(e) => set({ whtTransactions: Number(e.target.value) || 0 })} />
            <PriceNote>{`WHT filing: ${priceImpactText(transactionFee(state.whtTransactions), { period: "/mo" })}`}</PriceNote>
          </div>
        )}
      </div>

      <details className="rounded-lg border border-border px-4 py-3 text-sm">
        <summary className="cursor-pointer text-muted-foreground">Manager controls</summary>
        <div className="mt-3">
          <OptionRow
            checked={state.rushHandling}
            onChange={(v) => set({ rushHandling: v })}
            title="Rush / late documents"
            desc="Adds 30% to monthly accounting before VAT."
            badge={<span className="text-sm font-semibold">+30%</span>}
          />
        </div>
      </details>
    </div>
  );
}

export function OptionRow({
  checked, onChange, title, desc, badge,
}: { checked: boolean; onChange: (v: boolean) => void; title: string; desc?: string; badge?: React.ReactNode }) {
  return (
    <label className="flex flex-col rounded-lg border border-border bg-card px-4 py-3 cursor-pointer hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3">
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-1" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{title}</div>
          {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
        </div>
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-border/60 flex justify-end">
          {badge}
        </div>
      )}
    </label>
  );
}