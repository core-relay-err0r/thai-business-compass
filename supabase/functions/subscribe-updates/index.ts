import {
  cleanOptional,
  getAdminClient,
  hasValidRelayKey,
  jsonResponse,
} from "../_shared/subscription-store.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERESTS = new Set([
  "bookkeeping",
  "tax_filing",
  "vat",
  "withholding_tax",
  "payroll",
  "company_registration",
  "corporate_changes",
  "general_thailand_compliance",
]);
const SIGNUP_LOCATIONS = new Set([
  "home_services",
  "service_accounting",
  "service_corporate",
  "article_end",
  "pre_footer",
  "popup",
]);

function asObject(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }
  if (!hasValidRelayKey(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = asObject(await request.json());
  } catch {
    body = null;
  }
  if (!body) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const interest = typeof body.interest === "string" ? body.interest : "";
  const language = body.language === "ru" ? "ru" : body.language === "en" ? "en" : "";
  const sourcePage = typeof body.source_page === "string" ? body.source_page : "";
  const signupLocation = typeof body.signup_location === "string" ? body.signup_location : "";

  if (
    body.brand !== "pnd50" ||
    email.length > 320 ||
    !EMAIL_PATTERN.test(email) ||
    !INTERESTS.has(interest) ||
    !language ||
    !sourcePage.startsWith("/") ||
    sourcePage.startsWith("//") ||
    sourcePage.length > 1_000 ||
    !SIGNUP_LOCATIONS.has(signupLocation)
  ) {
    return jsonResponse({ error: "Invalid subscription data" }, 400);
  }

  const admin = getAdminClient();
  if (!admin) {
    console.error("[subscribe-updates] database client unavailable");
    return jsonResponse({ error: "Storage unavailable" }, 503);
  }

  const timestamp = new Date().toISOString();
  const { error } = await admin.from("pnd50_subscribers").upsert(
    {
      email,
      brand: "pnd50",
      interest,
      language,
      source_page: sourcePage,
      signup_location: signupLocation,
      consent_timestamp: timestamp,
      utm_source: cleanOptional(body.utm_source, 200),
      utm_medium: cleanOptional(body.utm_medium, 200),
      utm_campaign: cleanOptional(body.utm_campaign, 200),
      referrer: cleanOptional(body.referrer, 1_000),
      status: "active",
      unsubscribed_at: null,
      updated_at: timestamp,
    },
    { onConflict: "brand,email" },
  );

  if (error) {
    console.error("[subscribe-updates] storage rejected request", { code: error.code });
    return jsonResponse({ error: "Storage rejected request" }, 500);
  }

  return jsonResponse({ success: true, status: "active" });
});
