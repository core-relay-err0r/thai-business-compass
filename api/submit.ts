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

export default async function handler(req: any, res: any) {
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

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error("[submit] missing Supabase env vars");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const upstream = await fetch(`${supabaseUrl}/functions/v1/send-submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
      },
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