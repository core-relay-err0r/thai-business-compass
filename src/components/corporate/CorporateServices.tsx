import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, FileSearch, Users, FileText, ScrollText, ArrowRight } from "lucide-react";
import { useServices } from "@/contexts/ServiceContext";
import { CORPORATE_PRICING, formatUSD } from "@/lib/pricing";
import { ServiceCard } from "./ServiceCard";
import { RegisteredOfficePopup, RegisteredOfficeOptions } from "./RegisteredOfficePopup";
import { CompanyReviewPopup, CompanyReviewOptions } from "./CompanyReviewPopup";
import { CorporateDocumentsPopup, CorporateDocumentsOptions } from "./CorporateDocumentsPopup";
import { TaxResidencyPopup, TaxResidencyOptions } from "./TaxResidencyPopup";

interface ServiceDefinition {
  id: string;
  icon: typeof Building2;
  title: string;
  description: string;
  contextLine: string;
  price: number;
  hasPopup: boolean;
}

// Service definitions
const STARTING_SERVICES: ServiceDefinition[] = [
  {
    id: "incorporation",
    icon: Building2,
    title: "Company Incorporation",
    description: "Standard Thai Co., Ltd. structure (most common setup).",
    contextLine: "Most companies start simple and adapt later if needed.",
    price: CORPORATE_PRICING.INCORPORATION,
    hasPopup: false,
  },
  {
    id: "registered-office",
    icon: MapPin,
    title: "Registered Office",
    description: "Official registered address of the company.",
    contextLine: "Required to register or operate a company in Thailand.",
    price: CORPORATE_PRICING.REGISTERED_OFFICE,
    hasPopup: true,
  },
];

const EXISTING_SERVICES: ServiceDefinition[] = [
  {
    id: "company-review",
    icon: FileSearch,
    title: "Company Review / Cleanup",
    description: "Reviewing current company status and registrations.",
    contextLine: "This service provides clarity, not corrections.",
    price: CORPORATE_PRICING.COMPANY_REVIEW,
    hasPopup: true,
  },
  {
    id: "structural-change",
    icon: Users,
    title: "Structural Change",
    description: "Changing directors, shareholders, or share ownership.",
    contextLine: "Used when control or ownership changes.",
    price: CORPORATE_PRICING.STRUCTURAL_CHANGE,
    hasPopup: false,
  },
  {
    id: "corporate-documents",
    icon: FileText,
    title: "Corporate Documents",
    description: "Requesting official company documents.",
    contextLine: "Used for banks, authorities, or legal procedures.",
    price: CORPORATE_PRICING.CORPORATE_DOCUMENTS,
    hasPopup: true,
  },
  {
    id: "tax-residency",
    icon: ScrollText,
    title: "Tax Residency Certificate",
    description: "Official tax residency confirmation.",
    contextLine: "Required for tax treaty benefits or foreign compliance.",
    price: CORPORATE_PRICING.TAX_RESIDENCY,
    hasPopup: true,
  },
];

export function CorporateServices() {
  const navigate = useNavigate();
  const { selectedCorporateServices, addCorporateService, removeCorporateService } = useServices();

  // Popup states
  const [registeredOfficeOpen, setRegisteredOfficeOpen] = useState(false);
  const [companyReviewOpen, setCompanyReviewOpen] = useState(false);
  const [corporateDocumentsOpen, setCorporateDocumentsOpen] = useState(false);
  const [taxResidencyOpen, setTaxResidencyOpen] = useState(false);

  const isSelected = (id: string) => selectedCorporateServices.some((s) => s.id === id);

  const toggleSimpleService = (service: ServiceDefinition) => {
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

  const handleCardClick = (service: ServiceDefinition) => {
    if (service.hasPopup) {
      openPopup(service.id);
    }
  };

  const handleButtonClick = (service: ServiceDefinition) => {
    if (service.hasPopup) {
      openPopup(service.id);
    } else {
      toggleSimpleService(service);
    }
  };

  const openPopup = (id: string) => {
    switch (id) {
      case "registered-office":
        setRegisteredOfficeOpen(true);
        break;
      case "company-review":
        setCompanyReviewOpen(true);
        break;
      case "corporate-documents":
        setCorporateDocumentsOpen(true);
        break;
      case "tax-residency":
        setTaxResidencyOpen(true);
        break;
    }
  };

  const handleRegisteredOfficeConfirm = (options: RegisteredOfficeOptions) => {
    removeCorporateService("registered-office");
    addCorporateService({
      id: "registered-office",
      name: `Registered Office (${options.type === "new" ? "new company" : "address change"})`,
      price: options.totalPrice,
    });
  };

  const handleCompanyReviewConfirm = (options: CompanyReviewOptions) => {
    removeCorporateService("company-review");
    addCorporateService({
      id: "company-review",
      name: "Company Review / Cleanup",
      price: options.totalPrice,
    });
  };

  const handleCorporateDocumentsConfirm = (options: CorporateDocumentsOptions) => {
    removeCorporateService("corporate-documents");
    addCorporateService({
      id: "corporate-documents",
      name: "Corporate Documents",
      price: options.totalPrice,
    });
  };

  const handleTaxResidencyConfirm = (options: TaxResidencyOptions) => {
    removeCorporateService("tax-residency");
    addCorporateService({
      id: "tax-residency",
      name: "Tax Residency Certificate",
      price: options.totalPrice,
    });
  };

  const totalPrice = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-12">
      {/* Section header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Corporate Services</h1>
        <p className="text-muted-foreground">
          One-time corporate actions. Select what applies.
        </p>
      </div>

      {/* LINE 1 — Starting a New Company */}
      <div className="space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Starting a New Company
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {STARTING_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              contextLine={service.contextLine}
              price={service.price}
              isSelected={isSelected(service.id)}
              onCardClick={() => handleCardClick(service)}
              onButtonClick={() => handleButtonClick(service)}
              hasPopup={service.hasPopup}
            />
          ))}
        </div>
      </div>

      {/* LINE 2 — Existing Company Services */}
      <div className="space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Existing Company Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXISTING_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              contextLine={service.contextLine}
              price={service.price}
              isSelected={isSelected(service.id)}
              onCardClick={() => handleCardClick(service)}
              onButtonClick={() => handleButtonClick(service)}
              hasPopup={service.hasPopup}
            />
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <p className="text-center text-xs text-muted-foreground/60">
        Advanced structures (e.g. BOI) usually make sense only after operations begin.
      </p>

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
                    <span className="font-medium">{formatUSD(s.price)}</span>
                  </div>
                ))}
              </div>
              
              {/* Divider and total */}
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">One-time total</span>
                  <div className="text-lg font-semibold">{formatUSD(totalPrice)}</div>
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

      {/* Popups */}
      <RegisteredOfficePopup
        open={registeredOfficeOpen}
        onOpenChange={setRegisteredOfficeOpen}
        onConfirm={handleRegisteredOfficeConfirm}
      />
      <CompanyReviewPopup
        open={companyReviewOpen}
        onOpenChange={setCompanyReviewOpen}
        onConfirm={handleCompanyReviewConfirm}
      />
      <CorporateDocumentsPopup
        open={corporateDocumentsOpen}
        onOpenChange={setCorporateDocumentsOpen}
        onConfirm={handleCorporateDocumentsConfirm}
      />
      <TaxResidencyPopup
        open={taxResidencyOpen}
        onOpenChange={setTaxResidencyOpen}
        onConfirm={handleTaxResidencyConfirm}
      />
    </div>
  );
}
