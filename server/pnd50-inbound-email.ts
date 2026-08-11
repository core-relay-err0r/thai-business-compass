import type { LeadEventInput, RouterReceipt, RouterResult } from "./lead-router.js";

const MAX_WEBHOOK_BYTES = 1_000_000;
const EMAIL_PATTERN = /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+/i;
const AUTO_REPLY_PATTERN = /\b(auto(?:matic)? reply|auto.?response|out of office|away from (?:the )?office|delivery status notification|undeliverable|mail delivery subsystem)\b/i;
const BULK_PATTERN = /\b(newsletter|unsubscribe|weekly digest|monthly digest|mailing list)\b/i;
const SPAM_PATTERN = /\b(backlink|guest post|seo (?:service|offer)|domain authority|website traffic|crypto promotion|web development offer)\b/i;
const DEFAULT_INTERNAL_DOMAINS = new Set(["pnd50.com", "burakornpartners.com"]);

type Environment = Record<string, string | undefined>;

type InboundDeliveryMode = "forward" | "observed_copy";

type WebhookHeaders = {
  id: string;
  timestamp: string;
  signature: string;
};

type ReceivedEmailData = {
  email_id?: unknown;
  created_at?: unknown;
  from?: unknown;
  to?: unknown;
  subject?: unknown;
  attachments?: unknown;
  fixture_text?: unknown;
  fixture_html?: unknown;
  fixture_internal_sender?: unknown;
};

type VerifiedWebhook = {
  type?: unknown;
  created_at?: unknown;
  data?: unknown;
};

type ReceivedEmailDetails = {
  text?: string | null;
  html?: string | null;
  headers?: Record<string, string> | null;
};

export type ResendInboundClient = {
  verify(options: {
    payload: string;
    headers: WebhookHeaders;
    webhookSecret: string;
  }): VerifiedWebhook;
  retrieve(emailId: string): Promise<{
    data?: ReceivedEmailDetails | null;
    error?: unknown;
  }>;
  forward(options: {
    emailId: string;
    to: string;
    from: string;
    idempotencyKey: string;
  }): Promise<{ data?: { id?: string } | null; error?: unknown }>;
};

export type InboundRequest = AsyncIterable<Uint8Array | string> & {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
};

export type InboundResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): InboundResponse;
  json(body: unknown): InboundResponse;
};

type Logger = Pick<Console, "info" | "warn" | "error">;

type HandlerOptions = {
  env: Environment;
  createResendClient(apiKey: string | undefined): ResendInboundClient;
  sendRouter(event: LeadEventInput, env: Environment): Promise<RouterResult>;
  logger?: Logger;
  now?: () => Date;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function compact(value: unknown, maxLength: number) {
  const withoutControls = Array.from(String(value ?? ""), (character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127 ? " " : character;
  }).join("");
  return withoutControls
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function headerValue(
  headers: Record<string, string | string[] | undefined>,
  name: string,
) {
  const match = Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase(),
  )?.[1];
  return Array.isArray(match) ? match[0] : match;
}

async function readRawBody(req: InboundRequest) {
  const decoder = new TextDecoder();
  let body = "";
  let bytes = 0;

  for await (const chunk of req) {
    const value = typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true });
    bytes += new TextEncoder().encode(value).byteLength;
    if (bytes > MAX_WEBHOOK_BYTES) {
      const error = new Error("Webhook body is too large.");
      error.name = "PayloadTooLargeError";
      throw error;
    }
    body += value;
  }
  body += decoder.decode();
  return body;
}

function parseMailbox(value: unknown) {
  const raw = compact(value, 320);
  const email = raw.match(EMAIL_PATTERN)?.[0]?.toLowerCase() ?? "";
  const beforeAddress = raw.includes("<") ? raw.slice(0, raw.lastIndexOf("<")) : "";
  const name = compact(beforeAddress.replace(/^['"]|['"]$/g, ""), 100);
  return { email, name: name && name.toLowerCase() !== email ? name : "" };
}

function decodeBasicHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value: string | null | undefined) {
  const withoutQuotedHistory = String(value ?? "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<blockquote\b[\s\S]*$/i, " ")
    .replace(
      /<div\b[^>]*class=(["'])[^"']*(?:gmail_quote|yahoo_quoted|protonmail_quote)[^"']*\1[^>]*>[\s\S]*$/i,
      " ",
    )
    .replace(/<(?:br|p|div|li|tr|h[1-6])\b[^>]*>/gi, "\n")
    .replace(/<\/(?:p|div|li|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return decodeBasicHtmlEntities(withoutQuotedHistory);
}

function stripQuotedHistory(value: string) {
  const lines = value.replace(/\r\n?/g, "\n").split("\n");
  let cutoff = lines.length;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const window = lines.slice(index, index + 7).map((item) => item.trim());
    const joinedWindow = window.join(" ");
    const startsGmailReply = /^on\b/i.test(line) && /\bwrote:(?:\s|$)/i.test(joinedWindow);
    const startsMessageBlock = /^[-_]{2,}\s*(?:original message|forwarded message)\s*[-_]{2,}$/i.test(line);
    const startsOutlookReply =
      /^from:\s*\S/i.test(line) &&
      window.some((item) => /^(?:sent|date):\s*\S/i.test(item)) &&
      window.some((item) => /^to:\s*\S/i.test(item)) &&
      window.some((item) => /^subject:\s*\S/i.test(item));

    if (startsGmailReply || startsMessageBlock || startsOutlookReply) {
      cutoff = index;
      break;
    }
  }

  const newestLines = lines
    .slice(0, cutoff)
    .filter((line) => !/^\s*>/.test(line));
  const signatureIndex = newestLines.findIndex(
    (line, index) =>
      index > 0 &&
      /^(?:(?:best|kind|warm)\s+regards|regards|sincerely)[,!]?\s*$/i.test(line.trim()),
  );
  return newestLines
    .slice(0, signatureIndex >= 0 ? signatureIndex : newestLines.length)
    .join("\n");
}

function newestMessageText(details: ReceivedEmailDetails | null) {
  const plainText = String(details?.text ?? "");
  const source = plainText.trim() ? plainText : stripHtml(details?.html);
  return stripQuotedHistory(source);
}

function listValues(value: string | undefined) {
  return String(value ?? "")
    .split(/[,;\n]/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function senderDomain(email: string) {
  const separator = email.lastIndexOf("@");
  return separator >= 0 ? email.slice(separator + 1).toLowerCase() : "";
}

function isConfiguredInternalSender(email: string, env: Environment) {
  const normalizedEmail = email.trim().toLowerCase();
  const exactSenders = new Set(
    listValues(env.PND50_INBOUND_INTERNAL_SENDERS)
      .map((value) => parseMailbox(value).email)
      .filter(Boolean),
  );
  const internalDomains = new Set([
    ...DEFAULT_INTERNAL_DOMAINS,
    ...listValues(env.PND50_INBOUND_INTERNAL_DOMAINS).map((value) => value.replace(/^@/, "")),
  ]);
  return exactSenders.has(normalizedEmail) || internalDomains.has(senderDomain(normalizedEmail));
}

function resendRecordUrl(emailId: string) {
  return `https://resend.com/emails/${encodeURIComponent(emailId)}`;
}

function normalizedHeaders(headers: Record<string, string> | null | undefined) {
  return Object.fromEntries(
    Object.entries(headers ?? {}).map(([key, value]) => [key.toLowerCase(), compact(value, 500)]),
  );
}

function classifyInbound(
  subject: string,
  details: ReceivedEmailDetails | null,
) {
  const headers = normalizedHeaders(details?.headers);
  const text = compact(`${subject} ${newestMessageText(details)}`, 8_000);
  const autoSubmitted = headers["auto-submitted"];
  const precedence = headers.precedence?.toLowerCase();

  if (
    AUTO_REPLY_PATTERN.test(text) ||
    (autoSubmitted && autoSubmitted.toLowerCase() !== "no") ||
    headers["x-autoreply"] ||
    headers["x-autorespond"]
  ) {
    return { kind: "automated", eventType: "system_report", intent: "unknown" };
  }
  if (
    BULK_PATTERN.test(text) ||
    headers["list-unsubscribe"] ||
    headers["list-id"] ||
    ["bulk", "list", "junk"].includes(precedence ?? "")
  ) {
    return { kind: "bulk", eventType: "newsletter", intent: "unknown" };
  }
  if (SPAM_PATTERN.test(text)) {
    return { kind: "spam", eventType: "newsletter", intent: "unknown" };
  }

  if (/\b(payment|invoice|refund|charge|paid)\b/i.test(text)) {
    return { kind: "human", eventType: "inbound_email", intent: "payment" };
  }
  if (/\b(quote|quotation|pricing|price|fees?|cost|proposal|consultation)\b/i.test(text)) {
    return { kind: "human", eventType: "inbound_email", intent: "quote_request" };
  }
  if (/\b(accounting|accountant|bookkeeping|financial statements?|audit)\b/i.test(text)) {
    return { kind: "human", eventType: "inbound_email", intent: "accounting" };
  }
  if (/\b(tax|pnd\s?50|vat|withholding|payroll|compliance|company registration|corporate change|filing)\b/i.test(text)) {
    return { kind: "human", eventType: "inbound_email", intent: "compliance" };
  }
  if (/\b(partner|partnership|referral|collaboration)\b/i.test(text)) {
    return { kind: "human", eventType: "inbound_email", intent: "partnership" };
  }
  return { kind: "human", eventType: "inbound_email", intent: "unknown" };
}

function stableEventId(emailId: string) {
  const safe = emailId.replace(/[^a-zA-Z0-9_-]/g, "");
  const compactId =
    safe.length <= 72 ? safe : `${safe.slice(0, 34)}-${safe.slice(-34)}`;
  return `pnd50:inbound:${compactId}`;
}

function validDate(value: unknown, fallback: Date) {
  const text = compact(value, 50);
  return text && !Number.isNaN(Date.parse(text)) ? new Date(text).toISOString() : fallback.toISOString();
}

function eventMessage(kind: string, intent: string) {
  if (kind === "internal") return "Internal email observed and journaled without paging.";
  if (kind !== "human") return "Inbound email classified as automated or bulk traffic.";
  if (intent === "unknown") return "Inbound email received without a clear commercial intent.";
  return `Inbound email indicates commercial intent: ${intent.replace(/_/g, " ")}.`;
}

export function buildInboundLeadEvent({
  data,
  details,
  internalSender = false,
  now,
}: {
  data: ReceivedEmailData;
  details: ReceivedEmailDetails | null;
  internalSender?: boolean;
  now: Date;
}): LeadEventInput {
  const emailId = compact(data.email_id, 160);
  const sender = parseMailbox(data.from);
  const subject = compact(data.subject, 300);
  const classification = internalSender
    ? { kind: "internal", eventType: "internal_email", intent: "unknown" }
    : classifyInbound(subject, details);
  const recipients = Array.isArray(data.to) ? data.to : [];
  const attachments = Array.isArray(data.attachments) ? data.attachments : [];

  return {
    event_id: stableEventId(emailId),
    created_at: validDate(data.created_at, now),
    source_project: "PND50 / Thai Business Compass",
    source_channel: "email",
    source_url: "https://pnd50.com",
    source_route: "/api/resend/inbound",
    source_record_url: resendRecordUrl(emailId),
    ...(sender.name ? { lead_name: sender.name } : {}),
    ...(senderDomain(sender.email) ? { company: senderDomain(sender.email) } : {}),
    lead_email: sender.email,
    message: eventMessage(classification.kind, classification.intent),
    detected_intent: classification.intent,
    estimated_value: "unknown",
    metadata: {
      event_type: classification.eventType,
      inbound_kind: classification.kind,
      sender_scope: internalSender ? "internal" : "external",
      recipient_count: Math.min(recipients.length, 20),
      has_attachments: attachments.length > 0,
      subject_present: Boolean(subject),
    },
  };
}

function isOwnDomainSender(email: string, forwardFrom: string) {
  return email === parseMailbox(forwardFrom).email || email.endsWith("@pnd50.com");
}

function isPreviewFixture(env: Environment, data: ReceivedEmailData) {
  if (env.VERCEL_ENV !== "preview" || env.PND50_INBOUND_FIXTURE_MODE !== "true") {
    return false;
  }
  const emailId = compact(data.email_id, 160);
  const sender = parseMailbox(data.from).email;
  const recipients = Array.isArray(data.to) ? data.to.map((item) => compact(item, 320)) : [];
  const attachments = Array.isArray(data.attachments) ? data.attachments : [];
  const observedRecipient = parseMailbox(env.PND50_INBOUND_OBSERVED_RECIPIENT).email;
  const allowedRecipients = new Set([
    "info@pnd50.com",
    ...(observedRecipient ? [observedRecipient] : []),
  ]);
  const fixtureText = data.fixture_text;
  const fixtureHtml = data.fixture_html;
  const fixtureInternalSender = data.fixture_internal_sender;
  return (
    emailId.startsWith("pnd50-preview-fixture-") &&
    sender.endsWith("@example.com") &&
    recipients.length > 0 &&
    recipients.every((recipient) => allowedRecipients.has(parseMailbox(recipient).email)) &&
    attachments.length === 0 &&
    (fixtureText === undefined || (typeof fixtureText === "string" && fixtureText.length <= 8_000)) &&
    (fixtureHtml === undefined || (typeof fixtureHtml === "string" && fixtureHtml.length <= 8_000)) &&
    (fixtureInternalSender === undefined || typeof fixtureInternalSender === "boolean")
  );
}

function validReceivedData(value: unknown): value is ReceivedEmailData {
  const data = asRecord(value);
  if (!data) return false;
  const emailId = compact(data.email_id, 160);
  return Boolean(emailId && parseMailbox(data.from).email && Array.isArray(data.to));
}

function inboundDeliveryMode(env: Environment): InboundDeliveryMode | null {
  const configured = env.PND50_INBOUND_DELIVERY_MODE?.trim() || "forward";
  return configured === "forward" || configured === "observed_copy"
    ? configured
    : null;
}

function receivedFor(data: ReceivedEmailData, expectedRecipient: string) {
  if (!Array.isArray(data.to)) return false;
  return data.to.some((recipient) => parseMailbox(recipient).email === expectedRecipient);
}

export function createInboundEmailHandler({
  env,
  createResendClient,
  sendRouter,
  logger = console,
  now = () => new Date(),
}: HandlerOptions) {
  return async function inboundEmailHandler(req: InboundRequest, res: InboundResponse) {
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, endpoint: "resend-inbound" });
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, GET");
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    const webhookSecret = env.RESEND_WEBHOOK_SECRET?.trim();
    if (!webhookSecret) {
      logger.error("[resend-inbound] webhook verification is not configured");
      return res.status(503).json({ error: "WEBHOOK_NOT_CONFIGURED" });
    }

    const deliveryMode = inboundDeliveryMode(env);
    if (!deliveryMode) {
      logger.error("[resend-inbound] delivery mode is invalid");
      return res.status(503).json({ error: "INVALID_DELIVERY_MODE" });
    }

    const observedRecipient = parseMailbox(env.PND50_INBOUND_OBSERVED_RECIPIENT).email;
    if (deliveryMode === "observed_copy" && !observedRecipient) {
      logger.error("[resend-inbound] observed-copy recipient is not configured");
      return res.status(503).json({ error: "OBSERVED_RECIPIENT_NOT_CONFIGURED" });
    }

    let rawBody: string;
    try {
      rawBody = await readRawBody(req);
    } catch (error) {
      const tooLarge = error instanceof Error && error.name === "PayloadTooLargeError";
      return res.status(tooLarge ? 413 : 400).json({
        error: tooLarge ? "PAYLOAD_TOO_LARGE" : "INVALID_BODY",
      });
    }

    const signatureHeaders = {
      id: headerValue(req.headers, "svix-id")?.trim() ?? "",
      timestamp: headerValue(req.headers, "svix-timestamp")?.trim() ?? "",
      signature: headerValue(req.headers, "svix-signature")?.trim() ?? "",
    };
    if (!signatureHeaders.id || !signatureHeaders.timestamp || !signatureHeaders.signature) {
      return res.status(401).json({ error: "INVALID_SIGNATURE" });
    }

    const client = createResendClient(env.RESEND_API_KEY?.trim());
    let event: VerifiedWebhook;
    try {
      event = client.verify({
        payload: rawBody,
        headers: signatureHeaders,
        webhookSecret,
      });
    } catch {
      logger.warn("[resend-inbound] rejected invalid webhook signature");
      return res.status(401).json({ error: "INVALID_SIGNATURE" });
    }

    if (event.type !== "email.received") {
      return res.status(200).json({ received: true, ignored: true });
    }
    if (!validReceivedData(event.data)) {
      return res.status(400).json({ error: "INVALID_EMAIL_EVENT" });
    }

    const data = event.data;
    if (
      deliveryMode === "observed_copy" &&
      !receivedFor(data, observedRecipient)
    ) {
      return res.status(200).json({
        received: true,
        ignored: true,
        reason: "RECIPIENT_NOT_ALLOWED",
      });
    }

    const emailId = compact(data.email_id, 160);
    const sender = parseMailbox(data.from);
    const forwardFrom = env.FORWARD_FROM?.trim() || "forwarder@pnd50.com";
    if (isOwnDomainSender(sender.email, forwardFrom)) {
      logger.warn("[resend-inbound] loop protection suppressed an inbound event");
      return res.status(200).json({
        received: true,
        forwarded: false,
        reason: "LOOP_PROTECTION",
      });
    }

    const fixtureMode =
      env.VERCEL_ENV === "preview" && env.PND50_INBOUND_FIXTURE_MODE === "true";
    const previewFixture = isPreviewFixture(env, data);
    if (fixtureMode && !previewFixture) {
      return res.status(403).json({ error: "PREVIEW_FIXTURE_REQUIRED" });
    }

    const internalSender =
      isConfiguredInternalSender(sender.email, env) ||
      (previewFixture && data.fixture_internal_sender === true);
    if (internalSender && deliveryMode === "forward" && !previewFixture) {
      logger.info("[resend-inbound] internal sender suppressed before forwarding");
      return res.status(200).json({
        received: true,
        forwarded: false,
        ignored: true,
        internal_sender: true,
        reason: "INTERNAL_SENDER",
      });
    }

    let details: ReceivedEmailDetails | null = null;
    if (previewFixture) {
      details = {
        text: typeof data.fixture_text === "string" ? data.fixture_text : null,
        html: typeof data.fixture_html === "string" ? data.fixture_html : null,
        headers: {},
      };
    } else if (!internalSender) {
      const apiKey = env.RESEND_API_KEY?.trim();
      const forwardTo = env.FORWARD_TO?.trim();
      if (!apiKey || (deliveryMode === "forward" && !forwardTo)) {
        logger.error("[resend-inbound] forwarding is not configured");
        return res.status(503).json({ error: "FORWARDING_NOT_CONFIGURED" });
      }

      try {
        const retrieved = await client.retrieve(emailId);
        if (!retrieved.error && retrieved.data) details = retrieved.data;
        else logger.warn("[resend-inbound] email content was unavailable for classification");
      } catch {
        logger.warn("[resend-inbound] email content retrieval failed");
      }

      if (deliveryMode === "forward") {
        try {
          const forwarded = await client.forward({
            emailId,
            to: forwardTo as string,
            from: forwardFrom,
            idempotencyKey: `pnd50-inbound-forward-${emailId}`.slice(0, 256),
          });
          if (forwarded.error || !forwarded.data?.id) {
            logger.error("[resend-inbound] email forwarding was rejected");
            return res.status(502).json({ error: "FORWARD_FAILED" });
          }
        } catch {
          logger.error("[resend-inbound] email forwarding was rejected");
          return res.status(502).json({ error: "FORWARD_FAILED" });
        }
      }
    }

    const leadEvent = buildInboundLeadEvent({
      data,
      details,
      internalSender,
      now: now(),
    });
    let routerAccepted = false;
    let routerPreview: RouterReceipt | undefined;
    try {
      const routerResult = await sendRouter(leadEvent, env);
      routerAccepted = routerResult.ok;
      if (routerResult.ok) {
        routerPreview = routerResult.receipt;
      } else {
        logger.warn("[resend-inbound] Lead Router did not accept the event", {
          status: routerResult.status,
          responseStatus: routerResult.responseStatus,
        });
      }
    } catch {
      logger.warn("[resend-inbound] Lead Router dispatch failed");
    }

    logger.info("[resend-inbound] processed inbound email", {
      eventId: leadEvent.event_id,
      fixture: previewFixture,
      deliveryMode,
      internalSender,
      routerAccepted,
    });
    return res.status(200).json({
      received: true,
      forwarded: deliveryMode === "forward" && !internalSender,
      fixture: previewFixture,
      internal_sender: internalSender,
      delivery_mode: deliveryMode,
      router_accepted: routerAccepted,
      ...(previewFixture && routerPreview ? { router_preview: routerPreview } : {}),
      event_id: leadEvent.event_id,
    });
  };
}
