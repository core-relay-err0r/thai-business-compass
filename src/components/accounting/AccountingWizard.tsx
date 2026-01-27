import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, HelpCircle, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useServices } from "@/contexts/ServiceContext";
import { AccountingInputs, calculateAccountingCost, formatPrice } from "@/lib/pricing";

const STEPS = [
  { id: 1, title: "Company Basics" },
  { id: 2, title: "Team" },
  { id: 3, title: "Operations" },
  { id: 4, title: "Year-End" },
  { id: 5, title: "Results" },
];

export function AccountingWizard() {
  const navigate = useNavigate();
  const { accountingInputs, setAccountingInputs, accountingResult } = useServices();
  const [currentStep, setCurrentStep] = useState(1);
  const [localInputs, setLocalInputs] = useState<Partial<AccountingInputs>>({
    revenueRange: "0-50k",
    vatRegistered: "no",
    employeeCount: 0,
    payrollNeeded: false,
    transactionVolume: "low",
    internationalPayments: false,
    yearEndStatements: "yes",
    auditRequired: "no",
    ...accountingInputs,
  });

  const [liveResult, setLiveResult] = useState(accountingResult);

  useEffect(() => {
    // Calculate live result when inputs change
    if (
      localInputs.revenueRange &&
      localInputs.vatRegistered &&
      localInputs.transactionVolume &&
      localInputs.yearEndStatements &&
      localInputs.auditRequired
    ) {
      const result = calculateAccountingCost(localInputs as AccountingInputs);
      setLiveResult(result);
    }
  }, [localInputs]);

  const handleNext = () => {
    setAccountingInputs(localInputs);
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setAccountingInputs(localInputs);
    navigate("/submit");
  };

  const progressPercent = (currentStep / STEPS.length) * 100;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main wizard area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle>Accounting Calculator</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {STEPS.length}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                {STEPS.map((step) => (
                  <span
                    key={step.id}
                    className={step.id === currentStep ? "text-foreground font-medium" : ""}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {currentStep === 1 && (
              <Step1CompanyBasics inputs={localInputs} setInputs={setLocalInputs} />
            )}
            {currentStep === 2 && (
              <Step2Team inputs={localInputs} setInputs={setLocalInputs} />
            )}
            {currentStep === 3 && (
              <Step3Operations inputs={localInputs} setInputs={setLocalInputs} />
            )}
            {currentStep === 4 && (
              <Step4YearEnd inputs={localInputs} setInputs={setLocalInputs} />
            )}
            {currentStep === 5 && liveResult && (
              <Step5Results result={liveResult} />
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {currentStep < 5 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit request with this setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live summary panel */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Live Estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {liveResult ? (
              <>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Monthly</div>
                  <div className="text-2xl font-bold">
                    ฿{formatPrice(liveResult.totalMonthly)}
                    {liveResult.potentialMonthly.length > 0 && (
                      <span className="text-lg font-normal text-muted-foreground">
                        –{formatPrice(liveResult.totalMonthlyMax)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Annual (incl. year-end)</div>
                  <div className="text-2xl font-bold">
                    ฿{formatPrice(liveResult.totalAnnual)}
                    {liveResult.potentialAnnual.length > 0 && (
                      <span className="text-lg font-normal text-muted-foreground">
                        –{formatPrice(liveResult.totalAnnualMax)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="text-sm font-medium">Included:</div>
                  <div className="text-sm text-muted-foreground">Base accounting</div>
                  {liveResult.monthlyAddons.map((addon) => (
                    <div key={addon.name} className="text-sm text-muted-foreground">
                      + {addon.name}
                    </div>
                  ))}
                  {liveResult.annualAddons.map((addon) => (
                    <div key={addon.name} className="text-sm text-muted-foreground">
                      + {addon.name}
                    </div>
                  ))}
                </div>

                {(liveResult.potentialMonthly.length > 0 || liveResult.potentialAnnual.length > 0) && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="text-sm font-medium text-amber-600">Potential (if needed):</div>
                    {liveResult.potentialMonthly.map((p) => (
                      <div key={p.name} className="text-sm text-muted-foreground">
                        {p.name}: +฿{formatPrice(p.amount)}/mo
                      </div>
                    ))}
                    {liveResult.potentialAnnual.map((p) => (
                      <div key={p.name} className="text-sm text-muted-foreground">
                        {p.name}: +฿{formatPrice(p.amount)}/yr
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Complete the steps to see your estimate.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Step components
interface StepProps {
  inputs: Partial<AccountingInputs>;
  setInputs: (inputs: Partial<AccountingInputs>) => void;
}

function Step1CompanyBasics({ inputs, setInputs }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Company Type</h3>
        <div className="p-4 bg-muted/50 rounded-lg">
          <span className="font-medium">Thai Co., Ltd.</span>
          <span className="text-sm text-muted-foreground ml-2">(This is what we specialize in)</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Monthly Revenue Range</h3>
        <RadioGroup
          value={inputs.revenueRange}
          onValueChange={(value) => setInputs({ ...inputs, revenueRange: value as AccountingInputs["revenueRange"] })}
          className="grid gap-3"
        >
          {[
            { value: "0-50k", label: "0 – 50,000 THB" },
            { value: "50k-200k", label: "50,000 – 200,000 THB" },
            { value: "200k+", label: "200,000+ THB" },
          ].map((option) => (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">VAT Registered?</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              VAT registration changes monthly filings. Required if annual revenue exceeds 1.8M THB.
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={inputs.vatRegistered}
          onValueChange={(value) => setInputs({ ...inputs, vatRegistered: value as AccountingInputs["vatRegistered"] })}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "not-sure", label: "Not sure" },
          ].map((option) => (
            <Label
              key={option.value}
              htmlFor={`vat-${option.value}`}
              className="flex items-center justify-center p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value={option.value} id={`vat-${option.value}`} className="sr-only" />
              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

function Step2Team({ inputs, setInputs }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Number of Employees</h3>
        </div>
        <div className="space-y-4">
          <Slider
            value={[inputs.employeeCount || 0]}
            onValueChange={([value]) => setInputs({ ...inputs, employeeCount: value })}
            max={30}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0</span>
            <span className="font-medium text-foreground">{inputs.employeeCount || 0} employees</span>
            <span>30</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Payroll Services Needed?</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              Payroll includes salary calculations, payslips, and social security reporting.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
          <Switch
            id="payroll"
            checked={inputs.payrollNeeded}
            onCheckedChange={(checked) => setInputs({ ...inputs, payrollNeeded: checked })}
          />
          <Label htmlFor="payroll" className="cursor-pointer">
            {inputs.payrollNeeded ? "Yes, include payroll" : "No payroll needed"}
          </Label>
        </div>
        {inputs.payrollNeeded && (inputs.employeeCount || 0) === 0 && (
          <p className="text-sm text-amber-600 mt-2">
            Add employees above to include payroll costs.
          </p>
        )}
      </div>
    </div>
  );
}

function Step3Operations({ inputs, setInputs }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Monthly Transaction Volume</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              More transactions means more reconciliation work. Low: &lt;50, Medium: 50-200, High: 200+
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={inputs.transactionVolume}
          onValueChange={(value) => setInputs({ ...inputs, transactionVolume: value as AccountingInputs["transactionVolume"] })}
          className="grid gap-3"
        >
          {[
            { value: "low", label: "Low", description: "Less than 50 transactions/month" },
            { value: "medium", label: "Medium", description: "50–200 transactions/month" },
            { value: "high", label: "High", description: "More than 200 transactions/month" },
          ].map((option) => (
            <Label
              key={option.value}
              htmlFor={`tx-${option.value}`}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value={option.value} id={`tx-${option.value}`} />
              <div>
                <span className="font-medium">{option.label}</span>
                <span className="text-sm text-muted-foreground ml-2">{option.description}</span>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">International Payments?</h3>
        </div>
        <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
          <Switch
            id="intl-payments"
            checked={inputs.internationalPayments}
            onCheckedChange={(checked) => setInputs({ ...inputs, internationalPayments: checked })}
          />
          <Label htmlFor="intl-payments" className="cursor-pointer">
            {inputs.internationalPayments ? "Yes, we have international payments" : "No international payments"}
          </Label>
        </div>
      </div>
    </div>
  );
}

function Step4YearEnd({ inputs, setInputs }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Annual Financial Statements Required?</h3>
        <RadioGroup
          value={inputs.yearEndStatements}
          onValueChange={(value) => setInputs({ ...inputs, yearEndStatements: value as AccountingInputs["yearEndStatements"] })}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "not-sure", label: "Not sure" },
          ].map((option) => (
            <Label
              key={option.value}
              htmlFor={`statements-${option.value}`}
              className="flex items-center justify-center p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value={option.value} id={`statements-${option.value}`} className="sr-only" />
              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Annual Audit Required?</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              Some companies are required to file audited reports based on size or ownership structure.
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={inputs.auditRequired}
          onValueChange={(value) => setInputs({ ...inputs, auditRequired: value as AccountingInputs["auditRequired"] })}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "not-sure", label: "Not sure" },
          ].map((option) => (
            <Label
              key={option.value}
              htmlFor={`audit-${option.value}`}
              className="flex items-center justify-center p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value={option.value} id={`audit-${option.value}`} className="sr-only" />
              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

interface Step5Props {
  result: NonNullable<ReturnType<typeof calculateAccountingCost>>;
}

function Step5Results({ result }: Step5Props) {
  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <h3 className="text-2xl font-bold mb-2">Your Accounting Estimate</h3>
        <p className="text-muted-foreground">Based on your answers, here's what you need.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Legally Required</h4>
          </div>
          <ul className="space-y-2">
            {result.requiredItems.map((item) => (
              <li key={item} className="text-sm flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h4 className="font-semibold">Recommended</h4>
          </div>
          <ul className="space-y-2">
            {result.recommendedItems.length > 0 ? (
              result.recommendedItems.map((item) => (
                <li key={item} className="text-sm flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">None for your setup</li>
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-semibold">Not Needed</h4>
          </div>
          <ul className="space-y-2">
            {result.notNeededItems.length > 0 ? (
              result.notNeededItems.map((item) => (
                <li key={item} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">—</li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
        <div className="p-6 bg-primary/5 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Cost</div>
          <div className="text-3xl font-bold">
            ฿{formatPrice(result.totalMonthly)}
            {result.potentialMonthly.length > 0 && (
              <span className="text-xl font-normal text-muted-foreground">
                –{formatPrice(result.totalMonthlyMax)}
              </span>
            )}
          </div>
        </div>
        <div className="p-6 bg-primary/5 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Estimated Annual Cost</div>
          <div className="text-3xl font-bold">
            ฿{formatPrice(result.totalAnnual)}
            {result.potentialAnnual.length > 0 && (
              <span className="text-xl font-normal text-muted-foreground">
                –{formatPrice(result.totalAnnualMax)}
              </span>
            )}
          </div>
        </div>
      </div>

      {(result.potentialMonthly.length > 0 || result.potentialAnnual.length > 0) && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-amber-900">Potential Requirements</div>
              <div className="text-sm text-amber-800 mt-1">
                You selected "Not sure" for some items. The price range reflects both scenarios.
                We'll confirm these during onboarding.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
