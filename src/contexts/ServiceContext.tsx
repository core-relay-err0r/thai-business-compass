import React, { createContext, useContext, useState, ReactNode } from "react";
import { AccountingInputs, AccountingResult, calculateAccountingCost } from "@/lib/pricing";

export interface CorporateService {
  id: string;
  name: string;
  price: number;
}

export interface ConsultingService {
  id: string;
  name: string;
  priceRange: { min: number; max: number };
  timeline: string;
}

interface ServiceState {
  // Accounting
  accountingInputs: Partial<AccountingInputs>;
  accountingResult: AccountingResult | null;
  
  // Corporate
  selectedCorporateServices: CorporateService[];
  
  // Consulting
  selectedConsultingServices: ConsultingService[];
  
  // Contact
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    preferredContact: "email" | "phone" | "whatsapp";
  };
  
  companyInfo: {
    companyName: string;
    registrationNumber: string;
    industry: string;
  };
  
  notes: string;
}

interface ServiceContextType extends ServiceState {
  setAccountingInputs: (inputs: Partial<AccountingInputs>) => void;
  calculateAccounting: () => void;
  addCorporateService: (service: CorporateService) => void;
  removeCorporateService: (id: string) => void;
  addConsultingService: (service: ConsultingService) => void;
  removeConsultingService: (id: string) => void;
  setContactInfo: (info: Partial<ServiceState["contactInfo"]>) => void;
  setCompanyInfo: (info: Partial<ServiceState["companyInfo"]>) => void;
  setNotes: (notes: string) => void;
  clearAll: () => void;
  generateSummary: () => string;
}

const initialState: ServiceState = {
  accountingInputs: {},
  accountingResult: null,
  selectedCorporateServices: [],
  selectedConsultingServices: [],
  contactInfo: {
    name: "",
    email: "",
    phone: "",
    preferredContact: "email",
  },
  companyInfo: {
    companyName: "",
    registrationNumber: "",
    industry: "",
  },
  notes: "",
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ServiceState>(initialState);

  const setAccountingInputs = (inputs: Partial<AccountingInputs>) => {
    setState((prev) => ({
      ...prev,
      accountingInputs: { ...prev.accountingInputs, ...inputs },
    }));
  };

  const calculateAccounting = () => {
    const inputs = state.accountingInputs as AccountingInputs;
    if (inputs.revenueRange && inputs.vatRegistered && inputs.transactionVolume && inputs.yearEndStatements && inputs.auditRequired && inputs.accountingIntent) {
      const result = calculateAccountingCost(inputs);
      setState((prev) => ({ ...prev, accountingResult: result }));
    }
  };

  const addCorporateService = (service: CorporateService) => {
    setState((prev) => ({
      ...prev,
      selectedCorporateServices: prev.selectedCorporateServices.some((s) => s.id === service.id)
        ? prev.selectedCorporateServices
        : [...prev.selectedCorporateServices, service],
    }));
  };

  const removeCorporateService = (id: string) => {
    setState((prev) => ({
      ...prev,
      selectedCorporateServices: prev.selectedCorporateServices.filter((s) => s.id !== id),
    }));
  };

  const addConsultingService = (service: ConsultingService) => {
    setState((prev) => ({
      ...prev,
      selectedConsultingServices: prev.selectedConsultingServices.some((s) => s.id === service.id)
        ? prev.selectedConsultingServices
        : [...prev.selectedConsultingServices, service],
    }));
  };

  const removeConsultingService = (id: string) => {
    setState((prev) => ({
      ...prev,
      selectedConsultingServices: prev.selectedConsultingServices.filter((s) => s.id !== id),
    }));
  };

  const setContactInfo = (info: Partial<ServiceState["contactInfo"]>) => {
    setState((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, ...info },
    }));
  };

  const setCompanyInfo = (info: Partial<ServiceState["companyInfo"]>) => {
    setState((prev) => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...info },
    }));
  };

  const setNotes = (notes: string) => {
    setState((prev) => ({ ...prev, notes }));
  };

  const clearAll = () => {
    setState(initialState);
  };

  const generateSummary = (): string => {
    const lines: string[] = [];
    lines.push("=== PND50 Service Request ===\n");

    // Contact
    lines.push("CONTACT INFORMATION");
    lines.push(`Name: ${state.contactInfo.name}`);
    lines.push(`Email: ${state.contactInfo.email}`);
    if (state.contactInfo.phone) lines.push(`Phone: ${state.contactInfo.phone}`);
    lines.push(`Preferred contact: ${state.contactInfo.preferredContact}\n`);

    // Company
    lines.push("COMPANY INFORMATION");
    lines.push(`Company: ${state.companyInfo.companyName}`);
    if (state.companyInfo.registrationNumber) lines.push(`Registration: ${state.companyInfo.registrationNumber}`);
    if (state.companyInfo.industry) lines.push(`Industry: ${state.companyInfo.industry}\n`);

    // Accounting
    if (state.accountingResult) {
      lines.push("ACCOUNTING SERVICES");
      lines.push(`Monthly estimate: ฿${state.accountingResult.totalMonthly.toLocaleString()}`);
      lines.push(`Annual estimate: ฿${state.accountingResult.totalAnnual.toLocaleString()}`);
      lines.push(`Required items: ${state.accountingResult.requiredItems.join(", ")}\n`);
    }

    // Corporate
    if (state.selectedCorporateServices.length > 0) {
      lines.push("CORPORATE SERVICES");
      state.selectedCorporateServices.forEach((s) => {
        lines.push(`- ${s.name}: ฿${s.price.toLocaleString()}`);
      });
      const corpTotal = state.selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
      lines.push(`Total: ฿${corpTotal.toLocaleString()}\n`);
    }

    // Consulting
    if (state.selectedConsultingServices.length > 0) {
      lines.push("CONSULTING SERVICES");
      state.selectedConsultingServices.forEach((s) => {
        lines.push(`- ${s.name}: ฿${s.priceRange.min.toLocaleString()}–${s.priceRange.max.toLocaleString()}`);
      });
      lines.push("");
    }

    // Notes
    if (state.notes) {
      lines.push("ADDITIONAL NOTES");
      lines.push(state.notes);
    }

    return lines.join("\n");
  };

  return (
    <ServiceContext.Provider
      value={{
        ...state,
        setAccountingInputs,
        calculateAccounting,
        addCorporateService,
        removeCorporateService,
        addConsultingService,
        removeConsultingService,
        setContactInfo,
        setCompanyInfo,
        setNotes,
        clearAll,
        generateSummary,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
}
