import { Resend } from "resend";

const RECIPIENTS = [
  "info@pnd50.com",
  "sebastian@avenkara.ai",
  "protocol@avenkara.ai",
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  companyName: "Company",
  subject: "Subject",
  message: "Message",
  preferredContact: "Preferred contact",
  selectedServices: "Selected services",
  feedback: "Feedback",
  rating: "Rating",
};

function formatLabel(key: string) {
  return FIELD_LABELS[key] ?? key.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ");
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map(formatValue).join(", ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function buildRows(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [["Details", formatValue(payload)]] as const;
  }

  return Object.entries(payload as Record<string, unknown>).map(([key, value]) => [
    formatLabel(key),
    formatValue(value),
  ] as const);
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
  const rows = buildRows(payload);
  const submittedAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date());
  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="width:180px;padding:14px 16px;border-bottom:1px solid #e5e5e5;color:#666;font-size:13px;font-weight:600;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:14px 16px;border-bottom:1px solid #e5e5e5;color:#111;font-size:15px;line-height:1.55;white-space:pre-wrap;word-break:break-word">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
  const text = [
    subject,
    `Submitted: ${submittedAt} (Bangkok time)`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

  const response = await resend.emails.send({
    from: "PND50 Website <noreply@pnd50.com>",
    to: RECIPIENTS,
    subject,
    text,
    html: `<!doctype html>
      <html>
        <body style="margin:0;background:#f4f4f2;color:#111;font-family:Arial,Helvetica,sans-serif">
          <div style="display:none;max-height:0;overflow:hidden">New enquiry received through pnd50.com</div>
          <main style="max-width:680px;margin:0 auto;padding:32px 16px">
            <div style="background:#111;padding:22px 24px;color:#fff">
              <div style="font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase">PND50</div>
              <h1 style="margin:10px 0 0;font-size:24px;line-height:1.3">${escapeHtml(subject)}</h1>
            </div>
            <div style="background:#fff;border:1px solid #ddd;border-top:0">
              <div style="padding:18px 24px;border-bottom:1px solid #e5e5e5;color:#555;font-size:13px">
                Submitted ${escapeHtml(submittedAt)} (Bangkok time) via
                <a href="https://pnd50.com" style="color:#111;font-weight:600">pnd50.com</a>
              </div>
              <table role="presentation" style="width:100%;border-collapse:collapse">${tableRows}</table>
              <div style="padding:18px 24px;color:#777;font-size:12px;line-height:1.5">
                This message was sent automatically to the PND50 enquiry team.
              </div>
            </div>
          </main>
        </body>
      </html>`,
  });

  if (response.error) {
    console.error("[protocol-copy] Resend rejected the copy", response.error);
    return null;
  }

  return response.data;
}
