import { afterEach, describe, expect, it, vi } from "vitest";
import previewFixtureHandler from "../../api/resend/preview-fixture.js";

function responseRecorder() {
  let statusCode = 200;
  let body: unknown;
  const response = {
    setHeader: vi.fn(),
    status(code: number) {
      statusCode = code;
      return response;
    },
    json(value: unknown) {
      body = value;
      return response;
    },
  };
  return { response, result: () => ({ statusCode, body }) };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe.sequential("PND50 hosted Preview fixture trigger", () => {
  it("is unavailable in Production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const { response, result } = responseRecorder();
    await previewFixtureHandler(
      { method: "POST", query: { scenario: "internal_sender" } },
      response,
    );
    expect(result()).toEqual({ statusCode: 404, body: { error: "NOT_FOUND" } });
  });

  it("rejects scenarios outside the fixed synthetic allowlist", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("PND50_INBOUND_FIXTURE_MODE", "true");
    const { response, result } = responseRecorder();
    await previewFixtureHandler(
      { method: "POST", query: { scenario: "arbitrary_payload" } },
      response,
    );
    expect(result()).toEqual({
      statusCode: 400,
      body: { error: "INVALID_SCENARIO" },
    });
  });

  it("signs and journals the fixed internal fixture without a Router URL", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("PND50_INBOUND_FIXTURE_MODE", "true");
    vi.stubEnv("PND50_INBOUND_DELIVERY_MODE", "observed_copy");
    vi.stubEnv("PND50_INBOUND_OBSERVED_RECIPIENT", "pnd50-leads@owned.resend.app");
    vi.stubEnv(
      "RESEND_WEBHOOK_SECRET",
      `whsec_${Buffer.from("pnd50-preview-trigger-secret-32").toString("base64")}`,
    );
    vi.stubEnv("LEAD_ROUTER_URL", "");
    const { response, result } = responseRecorder();
    await previewFixtureHandler(
      { method: "POST", query: { scenario: "internal_sender" } },
      response,
    );
    expect(result()).toMatchObject({
      statusCode: 200,
      body: {
        scenario: "internal_sender",
        result: {
          received: true,
          fixture: true,
          internal_sender: true,
          router_accepted: false,
        },
      },
    });
  });
});
