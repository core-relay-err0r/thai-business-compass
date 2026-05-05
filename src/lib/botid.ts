import { initBotId } from "botid/client/core";

// Initialize Vercel BotID. Protected routes must be Vercel serverless functions
// (under /api/*) — NOT Supabase edge functions, since BotID needs to verify
// signed headers on the same Vercel deployment.
export function setupBotId() {
  initBotId({
    protect: [
      { path: "/api/submit", method: "POST" },
      { path: "/api/botid-test", method: "POST" },
    ],
  });
}