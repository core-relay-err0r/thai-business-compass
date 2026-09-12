import { sendProtocolCopy } from "./_protocol-copy.js";

export const config = { runtime: "nodejs" };

type ApiRequest = { method?: string; body?: unknown };
type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): ApiResponse;
  send(body: string): ApiResponse;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const functionsUrl =
      process.env.SUPABASE_FUNCTIONS_URL ||
      process.env.VITE_SUPABASE_FUNCTIONS_URL ||
      "https://vrvwketvspgatfdqmrha.supabase.co";

    const upstream = await fetch(
      `${functionsUrl}/functions/v1/send-contact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body ?? {}),
      },
    );
    const text = await upstream.text();

    let data: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid response");
      data = parsed as Record<string, unknown>;
    } catch {
      return res.status(502).json({ error: "Enquiry acceptance was not confirmed" });
    }

    if (!upstream.ok) return res.status(upstream.status).json(data);
    if (data.success !== true || data.internalDelivered !== true) {
      return res.status(502).json({ error: "Enquiry acceptance was not confirmed" });
    }

    // An optional copy must not turn an already accepted enquiry into a retry.
    let protocolCopyDelivered = false;
    try {
      const copy = await sendProtocolCopy({ subject: "PND50 contact enquiry copy", payload: req.body ?? {} });
      protocolCopyDelivered = Boolean(copy?.id);
    } catch {
      console.warn("[contact] optional protocol copy was not confirmed");
    }
    return res.status(upstream.status).json({ ...data, protocolCopyDelivered });
  } catch (error) {
    console.error("[contact] relay error", error);
    return res.status(500).json({ error: "Unable to send enquiry" });
  }
}
