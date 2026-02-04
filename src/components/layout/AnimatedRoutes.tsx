import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import { lazy, Suspense } from "react";

// Core pages
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Submit from "@/pages/Submit";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

// Services Calculator (legacy, now at /services/calculator)
import ServicesCalculator from "@/pages/Services";

// New SEO Services Index
import ServicesIndex from "@/pages/seo/ServicesIndex";

// Blog
import BlogIndex from "@/pages/blog/BlogIndex";
import BlogPost from "@/pages/blog/BlogPost";

// SEO Pages - Core Brand
import WhyPND50 from "@/pages/seo/WhyPND50";
import PND50CorporateTax from "@/pages/seo/PND50CorporateTax";

// SEO Pages - Branded Services
import PND50TaxFiling from "@/pages/seo/PND50TaxFiling";
import PND50BookkeepingServices from "@/pages/seo/PND50BookkeepingServices";
import PND50PayrollServices from "@/pages/seo/PND50PayrollServices";
import PND50BusinessAdvisory from "@/pages/seo/PND50BusinessAdvisory";
import PND50CompanyRegistration from "@/pages/seo/PND50CompanyRegistration";

// SEO Pages - Accounting & Bookkeeping
import AccountingServicesThailand from "@/pages/seo/AccountingServicesThailand";
import CorporateAccountingThailand from "@/pages/seo/CorporateAccountingThailand";
import BookkeepingServicesThailand from "@/pages/seo/BookkeepingServicesThailand";
import ThaiAccountingStandards from "@/pages/seo/ThaiAccountingStandards";
import AccountingFirmThailand from "@/pages/seo/AccountingFirmThailand";
import AccountantForForeignCompanies from "@/pages/seo/AccountantForForeignCompanies";

// SEO Pages - Tax & Compliance
import PND50TaxFilingThailand from "@/pages/seo/PND50TaxFilingThailand";
import CorporateIncomeTaxThailand from "@/pages/seo/CorporateIncomeTaxThailand";
import ThaiCorporateTaxCompliance from "@/pages/seo/ThaiCorporateTaxCompliance";
import TaxFilingServicesThailand from "@/pages/seo/TaxFilingServicesThailand";
import AnnualCorporateTaxReturn from "@/pages/seo/AnnualCorporateTaxReturn";
import ThaiTaxAdvisoryServices from "@/pages/seo/ThaiTaxAdvisoryServices";

// SEO Pages - Payroll
import PayrollServicesThailand from "@/pages/seo/PayrollServicesThailand";
import ThaiPayrollCompliance from "@/pages/seo/ThaiPayrollCompliance";
import EmployeePayrollManagement from "@/pages/seo/EmployeePayrollManagement";

// SEO Pages - Company Setup
import CompanyRegistrationThailand from "@/pages/seo/CompanyRegistrationThailand";
import BusinessSetupThailand from "@/pages/seo/BusinessSetupThailand";
import ForeignCompanyRegistration from "@/pages/seo/ForeignCompanyRegistration";
import BusinessAdvisoryServicesThailand from "@/pages/seo/BusinessAdvisoryServicesThailand";
import TaxPlanningThailand from "@/pages/seo/TaxPlanningThailand";

// SEO Pages - Foreigner Focused
import AccountantForForeignersThailand from "@/pages/seo/AccountantForForeignersThailand";
import EnglishSpeakingAccountantThailand from "@/pages/seo/EnglishSpeakingAccountantThailand";
import AccountingServicesForExpats from "@/pages/seo/AccountingServicesForExpats";
import TaxServicesForForeignBusinesses from "@/pages/seo/TaxServicesForForeignBusinesses";

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Core Pages */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/submit" element={<PageTransition><Submit /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/tos" element={<PageTransition><Terms /></PageTransition>} />

        {/* Services - New Index redirects to services list */}
        <Route path="/services" element={<PageTransition><ServicesIndex /></PageTransition>} />
        <Route path="/services/calculator" element={<PageTransition><ServicesCalculator /></PageTransition>} />
        
        {/* Legacy service section redirects */}
        <Route path="/corporate" element={<Navigate to="/services/calculator#corporate" replace />} />
        <Route path="/accounting" element={<Navigate to="/services/calculator#accounting" replace />} />
        <Route path="/consulting" element={<Navigate to="/services/calculator#consulting" replace />} />

        {/* Blog */}
        <Route path="/blog" element={<PageTransition><BlogIndex /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />

        {/* Core Brand Pages */}
        <Route path="/pnd50-thailand" element={<PageTransition><WhyPND50 /></PageTransition>} />
        <Route path="/pnd50-corporate-tax" element={<PageTransition><PND50CorporateTax /></PageTransition>} />

        {/* Branded Service Pages */}
        <Route path="/pnd50-tax-filing" element={<PageTransition><PND50TaxFiling /></PageTransition>} />
        <Route path="/pnd50-bookkeeping-services" element={<PageTransition><PND50BookkeepingServices /></PageTransition>} />
        <Route path="/pnd50-payroll-services" element={<PageTransition><PND50PayrollServices /></PageTransition>} />
        <Route path="/pnd50-business-advisory" element={<PageTransition><PND50BusinessAdvisory /></PageTransition>} />
        <Route path="/pnd50-company-registration" element={<PageTransition><PND50CompanyRegistration /></PageTransition>} />

        {/* Accounting & Bookkeeping Pages */}
        <Route path="/accounting-services-thailand" element={<PageTransition><AccountingServicesThailand /></PageTransition>} />
        <Route path="/corporate-accounting-thailand" element={<PageTransition><CorporateAccountingThailand /></PageTransition>} />
        <Route path="/bookkeeping-services-thailand" element={<PageTransition><BookkeepingServicesThailand /></PageTransition>} />
        <Route path="/thai-accounting-standards" element={<PageTransition><ThaiAccountingStandards /></PageTransition>} />
        <Route path="/accounting-firm-thailand" element={<PageTransition><AccountingFirmThailand /></PageTransition>} />
        <Route path="/accountant-for-foreign-companies" element={<PageTransition><AccountantForForeignCompanies /></PageTransition>} />

        {/* Tax & Compliance Pages */}
        <Route path="/pnd50-tax-filing-thailand" element={<PageTransition><PND50TaxFilingThailand /></PageTransition>} />
        <Route path="/corporate-income-tax-thailand" element={<PageTransition><CorporateIncomeTaxThailand /></PageTransition>} />
        <Route path="/thai-corporate-tax-compliance" element={<PageTransition><ThaiCorporateTaxCompliance /></PageTransition>} />
        <Route path="/tax-filing-services-thailand" element={<PageTransition><TaxFilingServicesThailand /></PageTransition>} />
        <Route path="/annual-corporate-tax-return" element={<PageTransition><AnnualCorporateTaxReturn /></PageTransition>} />
        <Route path="/thai-tax-advisory-services" element={<PageTransition><ThaiTaxAdvisoryServices /></PageTransition>} />

        {/* Payroll Pages */}
        <Route path="/payroll-services-thailand" element={<PageTransition><PayrollServicesThailand /></PageTransition>} />
        <Route path="/thai-payroll-compliance" element={<PageTransition><ThaiPayrollCompliance /></PageTransition>} />
        <Route path="/employee-payroll-management" element={<PageTransition><EmployeePayrollManagement /></PageTransition>} />

        {/* Company Setup Pages */}
        <Route path="/company-registration-thailand" element={<PageTransition><CompanyRegistrationThailand /></PageTransition>} />
        <Route path="/business-setup-thailand" element={<PageTransition><BusinessSetupThailand /></PageTransition>} />
        <Route path="/foreign-company-registration" element={<PageTransition><ForeignCompanyRegistration /></PageTransition>} />
        <Route path="/business-advisory-services-thailand" element={<PageTransition><BusinessAdvisoryServicesThailand /></PageTransition>} />
        <Route path="/tax-planning-thailand" element={<PageTransition><TaxPlanningThailand /></PageTransition>} />

        {/* Foreigner-Focused Pages */}
        <Route path="/accountant-for-foreigners-thailand" element={<PageTransition><AccountantForForeignersThailand /></PageTransition>} />
        <Route path="/english-speaking-accountant-thailand" element={<PageTransition><EnglishSpeakingAccountantThailand /></PageTransition>} />
        <Route path="/accounting-services-for-expats" element={<PageTransition><AccountingServicesForExpats /></PageTransition>} />
        <Route path="/tax-services-for-foreign-businesses" element={<PageTransition><TaxServicesForForeignBusinesses /></PageTransition>} />

        {/* Catch-all 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
