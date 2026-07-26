// Vercel Serverless Function: /api/submit
// Verifies the request with Vercel BotID, then forwards the payload to the
// Supabase Edge Function `send-submission`.
//
// Required Vercel env vars:
//   - VITE_SUPABASE_URL              (already provided by Lovable)
//   - VITE_SUPABASE_PUBLISHABLE_KEY  (already provided by Lovable)
//
// BotID needs no env vars on Basic mode — it works once the project is
// deployed on Vercel with BotID enabled in the dashboard.

import { checkBotId } from "botid/server";

export const config = {
  runtime: "nodejs",
};

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
    const verification = await checkBotId();
    if (verification.isBot) {
      console.warn("[submit] blocked bot", verification);
      return res.status(403).json({ error: "Bot detected" });
    }

    // Edge functions live on the project pinned in supabase/config.toml,
    // which can differ from the database project in the standard env vars.
    const functionsUrl =
      process.env.SUPABASE_FUNCTIONS_URL ||
      process.env.VITE_SUPABASE_FUNCTIONS_URL ||
      "https://gdjckutnbacltgamnqkt.supabase.co";

    const upstream = await fetch(`${functionsUrl}/functions/v1/send-submission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body ?? {}),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") ?? "application/json"
    );
    return res.send(text);
  } catch (err) {
    console.error("[submit] error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
