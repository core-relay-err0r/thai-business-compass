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

    const protocolCopy = upstream.ok
      ? await sendProtocolCopy({ subject: "PND50 contact enquiry copy", payload: req.body ?? {} })
      : null;

    res.status(upstream.status);
    res.setHeader("Content-Type", "application/json");
    try {
      return res.json({ ...JSON.parse(text), protocolCopyDelivered: Boolean(protocolCopy) });
    } catch {
      return res.json({ success: upstream.ok, protocolCopyDelivered: Boolean(protocolCopy) });
    }
  } catch (error) {
    console.error("[contact] relay error", error);
    return res.status(500).json({ error: "Unable to send enquiry" });
  }
}
