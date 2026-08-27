export interface ResendDeliveryResponse {
  data?: {
    id?: unknown;
  } | null;
  error?: {
    name?: unknown;
  } | null;
}

export interface ResendDeliverySummary {
  accepted: boolean;
  errorCode?: string;
}

function normalizeErrorName(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);

  return normalized || undefined;
}

export function summarizeResendDelivery(
  response: ResendDeliveryResponse | undefined,
): ResendDeliverySummary {
  const accepted =
    typeof response?.data?.id === "string" &&
    response.data.id.length > 0 &&
    !response.error;

  if (accepted) return { accepted: true };

  return {
    accepted: false,
    errorCode:
      normalizeErrorName(response?.error?.name) ??
      (response?.error ? "provider_rejected" : "missing_message_id"),
  };
}
