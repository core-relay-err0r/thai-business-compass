import type { LeadEventInput } from "./lead-router.ts";
import { sanitizeContactAttribution, type ContactAttribution } from "./contact-attribution.ts";

interface SubmissionRequest {
  contactInfo: { name: string; email: string; phone?: string; preferredContact: string };
  companyInfo: { companyName: string };
  notes?: string;
  accountingResult?: { totalMonthly: number };
  selectedCorporateServices?: Array<{ name: string }>;
  selectedConsultingServices?: Array<{ name: string }>;
}

interface ContactRequest {
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  companyName?: string;
  message: string;
  attribution?: ContactAttribution;
}

function compact(value: unknown, maxLength: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function estimatedValue(totalMonthly: number | undefined): LeadEventInput["estimated_value"] {
  if (!Number.isFinite(totalMonthly)) return "unknown";
  if (Number(totalMonthly) >= 50000) return "high";
  if (Number(totalMonthly) >= 15000) return "medium";
  return "low";
}

export function buildSubmissionLeadEvent(
  data: SubmissionRequest,
  createdAt = new Date().toISOString(),
): LeadEventInput {
  const serviceNames = [
    ...(data.accountingResult ? ["Accounting services"] : []),
    ...(data.selectedCorporateServices ?? []).map((service) => service.name),
    ...(data.selectedConsultingServices ?? []).map((service) => service.name),
  ].map((name) => compact(name, 80));
  const serviceSummary = serviceNames.slice(0, 5).join(", ") || "Service consultation";
  const notes = compact(data.notes, 160);

  return {
    created_at: createdAt,
    source_project: "PND50 / Thai Business Compass",
    source_channel: "website_form",
    source_url: "https://pnd50.com/submit",
    source_route: "/functions/v1/send-submission",
    lead_name: data.contactInfo.name,
    lead_email: data.contactInfo.email,
    lead_phone: data.contactInfo.phone,
    company: data.companyInfo.companyName,
    message: compact(
      `Service request: ${serviceSummary}.${notes ? ` Notes: ${notes}` : ""}`,
      300,
    ),
    detected_intent: data.accountingResult ? "accounting" : "quote_request",
    estimated_value: estimatedValue(data.accountingResult?.totalMonthly),
    metadata: {
      event_type: "service_request",
      preferred_contact: compact(data.contactInfo.preferredContact, 50),
      service_selected: serviceNames.length > 0,
      services: serviceNames.slice(0, 10),
    },
  };
}

export function buildContactLeadEvent(
  data: ContactRequest,
  createdAt = new Date().toISOString(),
): LeadEventInput {
  return {
    created_at: createdAt,
    source_project: "PND50 / Thai Business Compass",
    source_channel: "website_form",
    source_url: "https://pnd50.com/contact",
    source_route: "/functions/v1/send-contact",
    lead_name: data.fullName,
    lead_email: data.email,
    lead_phone: data.phone || data.whatsapp,
    company: data.companyName,
    message: compact(data.message, 300),
    detected_intent: "unknown",
    estimated_value: "unknown",
    metadata: {
      event_type: "contact_request",
      has_whatsapp: Boolean(data.whatsapp),
      attribution: sanitizeContactAttribution(data.attribution),
    },
  };
}
