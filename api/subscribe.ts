import { checkBotId } from "botid/server";
import { forwardSubscriptionRequest } from "./_subscription-adapter.js";

export const config = { runtime: "nodejs" };

type ApiRequest = { method?: string; body?: unknown };
type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): ApiResponse;
};

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asObject(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function cleanOptional(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function isSafeSourcePage(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && value.length <= 1_000;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = asObject(req.body);
  if (!body) {
    return res.status(400).json({ error: "Invalid request" });
  }

  if (cleanOptional(body.company_website, 200)) {
    return res.status(202).json({ success: true });
  }

  const formStartedAt = Number(body.form_started_at);
  const elapsed = Date.now() - formStartedAt;
  if (!Number.isFinite(formStartedAt) || elapsed < 1_200 || elapsed > 86_400_000) {
    return res.status(429).json({ error: "Please try again" });
  }

  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      return res.status(403).json({ error: "Request could not be accepted" });
    }
  } catch (error) {
    console.error("[subscribe] BotID verification failed", {
      code: error instanceof Error ? error.name : "unknown",
    });
    return res.status(503).json({ error: "Subscription protection is unavailable" });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const interest = typeof body.interest === "string" ? body.interest : "";
  const language = body.language === "ru" ? "ru" : body.language === "en" ? "en" : "";
  const sourcePage = typeof body.source_page === "string" ? body.source_page : "";
  const signupLocation = typeof body.signup_location === "string" ? body.signup_location : "";

  if (
    email.length > 320 ||
    !EMAIL_PATTERN.test(email) ||
    !INTERESTS.has(interest) ||
    !language ||
    !isSafeSourcePage(sourcePage) ||
    !SIGNUP_LOCATIONS.has(signupLocation)
  ) {
    return res.status(400).json({ error: "Check the email address and try again" });
  }

  const upstream = await forwardSubscriptionRequest("subscribe", {
    email,
    brand: "pnd50",
    interest,
    language,
    source_page: sourcePage,
    signup_location: signupLocation,
    consent_timestamp: new Date().toISOString(),
    utm_source: cleanOptional(body.utm_source, 200),
    utm_medium: cleanOptional(body.utm_medium, 200),
    utm_campaign: cleanOptional(body.utm_campaign, 200),
    referrer: cleanOptional(body.referrer, 1_000),
  });

  if (!upstream.ok) {
    console.error("[subscribe] upstream rejected request", { status: upstream.status });
    return res.status(upstream.status >= 500 ? 502 : upstream.status).json({
      error: "We could not save your subscription. Please try again.",
    });
  }

  return res.status(200).json({ success: true });
}
