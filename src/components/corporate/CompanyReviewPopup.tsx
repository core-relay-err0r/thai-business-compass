import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileSearch, Check } from "lucide-react";
import { CORPORATE_PRICING, formatUSD } from "@/lib/pricing";

interface CompanyReviewPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: CompanyReviewOptions) => void;
}

export interface CompanyReviewOptions {
  financialReview: boolean;
  englishVersion: boolean;
  financialEnglish: boolean;
  totalPrice: number;
}

export function CompanyReviewPopup({ open, onOpenChange, onConfirm }: CompanyReviewPopupProps) {
  const [financialReview, setFinancialReview] = useState(false);
  const [englishVersion, setEnglishVersion] = useState(false);
  const [financialEnglish, setFinancialEnglish] = useState(false);

  const calculateTotal = () => {
    let total = CORPORATE_PRICING.COMPANY_REVIEW;
    if (financialReview) total += CORPORATE_PRICING.COMPANY_REVIEW_FINANCIAL;
    if (englishVersion) total += CORPORATE_PRICING.COMPANY_REVIEW_ENGLISH;
    if (financialEnglish) total += CORPORATE_PRICING.COMPANY_REVIEW_FINANCIAL_ENGLISH;
    return total;
  };

  const handleConfirm = () => {
    onConfirm({
      financialReview,
      englishVersion,
      financialEnglish,
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
              <FileSearch className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Company Review / Cleanup</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Reviewing current company status and registrations.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              This service provides clarity, not corrections.
            </p>
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Optional add-ons:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="financial"
                    checked={financialReview}
                    onCheckedChange={(checked) => setFinancialReview(checked as boolean)}
                  />
                  <Label htmlFor="financial" className="text-sm cursor-pointer">
                    Financial filings review
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  +{formatUSD(CORPORATE_PRICING.COMPANY_REVIEW_FINANCIAL)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="english"
                    checked={englishVersion}
                    onCheckedChange={(checked) => setEnglishVersion(checked as boolean)}
                  />
                  <Label htmlFor="english" className="text-sm cursor-pointer">
                    English version
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  +{formatUSD(CORPORATE_PRICING.COMPANY_REVIEW_ENGLISH)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="financial-english"
                    checked={financialEnglish}
                    onCheckedChange={(checked) => setFinancialEnglish(checked as boolean)}
                  />
                  <Label htmlFor="financial-english" className="text-sm cursor-pointer">
                    Financial review in English
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  +{formatUSD(CORPORATE_PRICING.COMPANY_REVIEW_FINANCIAL_ENGLISH)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">Base + add-ons</span>
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
