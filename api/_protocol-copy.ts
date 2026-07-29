import { Resend } from "resend";

const RECIPIENT = "protocol@avenkara.ai";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendProtocolCopy({
  subject,
  payload,
}: {
  subject: string;
  payload: unknown;
}) {
  const apiKey = process.env.RESEND_API_KEY_2;
  if (!apiKey) {
    console.error("[protocol-copy] RESEND_API_KEY_2 is not configured");
    return null;
  }

  const resend = new Resend(apiKey);
  const json = JSON.stringify(payload, null, 2).slice(0, 25_000);
  const response = await resend.emails.send({
    from: "PND50 Website <noreply@pnd50.com>",
    to: [RECIPIENT],
    subject,
    html: `<main style="font-family:Arial,sans-serif;max-width:720px;margin:auto;padding:24px;color:#111"><h1 style="font-size:22px">${escapeHtml(subject)}</h1><p>Automatic copy from pnd50.com.</p><pre style="white-space:pre-wrap;background:#f4f4f4;padding:16px;border:1px solid #ddd">${escapeHtml(json)}</pre></main>`,
  });

  if (response.error) {
    console.error("[protocol-copy] Resend rejected the copy", response.error);
    return null;
  }

  return response.data;
}
