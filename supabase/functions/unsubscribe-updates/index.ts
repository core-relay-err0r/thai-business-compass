import {
  getAdminClient,
  hasValidRelayKey,
  jsonResponse,
} from "../_shared/subscription-store.ts";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }
  if (!hasValidRelayKey(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: unknown };
    token = typeof body.token === "string" ? body.token.trim() : "";
  } catch {
    token = "";
  }
  if (!UUID_PATTERN.test(token)) {
    return jsonResponse({ error: "Invalid unsubscribe token" }, 400);
  }

  const admin = getAdminClient();
  if (!admin) {
    console.error("[unsubscribe-updates] database client unavailable");
    return jsonResponse({ error: "Storage unavailable" }, 503);
  }

  const timestamp = new Date().toISOString();
  const { error } = await admin
    .from("pnd50_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: timestamp,
      updated_at: timestamp,
    })
    .eq("unsubscribe_token", token);

  if (error) {
    console.error("[unsubscribe-updates] storage rejected request", { code: error.code });
    return jsonResponse({ error: "Storage rejected request" }, 500);
  }

  // A missing token returns the same response to avoid subscriber enumeration.
  return jsonResponse({ success: true, status: "unsubscribed" });
});
