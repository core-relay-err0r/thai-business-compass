import test from "node:test";
import assert from "node:assert/strict";
import { buildContactLeadEvent } from "./pnd50-lead-events.ts";

test("puts sanitized attribution in the existing internal lead event", () => {
  const result = buildContactLeadEvent({
    fullName: "Test", email: "test@example.com", message: "Test",
    attribution: { utm_source: "google", email: "private@example.com" },
  });
  assert.deepEqual(result.metadata.attribution, { utm_source: "google" });
  assert.equal(result.source_channel, "website_form");
});
