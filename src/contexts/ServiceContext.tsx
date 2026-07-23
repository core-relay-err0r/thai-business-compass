import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { AccountingInputs, AccountingResult, calculateAccountingCost } from "@/lib/pricing";

export interface CorporateService {
  id: string;
  name: string;
  price: number;
}

export interface ConsultingService {
  id: string;
  name: string;
  price: number;
  isFrom: boolean;
  timeline: string;
  note?: string;
}

export interface AIRecommendation {
  summary: string;
  corporateServices: CorporateService[];
  accountingInputs: Partial<AccountingInputs> | null;
  consultingServices: ConsultingService[];
  notes: string[];
  confidence: "high" | "medium" | "low";
  keyDrivers?: string[];
  assumptions?: string[];
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
  applyRecommendation: (rec: AIRecommendation) => void;
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

  const applyRecommendation = (rec: AIRecommendation) => {
    setState((prev) => {
      const next: ServiceState = {
        ...prev,
        selectedCorporateServices: rec.corporateServices,
        selectedConsultingServices: rec.consultingServices,
      };
      if (rec.accountingInputs) {
        const merged = {
          accountingIntent: "full",
          revenueRange: "5k-50k",
          vatRegistered: "no",
          employeeCount: 0,
          employeePurpose: "operations",
          payrollNeeded: false,
          transactionVolume: "low",
          recurringWHT: "no",
          yearEndStatements: "yes",
          auditRequired: "no",
          catchupBacklog: "no",
          rushFee: false,
          ...rec.accountingInputs,
        } as AccountingInputs;
        const result = calculateAccountingCost(merged);
        next.accountingInputs = merged;
        next.accountingResult = result;
        next.liveAccountingResult = result;
      }
      return next;
    });
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
        lines.push("\nACCOUNTING");
        if (state.accountingResult!.isCustomQuote) {
          lines.push("   Price: Custom quote required");
        } else {
          if (state.accountingResult!.monthlyBase > 0) {
            lines.push(`   Monthly recurring: $${state.accountingResult!.totalMonthly.toLocaleString()}`);
          }
          lines.push(`   Estimated first year: $${state.accountingResult!.totalAnnual.toLocaleString()}`);
        }
        lines.push(`   Required: ${state.accountingResult!.requiredItems.join(", ")}`);
      }

      // Corporate
      if (hasCorporateData) {
        lines.push("\nCORPORATE SERVICES");
        state.selectedCorporateServices.forEach((s) => {
          lines.push(`   • ${s.name}: $${s.price.toLocaleString()}`);
        });
        const corpTotal = state.selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
        lines.push(`   Total: $${corpTotal.toLocaleString()}`);
      }

      // Consulting
      if (hasConsultingData) {
        lines.push("\nBUSINESS CONSULTING");
        state.selectedConsultingServices.forEach((s) => {
          const prefix = s.isFrom ? "From " : "";
          lines.push(`   • ${s.name}: ${prefix}$${s.price.toLocaleString()}`);
        });
        const consultingTotal = state.selectedConsultingServices.reduce((sum, s) => sum + s.price, 0);
        const hasFromItems = state.selectedConsultingServices.some((s) => s.isFrom);
        lines.push(`   Total: ${hasFromItems ? "From " : ""}$${consultingTotal.toLocaleString()}`);
      }

      // Cost summary
      lines.push("\n" + "─".repeat(40));
      lines.push("COST SUMMARY");
      lines.push("─".repeat(40));

      const corporateTotal = state.selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
      const consultingTotal = state.selectedConsultingServices.reduce((sum, s) => sum + s.price, 0);
      const hasFromItems = state.selectedConsultingServices.some((s) => s.isFrom);
      const monthlyFee = state.accountingResult?.totalMonthly ?? 0;
      const annualFees = state.accountingResult?.annualAddons.reduce((sum, a) => sum + a.amount, 0) ?? 0;

      // Initial Payment
      if (hasCorporateData || hasConsultingData) {
        lines.push("\nINITIAL PAYMENT (due at engagement start)");
        if (hasCorporateData) {
          lines.push(`   Corporate Services: $${corporateTotal.toLocaleString()}`);
        }
        if (hasConsultingData) {
          lines.push(`   Consulting: ${hasFromItems ? "From " : ""}$${consultingTotal.toLocaleString()}`);
        }
        if (hasCorporateData && hasConsultingData) {
          const initialTotal = corporateTotal + consultingTotal;
          lines.push(`   Initial Total: ${hasFromItems ? "From " : ""}$${initialTotal.toLocaleString()}`);
        }
      }

      // Monthly Recurring
      if (hasAccountingData && state.accountingResult!.monthlyBase > 0 && !state.accountingResult!.isCustomQuote) {
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
        lines.push(`   Annual fees subtotal: $${annualFees.toLocaleString()}`);
      }

      // Grand Total
      const firstYearTotal = corporateTotal + consultingTotal + (monthlyFee * 12) + annualFees;

      lines.push("\n" + "═".repeat(40));
      lines.push(
        state.accountingResult?.isCustomQuote
          ? "FIRST-YEAR ESTIMATE: Custom quote required"
          : `FIRST-YEAR ESTIMATE: ${hasFromItems || state.accountingResult?.annualAddons.some((a) => a.isFrom) ? "From " : ""}$${firstYearTotal.toLocaleString()}`
      );
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
        applyRecommendation,
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
