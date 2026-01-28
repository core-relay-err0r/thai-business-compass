import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Check } from "lucide-react";
import { CORPORATE_PRICING, formatUSD } from "@/lib/pricing";

interface CorporateDocumentsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: CorporateDocumentsOptions) => void;
}

export interface CorporateDocumentsOptions {
  certifiedTranslation: boolean;
  notarizedTranslation: boolean;
  legalization: boolean;
  totalPrice: number;
}

export function CorporateDocumentsPopup({ open, onOpenChange, onConfirm }: CorporateDocumentsPopupProps) {
  const [certifiedTranslation, setCertifiedTranslation] = useState(false);
  const [notarizedTranslation, setNotarizedTranslation] = useState(false);
  const [legalization, setLegalization] = useState(false);

  const calculateTotal = () => {
    let total = CORPORATE_PRICING.CORPORATE_DOCUMENTS;
    if (certifiedTranslation) total += CORPORATE_PRICING.CERTIFIED_TRANSLATION;
    if (notarizedTranslation) total += CORPORATE_PRICING.NOTARIZED_TRANSLATION;
    if (legalization) total += CORPORATE_PRICING.LEGALIZATION;
    return total;
  };

  const handleConfirm = () => {
    onConfirm({
      certifiedTranslation,
      notarizedTranslation,
      legalization,
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
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Corporate Documents</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-1">Included:</p>
            <p className="text-sm text-muted-foreground">
              Full corporate documents set.
            </p>
          </div>

          {/* Translation & legalization options */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Translation & legalization options:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="certified"
                    checked={certifiedTranslation}
                    onCheckedChange={(checked) => setCertifiedTranslation(checked as boolean)}
                  />
                  <Label htmlFor="certified" className="text-sm cursor-pointer">
                    Certified translation
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatUSD(CORPORATE_PRICING.CERTIFIED_TRANSLATION)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="notarized"
                    checked={notarizedTranslation}
                    onCheckedChange={(checked) => setNotarizedTranslation(checked as boolean)}
                  />
                  <Label htmlFor="notarized" className="text-sm cursor-pointer">
                    Notarized translation
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatUSD(CORPORATE_PRICING.NOTARIZED_TRANSLATION)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="legalization"
                    checked={legalization}
                    onCheckedChange={(checked) => setLegalization(checked as boolean)}
                  />
                  <Label htmlFor="legalization" className="text-sm cursor-pointer">
                    Legalization / extended authority use
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  from {formatUSD(CORPORATE_PRICING.LEGALIZATION)}
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground/70">
            Used for banks, authorities, or legal procedures.
          </p>

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
