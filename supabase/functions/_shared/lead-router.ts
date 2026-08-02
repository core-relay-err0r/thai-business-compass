export interface LeadEventInput {
  created_at?: string;
  source_project: string;
  source_channel: "website_form" | "email" | "whatsapp" | "telegram" | "crm" | "payment_webhook" | "manual" | "other";
  source_url?: string;
  source_route?: string;
  lead_name?: string;
  lead_email?: string;
  lead_phone?: string;
  company?: string;
  country?: string;
  message?: string;
  detected_intent?: string;
  estimated_value?: "unknown" | "low" | "medium" | "high";
  utm?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

type RouterResult =
  | { ok: true; status: "accepted"; responseStatus: number }
  | {
      ok: false;
      status: "disabled" | "invalid_configuration" | "bad_status" | "timeout" | "request_failed";
      responseStatus?: number;
    };

interface SendOptions {
  envGet?: (name: string) => string | undefined;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

function endpointFromBaseUrl(baseUrl: string) {
  const url = new URL(baseUrl);
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error("Lead Router URL must use HTTP or HTTPS.");
  }

  const pathname = url.pathname.replace(/\/+$/, "");
  url.pathname = pathname.endsWith("/lead-events") ? pathname : `${pathname}/lead-events`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

function boundedTimeout(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1500;
  return Math.min(Math.max(parsed, 250), 5000);
}

export async function sendLeadEvent(
  event: LeadEventInput,
  options: SendOptions = {},
): Promise<RouterResult> {
  const envGet = options.envGet ?? ((name: string) => Deno.env.get(name));
  const baseUrl = envGet("LEAD_ROUTER_URL")?.trim();
  if (!baseUrl) return { ok: false, status: "disabled" };

  const sharedSecret = envGet("LEAD_ROUTER_SHARED_SECRET")?.trim();
  if (!sharedSecret) return { ok: false, status: "invalid_configuration" };

  let endpoint: string;
  try {
    endpoint = endpointFromBaseUrl(baseUrl);
  } catch {
    return { ok: false, status: "invalid_configuration" };
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? boundedTimeout(envGet("LEAD_ROUTER_TIMEOUT_MS"));
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const protectionBypass = envGet("LEAD_ROUTER_PROTECTION_BYPASS")?.trim();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Lead-Router-Key": sharedSecret,
  };
  if (protectionBypass) {
    headers["x-vercel-protection-bypass"] = protectionBypass;
  }

  try {
    const response = await (options.fetchImpl ?? fetch)(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(event),
      signal: controller.signal,
    });
    await response.text();

    if (!response.ok) {
      return { ok: false, status: "bad_status", responseStatus: response.status };
    }
    return { ok: true, status: "accepted", responseStatus: response.status };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, status: "timeout" };
    }
    return { ok: false, status: "request_failed" };
  } finally {
    clearTimeout(timeout);
  }
}
