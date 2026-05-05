// Issues a signed math-CAPTCHA challenge.
// Returns { a, b, token } where token = base64(payload).hmac
// payload = { sum, exp } — exp is unix ms. Verified server-side in send-submission.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "fallback-dev-secret";
const TTL_MS = 10 * 60 * 1000; // 10 minutes

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function signChallenge(sum: number): Promise<string> {
  const payload = btoa(JSON.stringify({ sum, exp: Date.now() + TTL_MS }));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const token = await signChallenge(a + b);

  return new Response(JSON.stringify({ a, b, token }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
