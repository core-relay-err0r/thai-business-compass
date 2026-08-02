import assert from "node:assert/strict";
import test from "node:test";
import { buildContactLeadEvent, buildSubmissionLeadEvent } from "./pnd50-lead-events.ts";
import { sendLeadEvent } from "./lead-router.ts";

const serviceRequest = {
  contactInfo: {
    name: "Narin Example",
    email: "finance@example.co.th",
    phone: "+66000000000",
    preferredContact: "Email",
  },
  companyInfo: { companyName: "Example Co., Ltd." },
  notes: "Please send a quotation.",
  accountingResult: { totalMonthly: 25000 },
  selectedCorporateServices: [],
  selectedConsultingServices: [],
};

test("PND50 service payload is normalized for P1 classification", () => {
  const event = buildSubmissionLeadEvent(serviceRequest, "2026-08-02T08:00:00.000Z");
  assert.equal(event.source_project, "PND50 / Thai Business Compass");
  assert.equal(event.detected_intent, "accounting");
  assert.equal(event.estimated_value, "medium");
  assert.equal(event.metadata.event_type, "service_request");
  assert.equal(event.metadata.service_selected, true);
  assert.match(event.message, /quotation/i);
});

test("PND50 contact payload keeps only a compact message", () => {
  const event = buildContactLeadEvent(
    {
      fullName: "Contact Example",
      email: "contact@example.com",
      companyName: "Example Co.",
      message: `Urgent ${"x".repeat(500)}`,
    },
    "2026-08-02T08:00:00.000Z",
  );
  assert.equal(event.message.length, 300);
  assert.equal(event.detected_intent, "unknown");
});

test("router adapter is disabled when LEAD_ROUTER_URL is absent", async () => {
  let called = false;
  const result = await sendLeadEvent(buildSubmissionLeadEvent(serviceRequest), {
    envGet: () => undefined,
    fetchImpl: async () => {
      called = true;
      return new Response(null, { status: 202 });
    },
  });
  assert.deepEqual(result, { ok: false, status: "disabled" });
  assert.equal(called, false);
});

test("router adapter refuses a URL without the shared secret", async () => {
  let called = false;
  const result = await sendLeadEvent(buildSubmissionLeadEvent(serviceRequest), {
    envGet: (name) => name === "LEAD_ROUTER_URL" ? "https://router.example/api" : undefined,
    fetchImpl: async () => {
      called = true;
      return new Response(null, { status: 202 });
    },
  });
  assert.deepEqual(result, { ok: false, status: "invalid_configuration" });
  assert.equal(called, false);
});

test("router adapter posts normalized data without Pushover credentials", async () => {
  let request;
  const result = await sendLeadEvent(buildSubmissionLeadEvent(serviceRequest), {
    envGet: (name) => {
      if (name === "LEAD_ROUTER_URL") return "https://router.example/api";
      if (name === "LEAD_ROUTER_SHARED_SECRET") return "router-test-secret";
      if (name === "LEAD_ROUTER_PROTECTION_BYPASS") return "preview-bypass";
      return undefined;
    },
    fetchImpl: async (url, init) => {
      request = { url, init };
      return new Response("{}", { status: 202 });
    },
  });

  assert.deepEqual(result, { ok: true, status: "accepted", responseStatus: 202 });
  assert.equal(request.url, "https://router.example/api/lead-events");
  assert.equal(request.init.headers["X-Lead-Router-Key"], "router-test-secret");
  assert.equal(request.init.headers["x-vercel-protection-bypass"], "preview-bypass");
  assert.equal(request.init.body.includes("PUSHOVER"), false);
});

test("router adapter accepts the full lead-events endpoint", async () => {
  let requestUrl;
  const result = await sendLeadEvent(buildSubmissionLeadEvent(serviceRequest), {
    envGet: (name) => {
      if (name === "LEAD_ROUTER_URL") return "https://router.example/api/lead-events";
      if (name === "LEAD_ROUTER_SHARED_SECRET") return "router-test-secret";
      return undefined;
    },
    fetchImpl: async (url) => {
      requestUrl = url;
      return new Response("{}", { status: 202 });
    },
  });
  assert.equal(result.ok, true);
  assert.equal(requestUrl, "https://router.example/api/lead-events");
});
