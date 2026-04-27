// Vercel Serverless Function: /api/resend/inbound
// Receives inbound email webhooks from Resend and logs them to Vercel function logs.
// NOTE: This file is maintained manually outside the Lovable workflow.
// Deployed automatically by Vercel from the `api/` directory.

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
    // Vercel parses JSON bodies automatically when content-type is application/json
    const payload = req.body ?? {};

    console.log("[resend-inbound] received at", new Date().toISOString());
    console.log("[resend-inbound] headers:", JSON.stringify(req.headers, null, 2));
    console.log("[resend-inbound] payload:", JSON.stringify(payload, null, 2));

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("[resend-inbound] error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}