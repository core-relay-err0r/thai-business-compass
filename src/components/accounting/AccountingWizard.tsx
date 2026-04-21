import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, HelpCircle, CheckCircle2, Clock, CircleDashed, Calculator, FileText } from "lucide-react";
import { useServices } from "@/contexts/ServiceContext";
import { AccountingInputs, calculateAccountingCost, formatUSD, USD_TO_THB, formatPrice, AUDIT_REVENUE_BANDS, AuditRevenueBand } from "@/lib/pricing";

const STEPS = [
  { id: 0, title: "Intent" },
  { id: 1, title: "Company Basics" },
  { id: 2, title: "Team" },
  { id: 3, title: "Operations" },
  { id: 4, title: "Year-End" },
  { id: 5, title: "Overview" },
];

export function AccountingWizard() {
  const navigate = useNavigate();
  const { accountingInputs, setAccountingInputs, accountingResult, setLiveAccountingResult } = useServices();
  const [currentStep, setCurrentStep] = useState(0);
  const [localInputs, setLocalInputs] = useState<Partial<AccountingInputs>>({
    accountingIntent: "full",
    revenueRange: "5k-50k",
    vatRegistered: "no",
    employeeCount: 0,
    employeePurpose: "operations",
    payrollNeeded: false,
    transactionVolume: "low",
    recurringWHT: "no",
    yearEndStatements: "yes",
    auditRequired: "no",
    ...accountingInputs,
  });

  const [liveResult, setLiveResult] = useState(accountingResult);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset wizard when clearAll is triggered (accountingResult becomes null)
  useEffect(() => {
    if (accountingResult === null && hasSubmitted) {
      setCurrentStep(0);
      setLocalInputs({
        accountingIntent: "full",
        revenueRange: "5k-50k",
        vatRegistered: "no",
        employeeCount: 0,
        employeePurpose: "operations",
        payrollNeeded: false,
        transactionVolume: "low",
        recurringWHT: "no",
        yearEndStatements: "yes",
        auditRequired: "no",
      });
      setLiveResult(null);
      setLiveAccountingResult(null);
      setHasSubmitted(false);
    }
  }, [accountingResult, hasSubmitted, setLiveAccountingResult]);

  useEffect(() => {
    if (
      hasSubmitted &&
      localInputs.revenueRange &&
      localInputs.vatRegistered &&
      localInputs.transactionVolume &&
      localInputs.yearEndStatements &&
      localInputs.auditRequired
    ) {
      const result = calculateAccountingCost(localInputs as AccountingInputs);
      setLiveResult(result);
      setLiveAccountingResult(result);
    }
  }, [localInputs, setLiveAccountingResult, hasSubmitted]);

  const handleNext = () => {
    setAccountingInputs(localInputs);
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      if (hasSubmitted) {
        setHasSubmitted(false);
        setLiveResult(null);
        setLiveAccountingResult(null);
      }
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setAccountingInputs(localInputs);
    setHasSubmitted(true);
    const result = calculateAccountingCost(localInputs as AccountingInputs);
    setLiveResult(result);
    setLiveAccountingResult(result);
    toast({
      title: "✅ Estimate saved!",
      description: "Your accounting estimate has been added to the calculator on the left.",
      duration: 4000,
    });
  };

  const handleAdjust = () => {
    setHasSubmitted(false);
    setLiveResult(null);
    setLiveAccountingResult(null);
    setCurrentStep(0);
  };

  const progressPercent = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <Card className={hasSubmitted ? "border-2 border-green-400 bg-green-50/50 transition-all duration-300" : "transition-all duration-300"}>
      <CardHeader className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Accounting Calculator</CardTitle>
            <span className="text-xs sm:text-sm text-muted-foreground">
              <span className="sm:hidden">{currentStep + 1}/{STEPS.length}</span>
              <span className="hidden sm:inline">Step {currentStep + 1} of {STEPS.length}</span>
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5 sm:h-2" />
          <div className="hidden sm:flex justify-between text-xs text-muted-foreground">
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
      <CardContent className="h-[400px] sm:h-[450px] p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {currentStep === 0 && (
            <Step0Intent inputs={localInputs} setInputs={setLocalInputs} />
          )}
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
          {currentStep === 5 && (
            liveResult ? (
              <Step5Results result={liveResult} onAdjust={handleAdjust} />
            ) : (
              <Step5Summary inputs={localInputs} setInputs={setLocalInputs} />
            )
          )}
        </div>

        <div className="flex justify-between px-4 sm:px-6 py-4 border-t border-border bg-card">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="min-h-[44px] px-3 sm:px-4"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          {currentStep < 5 ? (
            <Button onClick={handleNext} className="min-h-[44px] px-3 sm:px-4">
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
            </Button>
          ) : hasSubmitted ? (
            <Button disabled className="min-h-[44px] px-3 sm:px-4 bg-green-100 text-green-700 border border-green-300 hover:bg-green-100">
              <CheckCircle2 className="mr-1 sm:mr-2 h-5 w-5 text-green-600" />
              <span className="hidden sm:inline font-medium">Saved to estimate</span>
              <span className="sm:hidden font-medium">Saved ✓</span>
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="min-h-[44px] px-3 sm:px-4">
              <span className="hidden sm:inline">Submit to calculator</span>
              <span className="sm:hidden">Calculate</span>
              <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Step components
interface StepProps {
  inputs: Partial<AccountingInputs>;
  setInputs: (inputs: Partial<AccountingInputs>) => void;
}

function Step0Intent({ inputs, setInputs }: StepProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center pb-2 sm:pb-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">What do you need help with?</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => setInputs({ ...inputs, accountingIntent: "full" })}
          className={`p-4 sm:p-6 rounded-lg border-2 text-left transition-all min-h-[100px] ${
            inputs.accountingIntent === "full"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-semibold text-base sm:text-lg">Full accounting support</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monthly accounting, payroll, taxes, and year-end filings.
          </p>
        </button>

        <button
          onClick={() => setInputs({ ...inputs, accountingIntent: "year-end-only" })}
          className={`p-4 sm:p-6 rounded-lg border-2 text-left transition-all min-h-[100px] ${
            inputs.accountingIntent === "year-end-only"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-semibold text-base sm:text-lg">Year-end only</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Annual financial statements and audit support if required.
          </p>
        </button>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground text-center">
        Most operating companies choose full accounting. Year-end only is used in specific cases.
      </p>
    </div>
  );
}

function Step1CompanyBasics({ inputs, setInputs }: StepProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company Type</h3>
        <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
          <span className="font-medium text-sm sm:text-base">Thai Co., Ltd.</span>
          <span className="text-xs sm:text-sm text-muted-foreground ml-2">(standard Thai company)</span>
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Monthly Revenue Range (USD)</h3>
        <RadioGroup
          value={inputs.revenueRange}
          onValueChange={(value) => setInputs({ ...inputs, revenueRange: value as AccountingInputs["revenueRange"] })}
          className="grid gap-2 sm:gap-3"
        >
          {[
            { value: "0-5k", label: "Up to $5,000" },
            { value: "5k-50k", label: "$5,000 – $50,000" },
            { value: "50k-100k", label: "$50,000 – $100,000" },
            { value: "100k-1m", label: "$100,000 – $1,000,000" },
            { value: "1m+", label: "Over $1,000,000" },
          ].map((option) => (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="flex items-center space-x-3 p-3 sm:p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5 min-h-[44px]"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <span className="text-sm sm:text-base">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold">VAT Registered?</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              VAT affects monthly filings and reporting scope.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "not-sure", label: "Not sure" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setInputs({ ...inputs, vatRegistered: option.value as AccountingInputs["vatRegistered"] })}
              className={`flex items-center justify-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors min-h-[44px] text-sm sm:text-base ${
                inputs.vatRegistered === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
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

        {(inputs.employeeCount || 0) > 0 && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Are these employees required for operations or visas?</span>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Some companies formally employ staff for visa purposes. This still affects payroll reporting.
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "operations", label: "Operations" },
                { value: "visa", label: "Visa / formal only" },
                { value: "not-sure", label: "Not sure" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInputs({ ...inputs, employeePurpose: option.value as AccountingInputs["employeePurpose"] })}
                  className={`flex items-center justify-center p-3 text-sm border rounded-lg cursor-pointer transition-colors min-h-[44px] ${
                    inputs.employeePurpose === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Payroll Services Needed?</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              Payroll includes salary records and social security filings.
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
        {inputs.payrollNeeded && (
          <p className="text-xs text-muted-foreground mt-2">
            Payroll includes salary records and social security filings.
          </p>
        )}
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
            { value: "low", label: "Low", description: "Up to 50 transactions/month" },
            { value: "medium", label: "Medium", description: "More than 50 transactions/month" },
            { value: "high", label: "High", description: "Complex scope — custom quote" },
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
          <h3 className="text-lg font-semibold">Recurring Withholding Filings (PND3/PND53)?</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              Required when your company makes payments subject to withholding tax.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "not-sure", label: "Not sure" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setInputs({ ...inputs, recurringWHT: option.value as AccountingInputs["recurringWHT"] })}
              className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors min-h-[44px] ${
                inputs.recurringWHT === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4YearEnd({ inputs, setInputs }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Annual Financial Statements Required?</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              If unsure, we show this as a potential requirement in results.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "not-sure", label: "Not sure" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setInputs({ ...inputs, yearEndStatements: option.value as AccountingInputs["yearEndStatements"] })}
              className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors min-h-[44px] ${
                inputs.yearEndStatements === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Annual Audit Required?</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              If unsure, we show this as a potential requirement in results.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "not-sure", label: "Not sure" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setInputs({ ...inputs, auditRequired: option.value as AccountingInputs["auditRequired"] })}
              className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors min-h-[44px] ${
                inputs.auditRequired === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step5Summary({ inputs }: StepProps) {
  const intentLabel = inputs.accountingIntent === "full" ? "Full accounting support" : "Year-end only";
  const revenueLabels: Record<string, string> = {
    "0-5k": "Up to $5,000",
    "5k-50k": "$5,000 – $50,000",
    "50k-100k": "$50,000 – $100,000",
    "100k-1m": "$100,000 – $1,000,000",
    "1m+": "Over $1,000,000",
  };
  const vatLabels: Record<string, string> = { yes: "Yes", no: "No", "not-sure": "Not sure" };
  const purposeLabels: Record<string, string> = { operations: "Operations", visa: "Visa / formal only", "not-sure": "Not sure" };
  const volumeLabels: Record<string, string> = { low: "Low (up to 50)", medium: "Medium (>50)", high: "High (custom quote)" };
  const whtLabels: Record<string, string> = { yes: "Yes", no: "No", "not-sure": "Not sure" };
  const yearEndLabels: Record<string, string> = { yes: "Yes", no: "No", "not-sure": "Not sure" };
  const auditLabels: Record<string, string> = { yes: "Yes", no: "No", "not-sure": "Not sure" };

  const summaryItems = [
    { label: "Intent", value: intentLabel },
    { label: "Monthly Revenue", value: revenueLabels[inputs.revenueRange || "5k-50k"] },
    { label: "VAT Registered", value: vatLabels[inputs.vatRegistered || "no"] },
    { label: "Employees", value: `${inputs.employeeCount || 0} staff${(inputs.employeeCount || 0) > 0 ? ` (${purposeLabels[inputs.employeePurpose || "operations"]})` : ""}` },
    { label: "Payroll", value: inputs.payrollNeeded ? "Yes" : "No" },
    { label: "Transaction Volume", value: volumeLabels[inputs.transactionVolume || "low"] },
    { label: "Recurring WHT", value: whtLabels[inputs.recurringWHT || "no"] },
    { label: "Year-End Statements", value: yearEndLabels[inputs.yearEndStatements || "yes"] },
    { label: "Audit Required", value: auditLabels[inputs.auditRequired || "no"] },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center pb-4 border-b border-border">
        <h3 className="text-lg sm:text-xl font-semibold mb-1">Review your answers</h3>
        <p className="text-sm text-muted-foreground">Click "Submit to calculator" to get your estimate</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {summaryItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Step5Props {
  result: NonNullable<ReturnType<typeof calculateAccountingCost>>;
  onAdjust: () => void;
}

function Step5Results({ result, onAdjust }: Step5Props) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center pb-4 sm:pb-6 border-b border-border">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Your accounting setup overview</h3>
        <p className="text-sm sm:text-base text-muted-foreground">Based on your answers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h4 className="font-semibold text-sm sm:text-base">What is required</h4>
          </div>
          <ul className="space-y-2">
            {result.requiredItems.map((item) => (
              <li key={item} className="text-xs sm:text-sm flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <CircleDashed className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <h4 className="font-semibold text-sm sm:text-base">What is optional</h4>
          </div>
          <ul className="space-y-2">
            {result.recommendedItems.length > 0 ? (
              result.recommendedItems.map((item) => (
                <li key={item} className="text-xs sm:text-sm flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 sm:mt-2 shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li className="text-xs sm:text-sm text-muted-foreground">None for your setup</li>
            )}
          </ul>
        </div>

        <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            <h4 className="font-semibold text-sm sm:text-base">What may apply later</h4>
          </div>
          <ul className="space-y-2">
            {result.potentialMonthly.length > 0 || result.potentialAnnual.length > 0 ? (
              <>
                {result.potentialMonthly.map((p) => (
                  <li key={p.name} className="text-xs sm:text-sm flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
                    {p.name}
                  </li>
                ))}
                {result.potentialAnnual.map((p) => (
                  <li key={p.name} className="text-xs sm:text-sm flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
                    {p.name}
                  </li>
                ))}
              </>
            ) : (
              <li className="text-xs sm:text-sm text-muted-foreground">—</li>
            )}
            {result.notNeededItems.length > 0 && (
              <li className="text-xs text-muted-foreground mt-3 sm:mt-4 pt-2 border-t border-border">
                Not needed: {result.notNeededItems.join(", ")}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-border">
        <div className="p-4 sm:p-6 bg-primary/5 rounded-lg">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Estimated Monthly Cost</div>
          {result.isCustomQuote ? (
            <div className="text-xl sm:text-2xl font-bold text-primary">
              Custom quote required
            </div>
          ) : (
            <>
              <div className="text-2xl sm:text-3xl font-bold">
                {formatUSD(result.totalMonthly)}
                {result.potentialMonthly.length > 0 && (
                  <span className="text-lg sm:text-xl font-normal text-muted-foreground">
                    –{formatPrice(result.totalMonthlyMax)}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ≈ ฿{formatPrice(result.totalMonthly * USD_TO_THB)}
              </div>
            </>
          )}
        </div>
        <div className="p-4 sm:p-6 bg-primary/5 rounded-lg">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Estimated Annual Cost</div>
          {result.isCustomQuote ? (
            <div className="text-xl sm:text-2xl font-bold text-primary">
              Custom quote required
            </div>
          ) : (
            <>
              <div className="text-2xl sm:text-3xl font-bold">
                {result.annualAddons.some(a => a.isFrom) ? "From " : ""}{formatUSD(result.totalAnnual)}
                {result.potentialAnnual.length > 0 && (
                  <span className="text-lg sm:text-xl font-normal text-muted-foreground">
                    –{formatPrice(result.totalAnnualMax)}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ≈ ฿{formatPrice(result.totalAnnual * USD_TO_THB)}
              </div>
            </>
          )}
          {result.annualAddons.some(a => a.name === "Annual audit") && (
            <p className="text-xs text-muted-foreground mt-2">
              Final audit fee depends on revenue band.
            </p>
          )}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground text-center">
        This is an estimate based on standard Thai requirements.
      </p>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onAdjust} className="min-h-[44px]">
          Adjust my answers
        </Button>
      </div>
    </div>
  );
}
