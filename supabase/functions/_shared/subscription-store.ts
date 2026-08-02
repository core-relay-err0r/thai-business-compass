import { createClient } from "npm:@supabase/supabase-js@2.93.2";

export const jsonHeaders = { "Content-Type": "application/json" };

export function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function readSecretKey(): string {
  const legacyKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacyKey) return legacyKey;

  const keySet = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!keySet) return "";

  try {
    const parsed = JSON.parse(keySet) as Record<string, string>;
    return parsed.default ?? "";
  } catch {
    return "";
  }
}

export function getAdminClient() {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const key = readSecretKey();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function constantTimeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let mismatch = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return mismatch === 0;
}

export function hasValidRelayKey(request: Request): boolean {
  const expected = Deno.env.get("SUBSCRIPTION_RELAY_KEY") ?? "";
  const received = request.headers.get("X-Subscription-Relay-Key") ?? "";
  return Boolean(expected && received && constantTimeEqual(expected, received));
}

export function cleanOptional(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}
