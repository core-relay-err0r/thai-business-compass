import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, FileSearch, Users, FileText, ScrollText, ArrowRight, Sparkles, Settings } from "lucide-react";
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
  priceTHB: number;
  timeline: string;
  hasPopup: boolean;
}

// Service definitions
const STARTING_SERVICES: ServiceDefinition[] = [
  {
    id: "incorporation",
    icon: Building2,
    title: "Company Incorporation",
    description: "Prepare and file a standard Thai Co., Ltd. incorporation based on the agreed shareholder, director, capital, and activity details.",
    contextLine: "Licences, BOI promotion, visas, work permits, and non-standard ownership structures are assessed separately.",
    price: CORPORATE_PRICING.INCORPORATION,
    priceTHB: CORPORATE_PRICING.INCORPORATION * 35,
    timeline: "Up to 1 week",
    hasPopup: false,
  },
  {
    id: "registered-office",
    icon: MapPin,
    title: "Registered Office",
    description: "Coordinate a registered-address filing for a new company or an existing company’s address change.",
    contextLine: "Address availability and any landlord or authority documents are confirmed before filing.",
    price: CORPORATE_PRICING.REGISTERED_OFFICE,
    priceTHB: CORPORATE_PRICING.REGISTERED_OFFICE * 35,
    timeline: "1–2 weeks",
    hasPopup: true,
  },
];

const EXISTING_SERVICES: ServiceDefinition[] = [
  {
    id: "company-review",
    icon: FileSearch,
    title: "Company Review / Cleanup",
    description: "Check available corporate records and selected registrations, then identify gaps that need follow-up.",
    contextLine: "The base review reports findings; corrections, filings, and legal opinions are quoted separately.",
    price: CORPORATE_PRICING.COMPANY_REVIEW,
    priceTHB: CORPORATE_PRICING.COMPANY_REVIEW * 35,
    timeline: "1–4 weeks",
    hasPopup: true,
  },
  {
    id: "structural-change",
    icon: Users,
    title: "Structural Change",
    description: "Prepare the agreed corporate resolutions and filings for a director, shareholder, or share-ownership change.",
    contextLine: "Final scope depends on the change, supporting documents, and any restricted-business implications.",
    price: CORPORATE_PRICING.STRUCTURAL_CHANGE,
    priceTHB: CORPORATE_PRICING.STRUCTURAL_CHANGE * 35,
    timeline: "3–5 working days",
    hasPopup: false,
  },
  {
    id: "corporate-documents",
    icon: FileText,
    title: "Corporate Documents",
    description: "Obtain the agreed current company documents, with translation or legalization added when needed.",
    contextLine: "Document type, issuing authority, destination, and certification level are confirmed first.",
    price: CORPORATE_PRICING.CORPORATE_DOCUMENTS,
    priceTHB: CORPORATE_PRICING.CORPORATE_DOCUMENTS * 35,
    timeline: "From 1 working day",
    hasPopup: true,
  },
  {
    id: "tax-residency",
    icon: ScrollText,
    title: "Tax Residency Certificate",
    description: "Prepare and submit a Thai tax residency certificate request with the available supporting records.",
    contextLine: "Issuance and treaty eligibility depend on the Revenue Department, the period, and the applicant’s facts.",
    price: CORPORATE_PRICING.TAX_RESIDENCY,
    priceTHB: CORPORATE_PRICING.TAX_RESIDENCY * 35,
    timeline: "Up to 30 days",
    hasPopup: true,
  },
];

const SECTIONS = [
  {
    id: "starting",
    icon: Sparkles,
    title: "Starting a New Company",
    description: "Foundation services for registering and establishing your Thai Co., Ltd.",
  },
  {
    id: "existing",
    icon: Settings,
    title: "Existing Company Services",
    description: "Maintenance, updates, and documentation for companies already operating.",
  },
];

// Embeddable content component (used by /services page)
export function CorporateServicesContent() {
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
    <div className="space-y-12 sm:space-y-16">
      {/* Starting a New Company */}
      <div>
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Starting a New Company</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Defined filing support for a standard Thai Co., Ltd. Prices cover the stated scope; authority fees, eligibility checks, and non-standard work may be additional.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {STARTING_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              contextLine={service.contextLine}
              price={service.price}
              priceTHB={service.priceTHB}
              timeline={service.timeline}
              isSelected={isSelected(service.id)}
              onCardClick={() => handleCardClick(service)}
              onButtonClick={() => handleButtonClick(service)}
              hasPopup={service.hasPopup}
            />
          ))}
        </div>
      </div>

      {/* Existing Company Services */}
      <div>
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
            <Settings className="h-4 w-4" />
            <span>Existing Company Services</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Maintenance, updates, and documentation for companies already operating.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {EXISTING_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              contextLine={service.contextLine}
              price={service.price}
              priceTHB={service.priceTHB}
              timeline={service.timeline}
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

// Legacy export for backward compatibility
export function CorporateServices() {
  return <CorporateServicesContent />;
}
