import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, Check } from "lucide-react";
import { CORPORATE_PRICING, formatUSD } from "@/lib/pricing";

interface RegisteredOfficePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: RegisteredOfficeOptions) => void;
}

export interface RegisteredOfficeOptions {
  type: "new" | "change";
  virtualAssistance: boolean;
  totalPrice: number;
}

export function RegisteredOfficePopup({ open, onOpenChange, onConfirm }: RegisteredOfficePopupProps) {
  const [type, setType] = useState<"new" | "change">("new");
  const [virtualAssistance, setVirtualAssistance] = useState(false);

  const calculateTotal = () => {
    let total = CORPORATE_PRICING.REGISTERED_OFFICE;
    if (virtualAssistance) total += CORPORATE_PRICING.VIRTUAL_OFFICE_ASSISTANCE;
    return total;
  };

  const handleConfirm = () => {
    onConfirm({
      type,
      virtualAssistance,
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
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Registered Office</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Choose what applies:</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="type-new"
                  checked={type === "new"}
                  onCheckedChange={() => setType("new")}
                />
                <Label htmlFor="type-new" className="text-sm cursor-pointer">
                  Register a new address (new company)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="type-change"
                  checked={type === "change"}
                  onCheckedChange={() => setType("change")}
                />
                <Label htmlFor="type-change" className="text-sm cursor-pointer">
                  Change registered address (existing company)
                </Label>
              </div>
            </div>
          </div>

          {/* Optional assistance */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Optional assistance:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="virtual"
                    checked={virtualAssistance}
                    onCheckedChange={(checked) => setVirtualAssistance(checked as boolean)}
                  />
                  <Label htmlFor="virtual" className="text-sm cursor-pointer">
                    Virtual office selection assistance
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatUSD(CORPORATE_PRICING.VIRTUAL_OFFICE_ASSISTANCE)}/year
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground/70">
            We do not provide offices directly. We assist with selection only.
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">From</span>
              <div className="text-xl font-semibold">{formatUSD(calculateTotal())}/year</div>
            </div>
            <Button onClick={handleConfirm}>
              <Check className="mr-2 h-4 w-4" />
              Add registered office service
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
