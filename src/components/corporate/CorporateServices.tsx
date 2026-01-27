import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, UserCog, Users, MapPin, Wrench, Check, X, ArrowRight } from "lucide-react";
import { useServices } from "@/contexts/ServiceContext";
import { CORPORATE_PRICING, formatPrice } from "@/lib/pricing";

const SERVICES = [
  {
    id: "incorporation",
    icon: Building2,
    title: "Company Incorporation",
    price: CORPORATE_PRICING.INCORPORATION,
    whenNeeded: "Starting a new Thai Co., Ltd. from scratch.",
    contextLine: "Used when starting operations or restructuring into Thailand.",
    highlight: "Bank-ready structure",
    included: [
      "Company name reservation",
      "Memorandum of Association drafting",
      "Registration at DBD",
      "Initial share certificates",
      "Company seal and stamp",
    ],
    documents: [
      "Passport copies of all shareholders",
      "Proof of address for directors",
      "Signed incorporation forms",
    ],
  },
  {
    id: "director-change",
    icon: UserCog,
    title: "Director Change",
    price: CORPORATE_PRICING.DIRECTOR_CHANGE,
    whenNeeded: "Adding, removing, or replacing a company director.",
    contextLine: "Required when control or signing authority changes.",
    included: [
      "Preparation of board resolutions",
      "DBD registration filing",
      "Updated company affidavit",
      "Signatory updates at bank (guidance)",
    ],
    documents: [
      "New director's passport & address proof",
      "Existing director signatures",
      "Current company documents",
    ],
  },
  {
    id: "shareholder-change",
    icon: Users,
    title: "Shareholder Change / Share Transfer",
    price: CORPORATE_PRICING.SHAREHOLDER_CHANGE,
    whenNeeded: "Transferring shares or changing the ownership structure.",
    contextLine: "Required when ownership or profit rights change.",
    included: [
      "Share transfer agreement drafting",
      "Updated shareholder register",
      "DBD notification filing",
      "Updated share certificates",
    ],
    documents: [
      "Current shareholder documents",
      "New shareholder passport & address",
      "Board resolution for transfer",
    ],
  },
  {
    id: "address-update",
    icon: MapPin,
    title: "Registered Address Update",
    price: CORPORATE_PRICING.ADDRESS_UPDATE,
    whenNeeded: "Moving company registered address to a new location.",
    contextLine: "Mandatory when the official address changes.",
    included: [
      "DBD address change registration",
      "Updated company affidavit",
      "Revenue Department notification",
      "Updated business certificates",
    ],
    documents: [
      "New office lease agreement",
      "House registration of new address",
      "Board resolution approving move",
    ],
  },
  {
    id: "company-cleanup",
    icon: Wrench,
    title: "Company Cleanup",
    price: CORPORATE_PRICING.COMPANY_CLEANUP,
    pricePrefix: "From",
    whenNeeded: "Multiple updates or fixing outdated/incorrect registrations.",
    contextLine: "Typical cases: outdated directors, incorrect shareholders, missing filings.",
    included: [
      "Audit of current registrations",
      "Multiple change filings bundled",
      "Document reconciliation",
      "Compliance check & fix",
    ],
    documents: [
      "All existing company documents",
      "List of changes needed",
      "Director authorizations",
    ],
  },
];

export function CorporateServices() {
  const navigate = useNavigate();
  const { selectedCorporateServices, addCorporateService, removeCorporateService } = useServices();
  const [selectedService, setSelectedService] = useState<(typeof SERVICES)[0] | null>(null);

  const isSelected = (id: string) => selectedCorporateServices.some((s) => s.id === id);

  const toggleService = (service: (typeof SERVICES)[0]) => {
    if (isSelected(service.id)) {
      removeCorporateService(service.id);
    } else {
      addCorporateService({
        id: service.id,
        name: service.title,
        price: service.price,
      });
    }
  };

  const totalPrice = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-12">
      {/* Section header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Corporate Services</h1>
        <p className="text-muted-foreground">
          One-time corporate actions. Select what applies and see the scope instantly.
        </p>
      </div>

      {/* Service cards grid - increased gap for calmer layout */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const selected = isSelected(service.id);
          
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selected 
                  ? "border-primary/50 bg-primary/[0.02] shadow-sm" 
                  : "hover:border-border/80"
              }`}
              onClick={() => setSelectedService(service)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {selected && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      Added
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-4">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {service.whenNeeded}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Context line */}
                <p className="text-xs text-muted-foreground/80 leading-relaxed">
                  {service.contextLine}
                  {service.highlight && (
                    <span className="ml-1 text-foreground/60">• {service.highlight}</span>
                  )}
                </p>

                {/* Price - visually dominant but clean */}
                <div className="flex items-baseline gap-1.5 pt-2">
                  {service.pricePrefix && (
                    <span className="text-sm text-muted-foreground">{service.pricePrefix}</span>
                  )}
                  <span className="text-2xl font-semibold tracking-tight">
                    ฿{formatPrice(service.price)}
                  </span>
                </div>

                {/* Action button */}
                <Button
                  variant={selected ? "secondary" : "outline"}
                  className={`w-full transition-all ${
                    selected ? "border-primary/20" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleService(service);
                  }}
                >
                  {selected ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added to request
                    </>
                  ) : (
                    "Add to request"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trust & boundaries */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground/70 pt-4">
        <span>One-time services only.</span>
        <span>No visas or work permits.</span>
        <span>Corporate actions aligned with Thai regulations.</span>
      </div>

      {/* Floating selection summary */}
      {selectedCorporateServices.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-4">
            <div className="space-y-3">
              {/* Selected items */}
              <div className="space-y-1">
                {selectedCorporateServices.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-medium">฿{formatPrice(s.price)}</span>
                  </div>
                ))}
              </div>
              
              {/* Divider and total */}
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">One-time total</span>
                  <div className="text-lg font-semibold">฿{formatPrice(totalPrice)}</div>
                </div>
                <Button onClick={() => navigate("/submit")} size="sm">
                  Proceed to request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-lg">
          {selectedService && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <selectedService.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle>{selectedService.title}</DialogTitle>
                    {isSelected(selectedService.id) && (
                      <Badge variant="secondary" className="text-xs mt-1">Added</Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 text-sm">When you need it</h4>
                  <p className="text-sm text-muted-foreground">{selectedService.whenNeeded}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{selectedService.contextLine}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sm">What's included</h4>
                  <ul className="space-y-2">
                    {selectedService.included.map((item) => (
                      <li key={item} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sm">Typical documents needed</h4>
                  <ul className="space-y-2">
                    {selectedService.documents.map((doc) => (
                      <li key={doc} className="text-sm flex items-start gap-2 text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 mt-2 shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    {selectedService.pricePrefix && (
                      <span className="text-sm text-muted-foreground mr-1">{selectedService.pricePrefix}</span>
                    )}
                    <span className="text-2xl font-semibold tracking-tight">
                      ฿{formatPrice(selectedService.price)}
                    </span>
                  </div>
                  <Button
                    variant={isSelected(selectedService.id) ? "outline" : "default"}
                    onClick={() => {
                      toggleService(selectedService);
                      setSelectedService(null);
                    }}
                  >
                    {isSelected(selectedService.id) ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Add to request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
