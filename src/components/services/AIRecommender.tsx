import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useServices, type AIRecommendation } from "@/contexts/ServiceContext";
import { cn } from "@/lib/utils";

type FormState = {
  businessStage: "new" | "existing" | "planning";
  foreignOwned: "yes" | "no" | "partial";
  revenueRange: "0-5k" | "5k-50k" | "50k-100k" | "100k-1m" | "1m+";
  employeeCount: number;
  vatRegistered: "yes" | "no" | "not-sure";
  goal: string;
};

const initialForm: FormState = {
  businessStage: "new",
  foreignOwned: "yes",
  revenueRange: "5k-50k",
  employeeCount: 0,
  vatRegistered: "not-sure",
  goal: "",
};

const REVENUE_OPTIONS: { value: FormState["revenueRange"]; label: string }[] = [
  { value: "0-5k", label: "Up to $5,000" },
  { value: "5k-50k", label: "$5,000 – $50,000" },
  { value: "50k-100k", label: "$50,000 – $100,000" },
  { value: "100k-1m", label: "$100,000 – $1,000,000" },
  { value: "1m+", label: "Over $1,000,000" },
];

const STAGE_LABELS: Record<FormState["businessStage"], string> = {
  new: "New / setting up",
  existing: "Existing Thai Co.",
  planning: "Just planning",
};
const FOREIGN_LABELS: Record<FormState["foreignOwned"], string> = {
  yes: "Yes",
  no: "No",
  partial: "Partial",
};
const VAT_LABELS: Record<FormState["vatRegistered"], string> = {
  yes: "Yes",
  no: "No",
  "not-sure": "Not sure",
};
const CONFIDENCE_BLURB: Record<"high" | "medium" | "low", string> = {
  high: "Your answers map cleanly to our standard service catalog.",
  medium: "A few details required reasonable assumptions — review them below.",
  low: "Your situation is unusual or some answers were unclear. Get in touch to refine.",
};

export function AIRecommender() {
  const navigate = useNavigate();
  const { applyRecommendation } = useServices();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<AIRecommendation | null>(null);
  const [submittedForm, setSubmittedForm] = useState<FormState | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);

  const handleSubmit = async () => {
    if (form.goal.trim().length < 3) {
      toast({ title: "Tell us your goal", description: "A short sentence is enough.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-recommend", { body: form });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult(data as AIRecommendation);
      setSubmittedForm(form);
      setExplainOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "AI recommendation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    applyRecommendation(result);
    toast({
      title: "✨ Applied to your estimate",
      description: "Calculator and selected services have been pre-filled. You can fine-tune anything below.",
      duration: 5000,
    });
    // Scroll to live estimate / accounting section
    document.getElementById("accounting")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRefine = () => {
    setResult(null);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardContent className="p-4 sm:p-6">
        {/* Header / Trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Not sure where to start?</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get an AI recommendation tailored to your business in under a minute.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            {open ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </div>
        </button>

        {open && (
          <div className="mt-6 pt-6 border-t border-border space-y-6">
            {!result && (
              <>
                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Business stage */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Business stage</Label>
                    <RadioGroup
                      value={form.businessStage}
                      onValueChange={(v) => setForm({ ...form, businessStage: v as FormState["businessStage"] })}
                      className="grid grid-cols-3 gap-2"
                    >
                      {[
                        { v: "new", l: "New / setting up" },
                        { v: "existing", l: "Existing Thai Co." },
                        { v: "planning", l: "Just planning" },
                      ].map((o) => (
                        <Label
                          key={o.v}
                          htmlFor={`stage-${o.v}`}
                          className={cn(
                            "flex items-center justify-center text-center text-xs sm:text-sm p-2 sm:p-3 border rounded-lg cursor-pointer min-h-[44px] transition-colors",
                            form.businessStage === o.v ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
                          )}
                        >
                          <RadioGroupItem value={o.v} id={`stage-${o.v}`} className="sr-only" />
                          {o.l}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Foreign owned */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Foreign-owned?</Label>
                    <RadioGroup
                      value={form.foreignOwned}
                      onValueChange={(v) => setForm({ ...form, foreignOwned: v as FormState["foreignOwned"] })}
                      className="grid grid-cols-3 gap-2"
                    >
                      {[
                        { v: "yes", l: "Yes" },
                        { v: "partial", l: "Partial" },
                        { v: "no", l: "No" },
                      ].map((o) => (
                        <Label
                          key={o.v}
                          htmlFor={`fo-${o.v}`}
                          className={cn(
                            "flex items-center justify-center text-sm p-2 sm:p-3 border rounded-lg cursor-pointer min-h-[44px] transition-colors",
                            form.foreignOwned === o.v ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
                          )}
                        >
                          <RadioGroupItem value={o.v} id={`fo-${o.v}`} className="sr-only" />
                          {o.l}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Revenue */}
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium mb-2 block">Monthly revenue (USD)</Label>
                    <RadioGroup
                      value={form.revenueRange}
                      onValueChange={(v) => setForm({ ...form, revenueRange: v as FormState["revenueRange"] })}
                      className="grid grid-cols-2 sm:grid-cols-5 gap-2"
                    >
                      {REVENUE_OPTIONS.map((o) => (
                        <Label
                          key={o.value}
                          htmlFor={`rev-${o.value}`}
                          className={cn(
                            "flex items-center justify-center text-center text-xs sm:text-sm p-2 sm:p-3 border rounded-lg cursor-pointer min-h-[44px] transition-colors",
                            form.revenueRange === o.value ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
                          )}
                        >
                          <RadioGroupItem value={o.value} id={`rev-${o.value}`} className="sr-only" />
                          {o.label}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Employees */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Employees</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[form.employeeCount]}
                        onValueChange={([v]) => setForm({ ...form, employeeCount: v })}
                        max={30}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span className="font-medium text-foreground">{form.employeeCount}</span>
                        <span>30</span>
                      </div>
                    </div>
                  </div>

                  {/* VAT */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">VAT registered?</Label>
                    <RadioGroup
                      value={form.vatRegistered}
                      onValueChange={(v) => setForm({ ...form, vatRegistered: v as FormState["vatRegistered"] })}
                      className="grid grid-cols-3 gap-2"
                    >
                      {[
                        { v: "yes", l: "Yes" },
                        { v: "no", l: "No" },
                        { v: "not-sure", l: "Not sure" },
                      ].map((o) => (
                        <Label
                          key={o.v}
                          htmlFor={`vat-${o.v}`}
                          className={cn(
                            "flex items-center justify-center text-sm p-2 sm:p-3 border rounded-lg cursor-pointer min-h-[44px] transition-colors",
                            form.vatRegistered === o.v ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
                          )}
                        >
                          <RadioGroupItem value={o.v} id={`vat-${o.v}`} className="sr-only" />
                          {o.l}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Goal */}
                  <div className="md:col-span-2">
                    <Label htmlFor="goal" className="text-sm font-medium mb-2 block">
                      What are you trying to achieve?
                    </Label>
                    <Textarea
                      id="goal"
                      value={form.goal}
                      onChange={(e) => setForm({ ...form, goal: e.target.value })}
                      placeholder="e.g. I want to set up a Thai company to invoice my clients in Asia and hire 2 staff."
                      maxLength={800}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button onClick={handleSubmit} disabled={loading} className="min-h-[44px]">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get my recommendation
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base">Your recommendation</h3>
                      <button
                        type="button"
                        onClick={() => setExplainOpen((v) => !v)}
                        aria-expanded={explainOpen}
                        className={cn(
                          "group inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium transition-colors",
                          result.confidence === "high" && "bg-green-100 text-green-700 hover:bg-green-200",
                          result.confidence === "medium" && "bg-amber-100 text-amber-700 hover:bg-amber-200",
                          result.confidence === "low" && "bg-muted text-muted-foreground hover:bg-accent",
                        )}
                        title="See why"
                      >
                        <span>{result.confidence} confidence</span>
                        <Info className="w-3 h-3 opacity-70" />
                        {explainOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>

                    {explainOpen && (
                      <div className="mt-3 p-4 rounded-lg border border-border bg-card/60 space-y-4 text-sm">
                        <p className="text-muted-foreground">{CONFIDENCE_BLURB[result.confidence]}</p>

                        {submittedForm && (
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                              Your answers
                            </div>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                              <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">Stage</dt>
                                <dd className="font-medium text-right">{STAGE_LABELS[submittedForm.businessStage]}</dd>
                              </div>
                              <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">Foreign-owned</dt>
                                <dd className="font-medium text-right">{FOREIGN_LABELS[submittedForm.foreignOwned]}</dd>
                              </div>
                              <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">Revenue</dt>
                                <dd className="font-medium text-right">
                                  {REVENUE_OPTIONS.find((r) => r.value === submittedForm.revenueRange)?.label}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">Employees</dt>
                                <dd className="font-medium text-right">{submittedForm.employeeCount}</dd>
                              </div>
                              <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">VAT registered</dt>
                                <dd className="font-medium text-right">{VAT_LABELS[submittedForm.vatRegistered]}</dd>
                              </div>
                            </dl>
                            {submittedForm.goal && (
                              <div className="mt-2 pt-2 border-t border-border/60">
                                <div className="text-muted-foreground text-xs mb-1">Goal</div>
                                <p className="italic text-foreground/90">"{submittedForm.goal}"</p>
                              </div>
                            )}
                          </div>
                        )}

                        {result.keyDrivers && result.keyDrivers.length > 0 && (
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                              What drove this recommendation
                            </div>
                            <ul className="space-y-1">
                              {result.keyDrivers.map((d, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.assumptions && result.assumptions.length > 0 && (
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                              Assumptions made
                            </div>
                            <ul className="space-y-1">
                              {result.assumptions.map((a, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                                  <span>{a}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs text-muted-foreground mt-2">
                              You can adjust any of these in the calculator after applying.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Corporate</div>
                    {result.corporateServices.length > 0 ? (
                      <ul className="space-y-1.5">
                        {result.corporateServices.map((s) => (
                          <li key={s.id} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <span>{s.name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">None recommended.</p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Accounting</div>
                    {result.accountingInputs ? (
                      <p className="text-sm text-muted-foreground">
                        Calculator pre-fill ready. Click <span className="font-medium text-foreground">Apply</span> to load it.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No accounting setup recommended.</p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Consulting</div>
                    {result.consultingServices.length > 0 ? (
                      <ul className="space-y-1.5">
                        {result.consultingServices.map((s) => (
                          <li key={s.id} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <span>{s.name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">None recommended.</p>
                    )}
                  </div>
                </div>

                {result.notes.length > 0 && (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <div className="text-xs font-medium uppercase tracking-wider text-amber-700">Worth knowing</div>
                        <ul className="space-y-1 text-sm text-amber-900">
                          {result.notes.map((n, i) => (
                            <li key={i}>• {n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
                  <Button variant="ghost" onClick={handleRefine} className="min-h-[44px]">
                    Refine answers
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/submit")} className="min-h-[44px]">
                    Proceed to request
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button onClick={handleApply} className="min-h-[44px]">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Apply to my estimate
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}