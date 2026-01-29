import { useState, useEffect, useRef } from "react";
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
    description: "Standard Thai Co., Ltd. structure (most common setup).",
    contextLine: "Most companies start simple and adapt later if needed.",
    price: CORPORATE_PRICING.INCORPORATION,
    priceTHB: 52500,
    timeline: "Up to 1 week",
    hasPopup: false,
  },
  {
    id: "registered-office",
    icon: MapPin,
    title: "Registered Office",
    description: "Official registered address of the company.",
    contextLine: "Required to register or operate a company in Thailand.",
    price: CORPORATE_PRICING.REGISTERED_OFFICE,
    priceTHB: 10500,
    timeline: "1–2 weeks",
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
    priceTHB: 17500,
    timeline: "1–4 weeks",
    hasPopup: true,
  },
  {
    id: "structural-change",
    icon: Users,
    title: "Structural Change",
    description: "Changing directors, shareholders, or share ownership.",
    contextLine: "Used when control or ownership changes.",
    price: CORPORATE_PRICING.STRUCTURAL_CHANGE,
    priceTHB: 17500,
    timeline: "3–5 working days",
    hasPopup: false,
  },
  {
    id: "corporate-documents",
    icon: FileText,
    title: "Corporate Documents",
    description: "Requesting official company documents.",
    contextLine: "Used for banks, authorities, or legal procedures.",
    price: CORPORATE_PRICING.CORPORATE_DOCUMENTS,
    priceTHB: 10500,
    timeline: "From 1 working day",
    hasPopup: true,
  },
  {
    id: "tax-residency",
    icon: ScrollText,
    title: "Tax Residency Certificate",
    description: "Official tax residency confirmation.",
    contextLine: "Required for tax treaty benefits or foreign compliance.",
    price: CORPORATE_PRICING.TAX_RESIDENCY,
    priceTHB: 10500,
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

export function CorporateServices() {
  const navigate = useNavigate();
  const { selectedCorporateServices, addCorporateService, removeCorporateService } = useServices();
  const [activeSection, setActiveSection] = useState("starting");
  
  const startingRef = useRef<HTMLDivElement>(null);
  const existingRef = useRef<HTMLDivElement>(null);

  // Popup states
  const [registeredOfficeOpen, setRegisteredOfficeOpen] = useState(false);
  const [companyReviewOpen, setCompanyReviewOpen] = useState(false);
  const [corporateDocumentsOpen, setCorporateDocumentsOpen] = useState(false);
  const [taxResidencyOpen, setTaxResidencyOpen] = useState(false);

  // Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const startingTop = startingRef.current?.getBoundingClientRect().top ?? 0;
      const existingTop = existingRef.current?.getBoundingClientRect().top ?? 0;
      
      // Determine which section is more in view
      if (existingTop <= 200) {
        setActiveSection("existing");
      } else {
        setActiveSection("starting");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  const currentSection = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="relative">
      {/* Main layout with sticky sidebar */}
      <div className="flex gap-12 lg:gap-16">
        {/* Left sticky sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-32">
            <div className="space-y-6">
              {/* Current section indicator */}
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <currentSection.icon className="h-4 w-4" />
                <span>Current section</span>
              </div>
              
              {/* Section title */}
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {currentSection.title}
              </h2>
              
              {/* Section description */}
              <p className="text-muted-foreground">
                {currentSection.description}
              </p>

              {/* Section navigation */}
              <div className="pt-4 space-y-2">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      const ref = section.id === "starting" ? startingRef : existingRef;
                      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right scrollable content */}
        <div className="flex-1 min-w-0 space-y-16">
          {/* Starting a New Company */}
          <div ref={startingRef} className="scroll-mt-32">
            {/* Mobile section header */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Starting a New Company</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Foundation services for registering and establishing your Thai Co., Ltd.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
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
          <div ref={existingRef} className="scroll-mt-32">
            {/* Mobile section header */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                <Settings className="h-4 w-4" />
                <span>Existing Company Services</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Maintenance, updates, and documentation for companies already operating.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
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
          <p className="text-center text-xs text-muted-foreground/60 pb-8">
            Advanced structures (e.g. BOI) usually make sense only after operations begin.
          </p>
        </div>
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
