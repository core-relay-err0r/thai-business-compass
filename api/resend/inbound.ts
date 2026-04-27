// Vercel Serverless Function: /api/resend/inbound
// Receives inbound email webhooks from Resend, logs them, and forwards to a Gmail address.
// NOTE: This file is maintained manually outside the Lovable workflow.
// Deployed automatically by Vercel from the `api/` directory.
//
// Required Vercel env vars:
//   - RESEND_API_KEY    Your Resend API key
//   - FORWARD_TO        Destination email address (e.g. you@gmail.com)
//   - FORWARD_FROM      (optional) Verified sender, defaults to "info@pnd50.com"

import { Resend } from "resend";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "Resend inbound endpoint is live" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body ?? {};
    const email = payload.data ?? payload;

    console.log("[resend-inbound] received at", new Date().toISOString());
    console.log("[resend-inbound] headers:", JSON.stringify(req.headers, null, 2));
    console.log("[resend-inbound] payload:", JSON.stringify(payload, null, 2));

    const apiKey = process.env.RESEND_API_KEY;
    const forwardTo = process.env.FORWARD_TO;
    const forwardFrom = process.env.FORWARD_FROM || "info@pnd50.com";

    if (!apiKey) {
      console.error("[resend-inbound] RESEND_API_KEY is not set");
      return res.status(200).json({ received: true, forwarded: false, reason: "missing RESEND_API_KEY" });
    }
    if (!forwardTo) {
      console.error("[resend-inbound] FORWARD_TO is not set");
      return res.status(200).json({ received: true, forwarded: false, reason: "missing FORWARD_TO" });
    }

    const resend = new Resend(apiKey);

    const subject = email.subject || "No subject";
    const fromAddr = email.from || "(unknown sender)";
    const toAddr = Array.isArray(email.to) ? email.to.join(", ") : (email.to || "(unknown recipient)");
    const bodyText = email.text || email.html || "No body";

    const { data, error } = await resend.emails.send({
      from: forwardFrom,
      to: forwardTo,
      subject: `[Forwarded from info@pnd50.com] ${subject}`,
      text: `From: ${fromAddr}\nTo: ${toAddr}\nSubject: ${subject}\n\n${bodyText}`,
    });

    if (error) {
      console.error("[resend-inbound] forward error:", error);
      return res.status(200).json({ received: true, forwarded: false, error });
    }

    console.log("[resend-inbound] forwarded:", data?.id);
    return res.status(200).json({ received: true, forwarded: true, id: data?.id });
  } catch (err) {
    console.error("[resend-inbound] error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}