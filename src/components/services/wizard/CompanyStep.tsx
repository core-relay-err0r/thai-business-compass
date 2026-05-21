import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONSULTING_SERVICES, CORPORATE_SERVICES, DOCUMENT_SERVICES, OFFICE_PRICES } from "./data";
import { OptionRow } from "./MonthlyStep";
import { PriceBadge, PriceNote } from "./PriceBadge";
import { WizardState, OfficeContract } from "./useEstimate";

interface Props {
  state: WizardState;
  set: (p: Partial<WizardState>) => void;
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-border p-5 space-y-3">
      <legend className="px-2 text-xs uppercase tracking-wider text-muted-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

function CorporateOpt({ id, indent, state, set, badge }: { id: string; indent?: boolean; state: WizardState; set: (p: Partial<WizardState>) => void; badge?: React.ReactNode }) {
  const svc = CORPORATE_SERVICES[id];
  return (
    <div className={indent ? "ml-6" : ""}>
      <OptionRow
        checked={!!state.corporate[id]}
        onChange={(v) => set({ corporate: { ...state.corporate, [id]: v } })}
        title={svc.label}
        desc={svc.note}
        badge={badge ?? <PriceBadge usd={svc.usd} mode={svc.mode} />}
      />
    </div>
  );
}

export function CompanyStep({ state, set }: Props) {
  const incorporationOn = !!state.corporate.incorporation;
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Step 3 of 4</p>
        <h2 className="text-2xl font-semibold mt-1">Company services</h2>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <FieldGroup title="Setup and office">
          <CorporateOpt id="incorporation" state={state} set={set} />
          {incorporationOn && (
            <>
              <CorporateOpt id="incorporationVat" state={state} set={set} indent />
              <CorporateOpt id="incorporationSocialSecurity" state={state} set={set} indent />
            </>
          )}

          <OptionRow
            checked={state.registeredOffice}
            onChange={(v) => set({ registeredOffice: v })}
            title="Registered office"
            desc="Starting price for a small physical room / registered office."
            badge={<PriceBadge usd={OFFICE_PRICES.registered[state.registeredOfficeContract].usd}
              mode="from" period={state.registeredOfficeContract === "short" ? "/mo" : "/year"} />}
          />
          {state.registeredOffice && (
            <div className="ml-6 space-y-2">
              <Label>Contract</Label>
              <Select value={state.registeredOfficeContract}
                onValueChange={(v) => set({ registeredOfficeContract: v as OfficeContract })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual: $500/mo effective, $6,000/year</SelectItem>
                  <SelectItem value="short">Less than 1 year: $700/mo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <OptionRow
            checked={state.virtualOffice}
            onChange={(v) => set({ virtualOffice: v })}
            title="Virtual office"
            desc="Mail / address support without a physical room."
            badge={<PriceBadge usd={OFFICE_PRICES.virtual[state.virtualOfficeContract].usd}
              mode="from" period={state.virtualOfficeContract === "short" ? "/mo" : "/year"} />}
          />
          {state.virtualOffice && (
            <div className="ml-6 space-y-2">
              <Label>Contract</Label>
              <Select value={state.virtualOfficeContract}
                onValueChange={(v) => set({ virtualOfficeContract: v as OfficeContract })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual: $300/mo effective, $3,600/year</SelectItem>
                  <SelectItem value="short">Less than 1 year: $350/mo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </FieldGroup>

        <FieldGroup title="Review and changes">
          <OptionRow
            checked={state.companyReview}
            onChange={(v) => set({ companyReview: v, reviewFinancial: v ? state.reviewFinancial : false, reviewEnglish: v ? state.reviewEnglish : false })}
            title="Company structural review"
            desc="Review structure, shareholders, business objectives, and cleanup opportunities."
            badge={<PriceBadge usd={1000} />}
          />
          {state.companyReview && (
            <>
              <div className="ml-6">
                <OptionRow checked={state.reviewFinancial} onChange={(v) => set({ reviewFinancial: v })}
                  title="Financial add-on" desc="Submitted years, DBD/RD status, filings, financial condition."
                  badge={<PriceBadge usd={500} />} />
              </div>
              <div className="ml-6">
                <OptionRow checked={state.reviewEnglish} onChange={(v) => set({ reviewEnglish: v })}
                  title="English version add-on" badge={<PriceBadge usd={500} />} />
              </div>
            </>
          )}
          <CorporateOpt id="directorChange" state={state} set={set} />
          <CorporateOpt id="shareholderNoShareChange" state={state} set={set} />
          <CorporateOpt id="shareholderStructureChange" state={state} set={set} />
          <CorporateOpt id="addressChangeNonVat" state={state} set={set} />
          <CorporateOpt id="addressChangeVat" state={state} set={set} />
        </FieldGroup>

        <FieldGroup title="Documents and legalization">
          <OptionRow checked={state.docFullPackage} onChange={(v) => set({ docFullPackage: v })}
            title={DOCUMENT_SERVICES.fullPackage.label} desc={DOCUMENT_SERVICES.fullPackage.note}
            badge={<PriceBadge usd={DOCUMENT_SERVICES.fullPackage.usd} />} />
          <div className="ml-6 space-y-3">
            <OptionRow checked={state.docCertifiedTranslation} onChange={(v) => set({ docCertifiedTranslation: v })}
              title={DOCUMENT_SERVICES.certifiedTranslation.label} badge={<PriceBadge usd={300} />} />
            <OptionRow checked={state.docNotarizedTranslation} onChange={(v) => set({ docNotarizedTranslation: v })}
              title={DOCUMENT_SERVICES.notarizedTranslation.label} badge={<PriceBadge usd={500} />} />
            <OptionRow checked={state.docCountryLegalization} onChange={(v) => set({ docCountryLegalization: v })}
              title={DOCUMENT_SERVICES.countryLegalization.label} desc={DOCUMENT_SERVICES.countryLegalization.note}
              badge={<PriceBadge usd={1700} mode="from" />} />
          </div>

          <div className="space-y-2 pt-2">
            <Label>Tax residency certificate quantity</Label>
            <Input inputMode="numeric" value={state.taxResidenceQuantity}
              onChange={(e) => set({ taxResidenceQuantity: Number(e.target.value) || 0 })} />
            <PriceNote>$400 per certificate. Add quantity only if needed.</PriceNote>
          </div>
          {state.taxResidenceQuantity > 0 && (
            <div className="ml-6">
              <OptionRow checked={state.taxResidenceLegalization} onChange={(v) => set({ taxResidenceLegalization: v })}
                title="Consulate legalization for tax residency certificate"
                desc="+$400 per certificate."
                badge={<PriceBadge usd={400} />} />
            </div>
          )}

          <OptionRow checked={state.deepCompanyCheck} onChange={(v) => set({ deepCompanyCheck: v })}
            title={DOCUMENT_SERVICES.deepCompanyCheck.label} desc={DOCUMENT_SERVICES.deepCompanyCheck.note}
            badge={<PriceBadge usd={2000} />} />
        </FieldGroup>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        Legalization is shown as a starting price because consulate fees and routes vary by country.
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Optional advisory</p>
        <h3 className="text-xl font-semibold mt-1">Advisory services</h3>
        <p className="text-sm text-muted-foreground mt-1">Use only when also needing strategic, bank, or compliance support.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <FieldGroup title="Business strategy">
          {(["reduceCosts", "newMarket", "dueDiligence", "structureStrategy"] as const).map((id) => {
            const svc = CONSULTING_SERVICES[id];
            return (
              <OptionRow key={id}
                checked={!!state.consulting[id]}
                onChange={(v) => set({ consulting: { ...state.consulting, [id]: v } })}
                title={svc.label} desc={svc.note}
                badge={<PriceBadge usd={svc.usd} mode={svc.mode} />} />
            );
          })}
        </FieldGroup>
        <FieldGroup title="Bank and compliance">
          {(["bankUrgent", "bankSmall", "bankComplex"] as const).map((id) => {
            const svc = CONSULTING_SERVICES[id];
            return (
              <OptionRow key={id}
                checked={!!state.consulting[id]}
                onChange={(v) => set({ consulting: { ...state.consulting, [id]: v } })}
                title={svc.label} desc={svc.note}
                badge={<PriceBadge usd={svc.usd} mode={svc.mode} />} />
            );
          })}
        </FieldGroup>
      </div>
    </div>
  );
}