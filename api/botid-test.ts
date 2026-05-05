// Vercel Serverless Function: /api/botid-test
// Diagnostic endpoint to verify Vercel BotID is active.
//
// Expected behavior once BotID is enabled in the Vercel dashboard:
//   - Real browser (with BotIdClient initialized) → 200 { ok: true, isBot: false }
//   - curl / script / no BotID headers              → 403 { ok: false, isBot: true }
//
// Quick test from your terminal after deploy:
//   curl -i -X POST https://YOUR-DOMAIN/api/botid-test
//   → should return HTTP 403

import { checkBotId } from "botid/server";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const verification = await checkBotId();

    if (verification.isBot) {
      return res.status(403).json({
        ok: false,
        isBot: true,
        message: "Blocked by BotID — protection is working.",
        verification,
      });
    }

    return res.status(200).json({
      ok: true,
      isBot: false,
      message: "Verified human — BotID is active and you passed the check.",
      verification,
    });
  } catch (err: any) {
    console.error("[botid-test] error:", err);
    return res.status(500).json({
      ok: false,
      error: err?.message ?? "Internal error",
      hint:
        "If this fails on Vercel, BotID may not be enabled in the project's BotID tab.",
    });
  }
}