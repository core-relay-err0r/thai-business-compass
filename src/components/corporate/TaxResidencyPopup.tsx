import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollText, Check } from "lucide-react";
import { CORPORATE_PRICING, formatUSD } from "@/lib/pricing";

interface TaxResidencyPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: TaxResidencyOptions) => void;
}

export interface TaxResidencyOptions {
  mfaLegalization: boolean;
  embassyLegalization: boolean;
  totalPrice: number;
}

export function TaxResidencyPopup({ open, onOpenChange, onConfirm }: TaxResidencyPopupProps) {
  const [mfaLegalization, setMfaLegalization] = useState(false);
  const [embassyLegalization, setEmbassyLegalization] = useState(false);

  const calculateTotal = () => {
    let total = CORPORATE_PRICING.TAX_RESIDENCY;
    if (mfaLegalization) total += CORPORATE_PRICING.MFA_LEGALIZATION;
    if (embassyLegalization) total += CORPORATE_PRICING.EMBASSY_LEGALIZATION;
    return total;
  };

  const handleConfirm = () => {
    onConfirm({
      mfaLegalization,
      embassyLegalization,
      totalPrice: calculateTotal(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ScrollText className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Tax Residency Certificate</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Official tax residency confirmation.
          </p>

          {/* Legalization options */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Legalization options:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="mfa"
                    checked={mfaLegalization}
                    onCheckedChange={(checked) => setMfaLegalization(checked as boolean)}
                  />
                  <Label htmlFor="mfa" className="text-sm cursor-pointer">
                    MFA (Thailand) legalization
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  +{formatUSD(CORPORATE_PRICING.MFA_LEGALIZATION)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="embassy"
                    checked={embassyLegalization}
                    onCheckedChange={(checked) => setEmbassyLegalization(checked as boolean)}
                  />
                  <Label htmlFor="embassy" className="text-sm cursor-pointer">
                    Foreign embassy legalization (Bangkok)
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  +{formatUSD(CORPORATE_PRICING.EMBASSY_LEGALIZATION)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">Base + options</span>
              <div className="text-xl font-semibold">{formatUSD(calculateTotal())}</div>
            </div>
            <Button onClick={handleConfirm}>
              <Check className="mr-2 h-4 w-4" />
              Add to request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
