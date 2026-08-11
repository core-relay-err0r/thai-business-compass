import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { describe, expect, it, vi } from "vitest";
import { sendLeadEvent, type LeadEventInput } from "../../server/lead-router.js";
import {
  buildInboundLeadEvent,
  createInboundEmailHandler,
  type InboundRequest,
  type InboundResponse,
  type ResendInboundClient,
} from "../../server/pnd50-inbound-email.js";

const secret = `whsec_${Buffer.from("pnd50-inbound-test-signing-secret-32").toString("base64")}`;
const encoder = new TextEncoder();

function signature(payload: string, id: string, timestamp: string) {
  const key = Buffer.from(secret.slice("whsec_".length), "base64");
  const digest = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${payload}`)
    .digest("base64");
  return `v1,${digest}`;
}

function emailEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: "email.received",
    created_at: "2026-08-05T08:00:00.000Z",
    data: {
      email_id: "pnd50-preview-fixture-email-001",
      created_at: "2026-08-05T08:00:00.000Z",
      from: "Preview Buyer <buyer@example.com>",
      to: ["info@pnd50.com"],
      bcc: [],
      cc: [],
      received_for: ["info@pnd50.com"],
      message_id: "fixture-message-001",
      subject: "Accounting quote request for a Thailand company",
      attachments: [],
      ...overrides,
    },
  };
}

function signedRequest(payload: unknown, valid = true): InboundRequest {
  const raw = JSON.stringify(payload);
  const id = `msg_${Math.random().toString(16).slice(2)}`;
  const timestamp = String(Math.floor(Date.now() / 1_000));
  const signed = valid ? signature(raw, id, timestamp) : "v1,invalid";
  return {
    method: "POST",
    headers: {
      "svix-id": id,
      "svix-timestamp": timestamp,
      "svix-signature": signed,
    },
    async *[Symbol.asyncIterator]() {
      yield encoder.encode(raw);
    },
  };
}

function responseRecorder() {
  let statusCode = 200;
  let body: unknown;
  const response: InboundResponse = {
    setHeader: vi.fn(),
    status(code) {
      statusCode = code;
      return response;
    },
    json(value) {
      body = value;
      return response;
    },
  };
  return { response, result: () => ({ statusCode, body }) };
}

function resendClient(
  overrides: Partial<ResendInboundClient> = {},
): ResendInboundClient {
  const resend = new Resend("re_test_only");
  return {
    verify: (options) => resend.webhooks.verify(options),
    retrieve: vi.fn(async () => ({
      data: { text: "Please send an accounting proposal.", headers: {} },
    })),
    forward: vi.fn(async () => ({ data: { id: "forwarded-test-id" } })),
    ...overrides,
  };
}

function handlerOptions(overrides: Record<string, unknown> = {}) {
  const client = resendClient();
  const sendRouter = vi.fn(async (_event: LeadEventInput, _env: Record<string, string | undefined>) => ({
    ok: true as const,
    status: "accepted" as const,
    responseStatus: 202,
  }));
  return {
    env: {
      RESEND_WEBHOOK_SECRET: secret,
      RESEND_API_KEY: "re_test_only",
      FORWARD_TO: "owner@example.com",
      FORWARD_FROM: "forwarder@pnd50.com",
    },
    createResendClient: () => client,
    sendRouter,
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    now: () => new Date("2026-08-05T08:00:00.000Z"),
    client,
    ...overrides,
  };
}

describe("PND50 inbound Resend webhook", () => {
  it("accepts one signed Preview fixture without calling Resend network methods", async () => {
    const options = handlerOptions({
      env: {
        RESEND_WEBHOOK_SECRET: secret,
        VERCEL_ENV: "preview",
        PND50_INBOUND_FIXTURE_MODE: "true",
      },
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(signedRequest(emailEvent()), response);

    expect(result()).toMatchObject({
      statusCode: 200,
      body: {
        received: true,
        forwarded: true,
        fixture: true,
        router_accepted: true,
      },
    });
    expect(options.client.retrieve).not.toHaveBeenCalled();
    expect(options.client.forward).not.toHaveBeenCalled();
    expect(options.sendRouter).toHaveBeenCalledTimes(1);
    expect(options.sendRouter.mock.calls[0][0]).toMatchObject({
      source_project: "PND50 / Thai Business Compass",
      source_channel: "email",
      detected_intent: "quote_request",
      metadata: { event_type: "inbound_email", inbound_kind: "human" },
    });
  });

  it("journals a signed Preview internal fixture without retrieving or forwarding", async () => {
    const options = handlerOptions({
      env: {
        RESEND_WEBHOOK_SECRET: secret,
        VERCEL_ENV: "preview",
        PND50_INBOUND_FIXTURE_MODE: "true",
      },
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(
      signedRequest(
        emailEvent({
          from: "Preview Internal <internal@example.com>",
          subject: "Payment invoice requires attention",
          fixture_internal_sender: true,
          fixture_text: "Please review the payment today.",
        }),
      ),
      response,
    );

    expect(result()).toMatchObject({
      statusCode: 200,
      body: {
        received: true,
        fixture: true,
        internal_sender: true,
        router_accepted: true,
      },
    });
    expect(options.client.retrieve).not.toHaveBeenCalled();
    expect(options.client.forward).not.toHaveBeenCalled();
    expect(options.sendRouter).toHaveBeenCalledTimes(1);
    expect(options.sendRouter.mock.calls[0][0]).toMatchObject({
      detected_intent: "unknown",
      metadata: { event_type: "internal_email", inbound_kind: "internal" },
    });
  });

  it("rejects an invalid signature before retrieval, forwarding, or routing", async () => {
    const options = handlerOptions();
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(signedRequest(emailEvent(), false), response);

    expect(result()).toEqual({ statusCode: 401, body: { error: "INVALID_SIGNATURE" } });
    expect(options.client.retrieve).not.toHaveBeenCalled();
    expect(options.client.forward).not.toHaveBeenCalled();
    expect(options.sendRouter).not.toHaveBeenCalled();
  });

  it("fails closed when webhook verification is not configured", async () => {
    const options = handlerOptions({ env: {} });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(signedRequest(emailEvent()), response);
    expect(result()).toEqual({
      statusCode: 503,
      body: { error: "WEBHOOK_NOT_CONFIGURED" },
    });
    expect(options.sendRouter).not.toHaveBeenCalled();
  });

  it("acknowledges a valid non-inbound webhook without side effects", async () => {
    const options = handlerOptions();
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(
      signedRequest({ type: "email.delivered", data: {} }),
      response,
    );
    expect(result()).toEqual({ statusCode: 200, body: { received: true, ignored: true } });
    expect(options.client.forward).not.toHaveBeenCalled();
    expect(options.sendRouter).not.toHaveBeenCalled();
  });

  it("routes only after a successful forward", async () => {
    const calls: string[] = [];
    const client = resendClient({
      retrieve: vi.fn(async () => {
        calls.push("retrieve");
        return { data: { text: "Need tax filing support", headers: {} } };
      }),
      forward: vi.fn(async () => {
        calls.push("forward");
        return { data: { id: "forwarded-test-id" } };
      }),
    });
    const options = handlerOptions({
      client,
      createResendClient: () => client,
      sendRouter: vi.fn(async (_event: LeadEventInput, _env: Record<string, string | undefined>) => {
        calls.push("router");
        return { ok: true as const, status: "accepted" as const, responseStatus: 202 };
      }),
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(signedRequest(emailEvent()), response);

    expect(result().statusCode).toBe(200);
    expect(calls).toEqual(["retrieve", "forward", "router"]);
    expect(client.forward).toHaveBeenCalledWith(
      expect.objectContaining({
        emailId: "pnd50-preview-fixture-email-001",
        idempotencyKey: "pnd50-inbound-forward-pnd50-preview-fixture-email-001",
      }),
    );
  });

  it("routes an allowlisted observed copy without forwarding it back to Gmail", async () => {
    const calls: string[] = [];
    const client = resendClient({
      retrieve: vi.fn(async () => {
        calls.push("retrieve");
        return { data: { text: "Need an accounting quote", headers: {} } };
      }),
      forward: vi.fn(async () => {
        calls.push("forward");
        return { data: { id: "unexpected-forward" } };
      }),
    });
    const options = handlerOptions({
      env: {
        RESEND_WEBHOOK_SECRET: secret,
        RESEND_API_KEY: "re_test_only",
        VERCEL_ENV: "production",
        PND50_INBOUND_DELIVERY_MODE: "observed_copy",
        PND50_INBOUND_OBSERVED_RECIPIENT: "pnd50-leads@owned.resend.app",
      },
      client,
      createResendClient: () => client,
      sendRouter: vi.fn(async (_event: LeadEventInput, _env: Record<string, string | undefined>) => {
        calls.push("router");
        return { ok: true as const, status: "accepted" as const, responseStatus: 202 };
      }),
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(
      signedRequest(emailEvent({ to: ["pnd50-leads@owned.resend.app"] })),
      response,
    );

    expect(result()).toMatchObject({
      statusCode: 200,
      body: {
        received: true,
        forwarded: false,
        delivery_mode: "observed_copy",
        router_accepted: true,
      },
    });
    expect(calls).toEqual(["retrieve", "router"]);
    expect(client.forward).not.toHaveBeenCalled();
  });

  it("journals a configured internal observed copy without retrieving its content", async () => {
    const client = resendClient();
    const options = handlerOptions({
      env: {
        RESEND_WEBHOOK_SECRET: secret,
        VERCEL_ENV: "production",
        PND50_INBOUND_DELIVERY_MODE: "observed_copy",
        PND50_INBOUND_OBSERVED_RECIPIENT: "pnd50-leads@owned.resend.app",
        PND50_INBOUND_INTERNAL_SENDERS: "owner@example.net",
      },
      client,
      createResendClient: () => client,
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(
      signedRequest(
        emailEvent({
          from: "Owner <owner@example.net>",
          to: ["pnd50-leads@owned.resend.app"],
          subject: "Payment and invoice status",
        }),
      ),
      response,
    );

    expect(result()).toMatchObject({
      statusCode: 200,
      body: {
        received: true,
        forwarded: false,
        internal_sender: true,
        router_accepted: true,
      },
    });
    expect(client.retrieve).not.toHaveBeenCalled();
    expect(client.forward).not.toHaveBeenCalled();
    expect(options.sendRouter.mock.calls[0][0]).toMatchObject({
      company: "example.net",
      detected_intent: "unknown",
      metadata: { event_type: "internal_email", inbound_kind: "internal" },
    });
  });

  it("treats the Burakorn operating domain as internal by default", async () => {
    const client = resendClient();
    const options = handlerOptions({
      env: {
        RESEND_WEBHOOK_SECRET: secret,
        VERCEL_ENV: "production",
        PND50_INBOUND_DELIVERY_MODE: "observed_copy",
        PND50_INBOUND_OBSERVED_RECIPIENT: "pnd50-leads@owned.resend.app",
      },
      client,
      createResendClient: () => client,
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(
      signedRequest(
        emailEvent({
          from: "Operations <staff@burakornpartners.com>",
          to: ["pnd50-leads@owned.resend.app"],
          subject: "Urgent payment status",
        }),
      ),
      response,
    );

    expect(result()).toMatchObject({
      statusCode: 200,
      body: { internal_sender: true, router_accepted: true },
    });
    expect(client.retrieve).not.toHaveBeenCalled();
    expect(options.sendRouter.mock.calls[0][0]).toMatchObject({
      detected_intent: "unknown",
      metadata: { inbound_kind: "internal" },
    });
  });

  it("ignores observed copies sent to a different receiving address", async () => {
    const options = handlerOptions({
      env: {
        RESEND_WEBHOOK_SECRET: secret,
        RESEND_API_KEY: "re_test_only",
        VERCEL_ENV: "production",
        PND50_INBOUND_DELIVERY_MODE: "observed_copy",
        PND50_INBOUND_OBSERVED_RECIPIENT: "pnd50-leads@owned.resend.app",
      },
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(
      signedRequest(emailEvent({ to: ["another-project@owned.resend.app"] })),
      response,
    );

    expect(result()).toEqual({
      statusCode: 200,
      body: {
        received: true,
        ignored: true,
        reason: "RECIPIENT_NOT_ALLOWED",
      },
    });
    expect(options.client.retrieve).not.toHaveBeenCalled();
    expect(options.client.forward).not.toHaveBeenCalled();
    expect(options.sendRouter).not.toHaveBeenCalled();
  });

  it("fails closed when observed-copy mode has no receiving allowlist", async () => {
    const options = handlerOptions({
      env: {
        RESEND_WEBHOOK_SECRET: secret,
        RESEND_API_KEY: "re_test_only",
        PND50_INBOUND_DELIVERY_MODE: "observed_copy",
      },
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(signedRequest(emailEvent()), response);

    expect(result()).toEqual({
      statusCode: 503,
      body: { error: "OBSERVED_RECIPIENT_NOT_CONFIGURED" },
    });
    expect(options.client.retrieve).not.toHaveBeenCalled();
    expect(options.client.forward).not.toHaveBeenCalled();
    expect(options.sendRouter).not.toHaveBeenCalled();
  });

  it("fails closed for an unknown delivery mode", async () => {
    const base = handlerOptions();
    const options = handlerOptions({
      env: {
        ...base.env,
        PND50_INBOUND_DELIVERY_MODE: "mirror_everything",
      },
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(signedRequest(emailEvent()), response);

    expect(result()).toEqual({
      statusCode: 503,
      body: { error: "INVALID_DELIVERY_MODE" },
    });
    expect(options.client.retrieve).not.toHaveBeenCalled();
    expect(options.client.forward).not.toHaveBeenCalled();
    expect(options.sendRouter).not.toHaveBeenCalled();
  });

  it("does not route when forwarding fails", async () => {
    const client = resendClient({
      forward: vi.fn(async () => ({ error: { name: "provider_error" } })),
    });
    const options = handlerOptions({ client, createResendClient: () => client });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(signedRequest(emailEvent()), response);

    expect(result()).toEqual({ statusCode: 502, body: { error: "FORWARD_FAILED" } });
    expect(options.sendRouter).not.toHaveBeenCalled();
  });

  it("keeps a successful forward successful when the Router fails", async () => {
    const options = handlerOptions({
      sendRouter: vi.fn(async (_event: LeadEventInput, _env: Record<string, string | undefined>) => {
        throw new Error("router unavailable");
      }),
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(signedRequest(emailEvent()), response);

    expect(result()).toMatchObject({
      statusCode: 200,
      body: { forwarded: true, router_accepted: false },
    });
  });

  it("never enables the synthetic shortcut in Production", async () => {
    const base = handlerOptions();
    const options = handlerOptions({
      env: {
        ...base.env,
        VERCEL_ENV: "production",
        PND50_INBOUND_FIXTURE_MODE: "true",
      },
    });
    const { response, result } = responseRecorder();
    await createInboundEmailHandler(options)(
      signedRequest(
        emailEvent({
          fixture_internal_sender: true,
          fixture_text: "Synthetic internal payment fixture",
        }),
      ),
      response,
    );

    expect(result()).toMatchObject({
      statusCode: 200,
      body: { fixture: false, forwarded: true, internal_sender: false },
    });
    expect(options.client.retrieve).toHaveBeenCalledTimes(1);
    expect(options.client.forward).toHaveBeenCalledTimes(1);
  });
});

describe("PND50 inbound LeadEvent privacy and classification", () => {
  const baseData = emailEvent().data;
  const now = new Date("2026-08-05T08:00:00.000Z");

  it("does not store full subject, body, headers, message id, or attachment metadata", () => {
    const event = buildInboundLeadEvent({
      data: {
        ...baseData,
        subject: "Private client name needs an accounting quote",
        attachments: [{ filename: "passport-private.pdf" }],
      },
      details: {
        text: "FULL PRIVATE BODY secret=do-not-store",
        html: "<p>PRIVATE HTML</p>",
        headers: { authorization: "Bearer private-token" },
      },
      now,
    });
    const serialized = JSON.stringify(event);
    for (const forbidden of [
      "Private client name",
      "FULL PRIVATE BODY",
      "do-not-store",
      "PRIVATE HTML",
      "private-token",
      "passport-private.pdf",
      "fixture-message-001",
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(event.metadata.has_attachments).toBe(true);
  });

  it.each([
    ["Automatic reply: away from office", {}, "automated", "system_report"],
    ["Monthly accounting newsletter", { "list-unsubscribe": "mailto:list@example.com" }, "bulk", "newsletter"],
    ["Improve domain authority with backlinks", {}, "spam", "newsletter"],
  ])("suppresses automated or bulk traffic: %s", (subject, headers, kind, eventType) => {
    const event = buildInboundLeadEvent({
      data: { ...baseData, subject },
      details: { text: "Accounting services", headers },
      now,
    });
    expect(event.detected_intent).toBe("unknown");
    expect(event.metadata).toMatchObject({ inbound_kind: kind, event_type: eventType });
  });

  it("marks a concrete accounting enquiry as a commercial intent", () => {
    const event = buildInboundLeadEvent({
      data: { ...baseData, subject: "Question" },
      details: { text: "We need bookkeeping and annual financial statements.", headers: {} },
      now,
    });
    expect(event.detected_intent).toBe("accounting");
    expect(event.message).toBe("Inbound email indicates commercial intent: accounting.");
  });

  it("classifies only the newest plain-text segment before quoted history", () => {
    const event = buildInboundLeadEvent({
      data: { ...baseData, subject: "Re: Thailand company setup" },
      details: {
        text: [
          "Could you send the proposal and fees for the next step?",
          "",
          "On Monday, August 10, 2026, Previous Sender wrote:",
          "> The earlier invoice was paid.",
        ].join("\n"),
        headers: {},
      },
      now,
    });
    expect(event.detected_intent).toBe("quote_request");
  });

  it("does not promote a neutral reply from payment words in quoted history", () => {
    const event = buildInboundLeadEvent({
      data: { ...baseData, subject: "Re: Thailand company setup" },
      details: {
        text: [
          "Thank you. We will review and reply tomorrow.",
          "",
          "-----Original Message-----",
          "Please pay the attached invoice today.",
        ].join("\n"),
        headers: {},
      },
      now,
    });
    expect(event.detected_intent).toBe("unknown");
  });

  it("removes HTML blockquotes before classification", () => {
    const event = buildInboundLeadEvent({
      data: { ...baseData, subject: "Re: Thailand company setup" },
      details: {
        html: "<p>Please send your proposal.</p><blockquote><p>The invoice was paid.</p></blockquote>",
        headers: {},
      },
      now,
    });
    expect(event.detected_intent).toBe("quote_request");
  });

  it("journals an internal sender without commercial classification", () => {
    const event = buildInboundLeadEvent({
      data: { ...baseData, subject: "Urgent payment and invoice" },
      details: { text: "Please pay this invoice today.", headers: {} },
      internalSender: true,
      now,
    });
    expect(event.detected_intent).toBe("unknown");
    expect(event.message).toBe("Internal email observed and journaled without paging.");
    expect(event.metadata).toMatchObject({
      event_type: "internal_email",
      inbound_kind: "internal",
      sender_scope: "internal",
    });
  });

  it("adds a domain-only source hint and authenticated Resend record link", () => {
    const event = buildInboundLeadEvent({ data: baseData, details: null, now });
    expect(event.company).toBe("example.com");
    expect(event.source_record_url).toBe(
      "https://resend.com/emails/pnd50-preview-fixture-email-001",
    );
  });

  it("keeps a stable event id for exact webhook replays", () => {
    const first = buildInboundLeadEvent({ data: baseData, details: null, now });
    const replay = buildInboundLeadEvent({
      data: baseData,
      details: { text: "A later content lookup result", headers: {} },
      now: new Date("2026-08-05T08:05:00.000Z"),
    });
    expect(first.event_id).toBe(replay.event_id);
    expect(first.event_id).toBe("pnd50:inbound:pnd50-preview-fixture-email-001");
  });
});

describe("PND50 Node Lead Router adapter", () => {
  const event = buildInboundLeadEvent({
    data: emailEvent().data,
    details: null,
    now: new Date("2026-08-05T08:00:00.000Z"),
  });

  it("is disabled without a Router URL", async () => {
    const fetchImpl = vi.fn();
    await expect(sendLeadEvent(event, { env: {}, fetchImpl })).resolves.toEqual({
      ok: false,
      status: "disabled",
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts only the normalized event with Preview authentication", async () => {
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response("{}", { status: 202 }),
    );
    await expect(
      sendLeadEvent(event, {
        env: {
          LEAD_ROUTER_URL: "https://router-preview.example/api",
          LEAD_ROUTER_SHARED_SECRET: "value-a",
          LEAD_ROUTER_PROTECTION_BYPASS: "value-b",
        },
        fetchImpl,
      }),
    ).resolves.toEqual({ ok: true, status: "accepted", responseStatus: 202 });

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://router-preview.example/api/lead-events");
    expect(init.headers).toMatchObject({
      "X-Lead-Router-Key": "value-a",
      "X-Lead-Router-Source": "pnd50-inbound-email",
      "x-vercel-protection-bypass": "value-b",
    });
    expect(init.body).toBe(JSON.stringify(event));
    expect(init.body).not.toContain("PUSHOVER");
  });

  it("fails closed if a Vercel Preview is pointed at the Production Router alias", async () => {
    const fetchImpl = vi.fn();
    await expect(
      sendLeadEvent(event, {
        env: {
          VERCEL_ENV: "preview",
          LEAD_ROUTER_URL: "https://lead-alarm-router.vercel.app",
          LEAD_ROUTER_SHARED_SECRET: "preview-only-secret",
        },
        fetchImpl,
      }),
    ).resolves.toEqual({ ok: false, status: "invalid_configuration" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("allows the stable private Router Preview alias", async () => {
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response("{}", { status: 202 }),
    );
    await expect(
      sendLeadEvent(event, {
        env: {
          VERCEL_ENV: "preview",
          LEAD_ROUTER_URL: "https://lead-alarm-router-karhar91-burakorn.vercel.app",
          LEAD_ROUTER_SHARED_SECRET: "preview-only-secret",
        },
        fetchImpl,
      }),
    ).resolves.toEqual({ ok: true, status: "accepted", responseStatus: 202 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("allows the verified private Router Preview deployment host", async () => {
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      Response.json(
        {
          event: { priority: "P1", detected_intent: "quote_request" },
          notification: {
            duplicate: true,
            delivery_status: "suppressed_duplicate",
            dry_run: true,
            payload: { message: "must not escape through the receipt" },
          },
        },
        { status: 202 },
      ),
    );
    await expect(
      sendLeadEvent(event, {
        env: {
          VERCEL_ENV: "preview",
          LEAD_ROUTER_URL: "https://lead-alarm-router-8h15hdcbo-burakorn.vercel.app",
          LEAD_ROUTER_SHARED_SECRET: "preview-only-secret",
        },
        fetchImpl,
      }),
    ).resolves.toEqual({
      ok: true,
      status: "accepted",
      responseStatus: 202,
      receipt: {
        priority: "P1",
        detected_intent: "quote_request",
        duplicate: true,
        delivery_status: "suppressed_duplicate",
        dry_run: true,
      },
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
