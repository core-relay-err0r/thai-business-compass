import assert from "node:assert/strict";
import test from "node:test";
import { summarizeResendDelivery } from "./resend-delivery.ts";

test("accepts a Resend delivery only when an id is present without an error", () => {
  assert.deepEqual(summarizeResendDelivery({ data: { id: "email-id" }, error: null }), {
    accepted: true,
  });
});

test("rejects an explicit provider error even if an id is present", () => {
  assert.deepEqual(
    summarizeResendDelivery({ data: { id: "email-id" }, error: { name: "Validation Error" } }),
    { accepted: false, errorCode: "validation_error" },
  );
});

test("reports a missing provider id without exposing provider details", () => {
  assert.deepEqual(summarizeResendDelivery({ data: null, error: null }), {
    accepted: false,
    errorCode: "missing_message_id",
  });
});

test("normalizes and bounds the provider error name", () => {
  const result = summarizeResendDelivery({
    data: null,
    error: { name: `Unsafe provider failure ${"x".repeat(100)}` },
  });

  assert.equal(result.accepted, false);
  assert.match(result.errorCode, /^[a-z0-9_]+$/);
  assert.ok(result.errorCode.length <= 64);
});
