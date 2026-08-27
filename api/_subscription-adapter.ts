export type SubscriptionAction = "subscribe" | "unsubscribe";

export type SubscriptionServiceResult = {
  ok: boolean;
  status: number;
  body: Record<string, unknown>;
};

const DEFAULT_FUNCTIONS_URL = "https://vrvwketvspgatfdqmrha.supabase.co";
const REQUEST_TIMEOUT_MS = 8_000;

function getEndpoint(action: SubscriptionAction): string {
  const centralServiceUrl = process.env.SUBSCRIPTION_SERVICE_URL?.replace(/\/$/, "");
  if (centralServiceUrl) {
    return `${centralServiceUrl}/${action}`;
  }

  const functionsUrl = (
    process.env.SUPABASE_FUNCTIONS_URL ||
    process.env.VITE_SUPABASE_FUNCTIONS_URL ||
    DEFAULT_FUNCTIONS_URL
  ).replace(/\/$/, "");

  return `${functionsUrl}/functions/v1/${action}-updates`;
}

export async function forwardSubscriptionRequest(
  action: SubscriptionAction,
  payload: Record<string, unknown>,
): Promise<SubscriptionServiceResult> {
  const relayKey = process.env.SUBSCRIPTION_RELAY_KEY;
  if (!relayKey) {
    return {
      ok: false,
      status: 503,
      body: { error: "Subscription service is not configured" },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(getEndpoint(action), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Subscription-Relay-Key": relayKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await response.text();
    let body: Record<string, unknown> = {};
    try {
      body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      body = {};
    }

    return { ok: response.ok, status: response.status, body };
  } catch (error) {
    const code = error instanceof Error && error.name === "AbortError" ? "timeout" : "network_error";
    console.error("[subscription-adapter] request failed", { action, code });
    return {
      ok: false,
      status: 502,
      body: { error: "Subscription service is unavailable" },
    };
  } finally {
    clearTimeout(timeout);
  }
}
