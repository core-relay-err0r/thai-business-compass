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
  mofaLegalization: boolean;
  totalPrice: number;
}

export function TaxResidencyPopup({ open, onOpenChange, onConfirm }: TaxResidencyPopupProps) {
  const [mofaLegalization, setMofaLegalization] = useState(false);

  const calculateTotal = () => {
    let total = CORPORATE_PRICING.TAX_RESIDENCY;
    if (mofaLegalization) total += CORPORATE_PRICING.MOFA_CONSULATE_LEGALIZATION;
    return total;
  };

  const handleConfirm = () => {
    onConfirm({
      mofaLegalization,
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

          {/* Legalization option */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Legalization option:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="mofa"
                    checked={mofaLegalization}
                    onCheckedChange={(checked) => setMofaLegalization(checked as boolean)}
                  />
                  <Label htmlFor="mofa" className="text-sm cursor-pointer">
                    MOFA + consulate legalization
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  +{formatUSD(CORPORATE_PRICING.MOFA_CONSULATE_LEGALIZATION)}
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
