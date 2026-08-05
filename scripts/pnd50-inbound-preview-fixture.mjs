import { createHmac, randomUUID } from "node:crypto";

const previewUrl = process.env.PND50_INBOUND_PREVIEW_URL?.trim();
const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
const previewBypass = process.env.PND50_INBOUND_PREVIEW_BYPASS?.trim();
const replay = process.argv.includes("--replay");

if (!previewUrl || !webhookSecret) {
  throw new Error("PND50_INBOUND_PREVIEW_URL and RESEND_WEBHOOK_SECRET are required.");
}

const endpoint = new URL("/api/resend/inbound", previewUrl);
if (["pnd50.com", "www.pnd50.com"].includes(endpoint.hostname)) {
  throw new Error("The synthetic fixture cannot target a Production domain.");
}
if (!endpoint.hostname.endsWith(".vercel.app")) {
  throw new Error("The synthetic fixture requires a Vercel Preview hostname.");
}

const emailId =
  process.env.PND50_INBOUND_FIXTURE_EMAIL_ID?.trim() ||
  `pnd50-preview-fixture-${new Date().toISOString().slice(0, 10)}-v1`;
const payload = JSON.stringify({
  type: "email.received",
  created_at: new Date().toISOString(),
  data: {
    email_id: emailId,
    created_at: new Date().toISOString(),
    from: "Preview Buyer <pnd50-preview-buyer@example.com>",
    to: ["info@pnd50.com"],
    bcc: [],
    cc: [],
    received_for: ["info@pnd50.com"],
    message_id: `fixture-${emailId}`,
    subject: "Accounting quote request for a Thailand company",
    attachments: [],
  },
});

function signature(id, timestamp) {
  const encodedSecret = webhookSecret.startsWith("whsec_")
    ? webhookSecret.slice("whsec_".length)
    : webhookSecret;
  const key = Buffer.from(encodedSecret, "base64");
  const digest = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${payload}`)
    .digest("base64");
  return `v1,${digest}`;
}

async function deliver(attempt) {
  const id = `msg_${randomUUID()}`;
  const timestamp = String(Math.floor(Date.now() / 1_000));
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "svix-id": id,
      "svix-timestamp": timestamp,
      "svix-signature": signature(id, timestamp),
      ...(previewBypass ? { "x-vercel-protection-bypass": previewBypass } : {}),
    },
    body: payload,
  });
  const body = await response.json().catch(() => ({}));
  const safe = {
    attempt,
    status: response.status,
    received: body.received === true,
    forwarded: body.forwarded === true,
    fixture: body.fixture === true,
    router_accepted: body.router_accepted === true,
    event_id: typeof body.event_id === "string" ? body.event_id : null,
  };
  console.log(JSON.stringify(safe));
  if (!response.ok) throw new Error(`Fixture attempt ${attempt} failed with HTTP ${response.status}.`);
}

await deliver(1);
if (replay) await deliver(2);
