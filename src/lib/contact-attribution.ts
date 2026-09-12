import { contactUtmKeys, sanitizeContactAttribution, type ContactAttribution } from "../../supabase/functions/_shared/contact-attribution";

// Tab-lifetime first touch only. No new cookies or persistent storage.
let firstTouch: ContactAttribution | undefined;

export function captureContactAttribution(): ContactAttribution {
  if (!firstTouch) {
    const url = new URL(window.location.href);
    firstTouch = sanitizeContactAttribution({
      landing_path: url.pathname,
      referrer_origin: document.referrer,
      ...Object.fromEntries(contactUtmKeys.map((key) => [key, url.searchParams.get(key)])),
    });
  }
  return { ...firstTouch };
}

type ContactEvent = "contact_form_start" | "contact_form_invalid" | "contact_form_submit" | "contact_form_success" | "contact_form_error" | "contact_email_click" | "contact_phone_click";

export function trackContactEvent(event: ContactEvent): void {
  // Existing integrations only. Analytics must never block the enquiry.
  try { window.clarity?.("event", event); } catch { /* Optional analytics. */ }
  try { window.dataLayer?.push({ event, form_id: "pnd50_contact" }); } catch { /* Optional analytics. */ }
}
