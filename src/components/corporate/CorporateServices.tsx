import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, UserCog, Users, MapPin, Wrench, Check, X, ArrowRight, ShoppingCart } from "lucide-react";
import { useServices, CorporateService } from "@/contexts/ServiceContext";
import { CORPORATE_PRICING, formatPrice } from "@/lib/pricing";

const SERVICES = [
  {
    id: "incorporation",
    icon: Building2,
    title: "Company Incorporation",
    price: CORPORATE_PRICING.INCORPORATION,
    whenNeeded: "Starting a new Thai Co., Ltd. from scratch.",
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
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const selected = isSelected(service.id);
          
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedService(service)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {selected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg mt-4">{service.title}</CardTitle>
                <CardDescription>{service.whenNeeded}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mb-4">
                  {service.pricePrefix && (
                    <span className="text-sm text-muted-foreground">{service.pricePrefix}</span>
                  )}
                  <span className="text-2xl font-bold">฿{formatPrice(service.price)}</span>
                </div>
                <Button
                  variant={selected ? "secondary" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleService(service);
                  }}
                >
                  {selected ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added
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

      {/* Selection summary */}
      {selectedCorporateServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg md:relative md:mt-8 md:border md:rounded-lg md:shadow-none">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-medium">{selectedCorporateServices.length} service(s) selected</span>
                <span className="text-muted-foreground mx-2">•</span>
                <span className="font-bold">฿{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <Button onClick={() => navigate("/submit")}>
              Continue to submit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
                  <DialogTitle>{selectedService.title}</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">When you need it</h4>
                  <p className="text-sm text-muted-foreground">{selectedService.whenNeeded}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">What's included</h4>
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
                  <h4 className="font-medium mb-2">Typical documents needed</h4>
                  <ul className="space-y-2">
                    {selectedService.documents.map((doc) => (
                      <li key={doc} className="text-sm flex items-start gap-2 text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
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
                    <span className="text-2xl font-bold">฿{formatPrice(selectedService.price)}</span>
                  </div>
                  <Button
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
    </>
  );
}
