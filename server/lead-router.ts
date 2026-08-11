export interface LeadEventInput {
  event_id: string;
  created_at: string;
  source_project: string;
  source_channel: "email";
  source_url: string;
  source_route: string;
  source_record_url?: string;
  lead_name?: string;
  company?: string;
  lead_email: string;
  message: string;
  detected_intent: string;
  estimated_value: "unknown" | "low" | "medium" | "high";
  metadata: Record<string, unknown>;
}

export type RouterResult =
  | {
      ok: true;
      status: "accepted";
      responseStatus: number;
      receipt?: RouterReceipt;
    }
  | {
      ok: false;
      status:
        | "disabled"
        | "invalid_configuration"
        | "bad_status"
        | "timeout"
        | "request_failed";
      responseStatus?: number;
    };

export type RouterReceipt = {
  priority?: "P0" | "P1" | "P2" | "P3";
  detected_intent?: string;
  duplicate?: boolean;
  delivery_status?: string;
  dry_run?: boolean;
};

type Environment = Record<string, string | undefined>;

type SendOptions = {
  env: Environment;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

const PREVIEW_ROUTER_HOSTS = new Set([
  "lead-alarm-router-karhar91-burakorn.vercel.app",
  "lead-alarm-router-8h15hdcbo-burakorn.vercel.app",
]);

function endpointFromBaseUrl(baseUrl: string) {
  const url = new URL(baseUrl);
  if (!new Set(["http:", "https:"]).has(url.protocol) || url.username || url.password) {
    throw new Error("Invalid Lead Router URL.");
  }

  const pathname = url.pathname.replace(/\/+$/, "");
  if (!pathname.endsWith("/lead-events")) {
    url.pathname = pathname === "" ? "/api/lead-events" : `${pathname}/lead-events`;
  }
  url.search = "";
  url.hash = "";
  return url.toString();
}

function boundedTimeout(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1_500;
  return Math.min(Math.max(parsed, 250), 5_000);
}

function previewEndpointAllowed(endpoint: string, env: Environment) {
  if (env.VERCEL_ENV !== "preview") return true;
  return PREVIEW_ROUTER_HOSTS.has(new URL(endpoint).hostname);
}

function safeRouterReceipt(raw: string): RouterReceipt | undefined {
  try {
    const parsed = JSON.parse(raw) as {
      event?: { priority?: unknown; detected_intent?: unknown };
      notification?: {
        duplicate?: unknown;
        delivery_status?: unknown;
        dry_run?: unknown;
      };
    };
    const receipt: RouterReceipt = {};
    if (new Set(["P0", "P1", "P2", "P3"]).has(String(parsed.event?.priority))) {
      receipt.priority = parsed.event?.priority as RouterReceipt["priority"];
    }
    if (typeof parsed.event?.detected_intent === "string") {
      receipt.detected_intent = parsed.event.detected_intent.slice(0, 80);
    }
    if (typeof parsed.notification?.duplicate === "boolean") {
      receipt.duplicate = parsed.notification.duplicate;
    }
    if (typeof parsed.notification?.delivery_status === "string") {
      receipt.delivery_status = parsed.notification.delivery_status.slice(0, 80);
    }
    if (typeof parsed.notification?.dry_run === "boolean") {
      receipt.dry_run = parsed.notification.dry_run;
    }
    return Object.keys(receipt).length > 0 ? receipt : undefined;
  } catch {
    return undefined;
  }
}

export async function sendLeadEvent(
  event: LeadEventInput,
  options: SendOptions,
): Promise<RouterResult> {
  const baseUrl = options.env.LEAD_ROUTER_URL?.trim();
  if (!baseUrl) return { ok: false, status: "disabled" };

  const sharedSecret = options.env.LEAD_ROUTER_SHARED_SECRET?.trim();
  if (!sharedSecret) return { ok: false, status: "invalid_configuration" };

  let endpoint: string;
  try {
    endpoint = endpointFromBaseUrl(baseUrl);
  } catch {
    return { ok: false, status: "invalid_configuration" };
  }
  if (!previewEndpointAllowed(endpoint, options.env)) {
    return { ok: false, status: "invalid_configuration" };
  }

  const controller = new AbortController();
  const timeoutMs =
    options.timeoutMs ?? boundedTimeout(options.env.LEAD_ROUTER_TIMEOUT_MS);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Lead-Router-Key": sharedSecret,
    "X-Lead-Router-Source": "pnd50-inbound-email",
  };
  const protectionBypass = options.env.LEAD_ROUTER_PROTECTION_BYPASS?.trim();
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
    const responseBody = await response.text();

    if (!response.ok) {
      return {
        ok: false,
        status: "bad_status",
        responseStatus: response.status,
      };
    }
    const receipt = safeRouterReceipt(responseBody);
    return {
      ok: true,
      status: "accepted",
      responseStatus: response.status,
      ...(receipt ? { receipt } : {}),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, status: "timeout" };
    }
    return { ok: false, status: "request_failed" };
  } finally {
    clearTimeout(timeout);
  }
}
