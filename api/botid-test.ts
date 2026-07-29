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

type ApiRequest = { method?: string };
type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): ApiResponse;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
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
  } catch (error: unknown) {
    console.error("[botid-test] error:", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Internal error",
      hint:
        "If this fails on Vercel, BotID may not be enabled in the project's BotID tab.",
    });
  }
}
