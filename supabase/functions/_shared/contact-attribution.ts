export const contactUtmKeys = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
] as const;

export interface ContactAttribution {
  landing_path?: string;
  referrer_origin?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_id?: string;
}

// Accept campaign labels only, never arbitrary query strings or form fields.
export function sanitizeContactAttribution(raw: unknown): ContactAttribution {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const input = raw as Record<string, unknown>;
  const result: ContactAttribution = {};
  for (const key of contactUtmKeys) {
    const value = typeof input[key] === "string" ? input[key].trim() : "";
    if (/^[a-zA-Z0-9][a-zA-Z0-9._~ -]{0,119}$/.test(value)) result[key] = value;
  }
  if (typeof input.landing_path === "string" && /^\/[a-zA-Z0-9/_-]{0,199}$/.test(input.landing_path)) {
    result.landing_path = input.landing_path;
  }
  if (typeof input.referrer_origin === "string") {
    try {
      const url = new URL(input.referrer_origin);
      if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) {
        result.referrer_origin = url.origin;
      }
    } catch { /* Missing referrer is not a submission error. */ }
  }
  return result;
}
