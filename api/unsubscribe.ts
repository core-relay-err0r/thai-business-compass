import { forwardSubscriptionRequest } from "./_subscription-adapter.js";

export const config = { runtime: "nodejs" };

type ApiRequest = { method?: string; body?: unknown };
type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): ApiResponse;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as { token?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  if (!UUID_PATTERN.test(token)) {
    return res.status(400).json({ error: "Invalid unsubscribe link" });
  }

  const upstream = await forwardSubscriptionRequest("unsubscribe", { token });
  if (!upstream.ok) {
    console.error("[unsubscribe] upstream rejected request", { status: upstream.status });
    return res.status(upstream.status >= 500 ? 502 : upstream.status).json({
      error: "We could not update your subscription. Please try again.",
    });
  }

  return res.status(200).json({ success: true });
}
