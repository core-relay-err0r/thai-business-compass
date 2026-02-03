import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, LucideIcon } from "lucide-react";
import { formatUSD, formatPrice } from "@/lib/pricing";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  contextLine: string;
  price: number;
  priceTHB: number;
  timeline: string;
  isSelected: boolean;
  onCardClick: () => void;
  onButtonClick: () => void;
  hasPopup?: boolean;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  contextLine,
  price,
  priceTHB,
  timeline,
  isSelected,
  onCardClick,
  onButtonClick,
  hasPopup = false,
}: ServiceCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md h-full flex flex-col ${
        isSelected 
          ? "border-primary/50 bg-primary/[0.02] shadow-sm" 
          : "hover:border-border/80"
      }`}
      onClick={onCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {isSelected && (
            <Badge variant="secondary" className="text-xs font-medium">
              Added
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-4">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-xs text-muted-foreground/80 leading-relaxed">
          {contextLine}
        </p>

        <div className="pt-2 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight">
              {formatUSD(price)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60">
            ≈ ฿{formatPrice(priceTHB)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{timeline}</span>
        </div>

        <Button
          variant={isSelected ? "secondary" : "outline"}
          className={`w-full transition-all mt-auto ${isSelected ? "border-primary/20" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick();
          }}
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added to request
            </>
          ) : hasPopup ? (
            "Configure & add"
          ) : (
            "Add to request"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
