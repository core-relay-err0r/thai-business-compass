import { createHmac, randomUUID } from "node:crypto";
import inboundHandler from "./inbound.js";
import type { InboundRequest, InboundResponse } from "../../server/pnd50-inbound-email.js";

type PreviewRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

type PreviewResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): PreviewResponse;
  json(body: unknown): PreviewResponse;
};

const FIXTURE_VERSION = "20260811-v3";
const scenarios = {
  quoted_history: {
    from: `Preview Buyer <pnd50-preview-buyer-${FIXTURE_VERSION}@example.com>`,
    subject: "Re: Thailand company setup",
    fixture_text: [
      "Could you send the proposal and fees for the next step?",
      "",
      "On Monday, August 10, 2026, Previous Sender wrote:",
      "> The earlier invoice was paid.",
    ].join("\n"),
  },
  internal_sender: {
    from: `Preview Internal <pnd50-preview-internal-${FIXTURE_VERSION}@example.com>`,
    subject: "Payment invoice requires attention",
    fixture_text: "Please review the payment today.",
    fixture_internal_sender: true,
  },
} as const;

function queryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function signature(secret: string, id: string, timestamp: string, payload: string) {
  const encodedSecret = secret.startsWith("whsec_")
    ? secret.slice("whsec_".length)
    : secret;
  const key = Buffer.from(encodedSecret, "base64");
  const digest = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${payload}`)
    .digest("base64");
  return `v1,${digest}`;
}

export default async function previewFixtureHandler(
  req: PreviewRequest,
  res: PreviewResponse,
) {
  if (process.env.VERCEL_ENV !== "preview") {
    return res.status(404).json({ error: "NOT_FOUND" });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
  if (process.env.PND50_INBOUND_FIXTURE_MODE !== "true") {
    return res.status(403).json({ error: "PREVIEW_FIXTURE_DISABLED" });
  }

  const scenarioName = queryValue(req.query?.scenario);
  if (!scenarioName || !(scenarioName in scenarios)) {
    return res.status(400).json({ error: "INVALID_SCENARIO" });
  }
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return res.status(503).json({ error: "WEBHOOK_NOT_CONFIGURED" });
  }

  const deliveryMode = process.env.PND50_INBOUND_DELIVERY_MODE?.trim() || "forward";
  const observedRecipient = process.env.PND50_INBOUND_OBSERVED_RECIPIENT?.trim();
  if (deliveryMode === "observed_copy" && !observedRecipient) {
    return res.status(503).json({ error: "OBSERVED_RECIPIENT_NOT_CONFIGURED" });
  }
  const fixtureRecipient = deliveryMode === "observed_copy"
    ? observedRecipient as string
    : "info@pnd50.com";

  const scenario = scenarios[scenarioName as keyof typeof scenarios];
  const emailId = `pnd50-preview-fixture-${scenarioName}-${FIXTURE_VERSION}`;
  const payload = JSON.stringify({
    type: "email.received",
    created_at: new Date().toISOString(),
    data: {
      email_id: emailId,
      created_at: new Date().toISOString(),
      ...scenario,
      to: [fixtureRecipient],
      bcc: [],
      cc: [],
      received_for: ["info@pnd50.com"],
      message_id: `fixture-${emailId}`,
      attachments: [],
    },
  });
  const id = `msg_${randomUUID()}`;
  const timestamp = String(Math.floor(Date.now() / 1_000));
  const request: InboundRequest = {
    method: "POST",
    headers: {
      "svix-id": id,
      "svix-timestamp": timestamp,
      "svix-signature": signature(webhookSecret, id, timestamp, payload),
    },
    async *[Symbol.asyncIterator]() {
      yield new TextEncoder().encode(payload);
    },
  };

  let statusCode = 200;
  let body: unknown = { error: "EMPTY_FIXTURE_RESPONSE" };
  const response: InboundResponse = {
    setHeader() {},
    status(code) {
      statusCode = code;
      return response;
    },
    json(value) {
      body = value;
      return response;
    },
  };
  await inboundHandler(request, response);
  return res.status(statusCode).json({ scenario: scenarioName, result: body });
}
