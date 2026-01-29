import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, FileSearch, Users, FileText, ScrollText } from "lucide-react";
import { useServices } from "@/contexts/ServiceContext";
import { CORPORATE_PRICING } from "@/lib/pricing";
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
  priceTHB: number;
  timeline: string;
  hasPopup: boolean;
}

// Service definitions
const STARTING_SERVICES: ServiceDefinition[] = [{
  id: "incorporation",
  icon: Building2,
  title: "Company Incorporation",
  description: "Standard Thai Co., Ltd. structure (most common setup).",
  contextLine: "Most companies start simple and adapt later if needed.",
  price: CORPORATE_PRICING.INCORPORATION,
  priceTHB: 52500,
  timeline: "Up to 1 week",
  hasPopup: false
}, {
  id: "registered-office",
  icon: MapPin,
  title: "Registered Office",
  description: "Official registered address of the company.",
  contextLine: "Required to register or operate a company in Thailand.",
  price: CORPORATE_PRICING.REGISTERED_OFFICE,
  priceTHB: 10500,
  timeline: "1–2 weeks",
  hasPopup: true
}];
const EXISTING_SERVICES: ServiceDefinition[] = [{
  id: "company-review",
  icon: FileSearch,
  title: "Company Review / Cleanup",
  description: "Reviewing current company status and registrations.",
  contextLine: "This service provides clarity, not corrections.",
  price: CORPORATE_PRICING.COMPANY_REVIEW,
  priceTHB: 17500,
  timeline: "1–4 weeks",
  hasPopup: true
}, {
  id: "structural-change",
  icon: Users,
  title: "Structural Change",
  description: "Changing directors, shareholders, or share ownership.",
  contextLine: "Used when control or ownership changes.",
  price: CORPORATE_PRICING.STRUCTURAL_CHANGE,
  priceTHB: 17500,
  timeline: "3–5 working days",
  hasPopup: false
}, {
  id: "corporate-documents",
  icon: FileText,
  title: "Corporate Documents",
  description: "Requesting official company documents.",
  contextLine: "Used for banks, authorities, or legal procedures.",
  price: CORPORATE_PRICING.CORPORATE_DOCUMENTS,
  priceTHB: 10500,
  timeline: "From 1 working day",
  hasPopup: true
}, {
  id: "tax-residency",
  icon: ScrollText,
  title: "Tax Residency Certificate",
  description: "Official tax residency confirmation.",
  contextLine: "Required for tax treaty benefits or foreign compliance.",
  price: CORPORATE_PRICING.TAX_RESIDENCY,
  priceTHB: 10500,
  timeline: "Up to 30 days",
  hasPopup: true
}];
export function CorporateServicesContent() {
  const {
    selectedCorporateServices,
    addCorporateService,
    removeCorporateService
  } = useServices();

  // Popup states
  const [registeredOfficeOpen, setRegisteredOfficeOpen] = useState(false);
  const [companyReviewOpen, setCompanyReviewOpen] = useState(false);
  const [corporateDocumentsOpen, setCorporateDocumentsOpen] = useState(false);
  const [taxResidencyOpen, setTaxResidencyOpen] = useState(false);
  const isSelected = (id: string) => selectedCorporateServices.some(s => s.id === id);
  const toggleSimpleService = (service: ServiceDefinition) => {
    if (isSelected(service.id)) {
      removeCorporateService(service.id);
    } else {
      addCorporateService({
        id: service.id,
        name: service.title,
        price: service.price
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
      price: options.totalPrice
    });
  };
  const handleCompanyReviewConfirm = (options: CompanyReviewOptions) => {
    removeCorporateService("company-review");
    addCorporateService({
      id: "company-review",
      name: "Company Review / Cleanup",
      price: options.totalPrice
    });
  };
  const handleCorporateDocumentsConfirm = (options: CorporateDocumentsOptions) => {
    removeCorporateService("corporate-documents");
    addCorporateService({
      id: "corporate-documents",
      name: "Corporate Documents",
      price: options.totalPrice
    });
  };
  const handleTaxResidencyConfirm = (options: TaxResidencyOptions) => {
    removeCorporateService("tax-residency");
    addCorporateService({
      id: "tax-residency",
      name: "Tax Residency Certificate",
      price: options.totalPrice
    });
  };

  return <div className="space-y-12">

      {/* LINE 1 — Starting a New Company */}
      <div className="space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Starting a New Company
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {STARTING_SERVICES.map(service => <ServiceCard key={service.id} icon={service.icon} title={service.title} description={service.description} contextLine={service.contextLine} price={service.price} priceTHB={service.priceTHB} timeline={service.timeline} isSelected={isSelected(service.id)} onCardClick={() => handleCardClick(service)} onButtonClick={() => handleButtonClick(service)} hasPopup={service.hasPopup} />)}
        </div>
      </div>

      {/* LINE 2 — Existing Company Services */}
      <div className="space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Existing Company Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXISTING_SERVICES.map(service => <ServiceCard key={service.id} icon={service.icon} title={service.title} description={service.description} contextLine={service.contextLine} price={service.price} priceTHB={service.priceTHB} timeline={service.timeline} isSelected={isSelected(service.id)} onCardClick={() => handleCardClick(service)} onButtonClick={() => handleButtonClick(service)} hasPopup={service.hasPopup} />)}
        </div>
      </div>

      {/* Bottom note */}
      <p className="text-center text-xs text-muted-foreground/60">
        Advanced structures (e.g. BOI) usually make sense only after operations begin.
      </p>
      {/* Popups */}
      <RegisteredOfficePopup open={registeredOfficeOpen} onOpenChange={setRegisteredOfficeOpen} onConfirm={handleRegisteredOfficeConfirm} />
      <CompanyReviewPopup open={companyReviewOpen} onOpenChange={setCompanyReviewOpen} onConfirm={handleCompanyReviewConfirm} />
      <CorporateDocumentsPopup open={corporateDocumentsOpen} onOpenChange={setCorporateDocumentsOpen} onConfirm={handleCorporateDocumentsConfirm} />
      <TaxResidencyPopup open={taxResidencyOpen} onOpenChange={setTaxResidencyOpen} onConfirm={handleTaxResidencyConfirm} />
    </div>;
}