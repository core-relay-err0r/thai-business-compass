import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { AccountingInputs, AccountingResult } from "@/lib/pricing";

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
  liveAccountingResult: AccountingResult | null;
  
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
  setLiveAccountingResult: (result: AccountingResult | null) => void;
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
  liveAccountingResult: null,
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

  const setLiveAccountingResult = useCallback((result: AccountingResult | null) => {
    setState((prev) => ({
      ...prev,
      liveAccountingResult: result,
      accountingResult: result,
    }));
  }, []);

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
    if (state.companyInfo.industry) lines.push(`Industry: ${state.companyInfo.industry}`);
    lines.push("");

    // Selected Services Section
    const hasAccountingData = !!state.accountingResult;
    const hasCorporateData = state.selectedCorporateServices.length > 0;
    const hasConsultingData = state.selectedConsultingServices.length > 0;

    if (hasAccountingData || hasCorporateData || hasConsultingData) {
      lines.push("SELECTED SERVICES");
      lines.push("─".repeat(40));

      // Accounting
      if (hasAccountingData) {
        lines.push("\n📊 Accounting Services");
        lines.push(`   Monthly: $${state.accountingResult!.totalMonthly.toLocaleString()}`);
        lines.push(`   Annual: $${state.accountingResult!.totalAnnual.toLocaleString()}`);
        lines.push(`   Required: ${state.accountingResult!.requiredItems.join(", ")}`);
      }

      // Corporate
      if (hasCorporateData) {
        lines.push("\n🏢 Corporate Services");
        state.selectedCorporateServices.forEach((s) => {
          lines.push(`   • ${s.name}: $${s.price.toLocaleString()}`);
        });
        const corpTotal = state.selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
        lines.push(`   Total: $${corpTotal.toLocaleString()}`);
      }

      // Consulting
      if (hasConsultingData) {
        lines.push("\n💼 Consulting Services");
        state.selectedConsultingServices.forEach((s) => {
          lines.push(`   • ${s.name}: $${s.priceRange.min.toLocaleString()}–$${s.priceRange.max.toLocaleString()}`);
        });
        const consultingMin = state.selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.min, 0);
        const consultingMax = state.selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.max, 0);
        lines.push(`   Total: $${consultingMin.toLocaleString()}–$${consultingMax.toLocaleString()}`);
      }

      // Payment Summary
      lines.push("\n" + "─".repeat(40));
      lines.push("PAYMENT SUMMARY");
      lines.push("─".repeat(40));

      const corporateTotal = state.selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
      const consultingMin = state.selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.min, 0);
      const consultingMax = state.selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.max, 0);
      const monthlyFee = state.accountingResult?.totalMonthly ?? 0;
      const annualFees = state.accountingResult?.annualAddons.reduce((sum, a) => sum + a.amount, 0) ?? 0;

      // Initial Payment
      if (hasCorporateData || hasConsultingData) {
        lines.push("\nINITIAL PAYMENT (due at engagement start)");
        if (hasCorporateData) {
          lines.push(`   Corporate Services: $${corporateTotal.toLocaleString()}`);
        }
        if (hasConsultingData) {
          lines.push(`   Consulting (indicative): $${consultingMin.toLocaleString()}–$${consultingMax.toLocaleString()}`);
        }
        if (hasCorporateData && hasConsultingData) {
          const initialMin = corporateTotal + consultingMin;
          const initialMax = corporateTotal + consultingMax;
          lines.push(`   Initial Total: $${initialMin.toLocaleString()}–$${initialMax.toLocaleString()}`);
        }
      }

      // Monthly Recurring
      if (hasAccountingData) {
        lines.push("\nMONTHLY RECURRING");
        lines.push(`   Accounting Services: $${monthlyFee.toLocaleString()}/month`);
        lines.push(`   First Year (12 months): $${(monthlyFee * 12).toLocaleString()}`);
      }

      // Annual Fees
      if (hasAccountingData && state.accountingResult!.annualAddons.length > 0) {
        lines.push("\nANNUAL FEES (due at year-end)");
        state.accountingResult!.annualAddons.forEach((addon) => {
          lines.push(`   ${addon.name}: $${addon.amount.toLocaleString()}`);
        });
        lines.push(`   Annual Total: $${annualFees.toLocaleString()}`);
      }

      // Grand Total
      const firstYearMin = corporateTotal + consultingMin + (monthlyFee * 12) + annualFees;
      const firstYearMax = corporateTotal + consultingMax + (monthlyFee * 12) + annualFees;
      const hasRange = consultingMax > consultingMin;

      lines.push("\n" + "═".repeat(40));
      if (hasRange) {
        lines.push(`ESTIMATED FIRST-YEAR TOTAL: $${firstYearMin.toLocaleString()}–$${firstYearMax.toLocaleString()}`);
      } else {
        lines.push(`ESTIMATED FIRST-YEAR TOTAL: $${firstYearMin.toLocaleString()}`);
      }
      lines.push("═".repeat(40));
      lines.push("\nNote: Final pricing confirmed after initial consultation.");
      if (hasConsultingData) {
        lines.push("Consulting fees scoped based on specific requirements.");
      }
    }

    // Notes
    if (state.notes) {
      lines.push("\n" + "─".repeat(40));
      lines.push("ADDITIONAL NOTES");
      lines.push(state.notes);
    }

    lines.push("\n─".repeat(40));
    lines.push("Generated from PND50 Service Calculator");
    lines.push("https://scope-guide-thailand.lovable.app");

    return lines.join("\n");
  };

  return (
    <ServiceContext.Provider
      value={{
        ...state,
        setAccountingInputs,
        setLiveAccountingResult,
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
