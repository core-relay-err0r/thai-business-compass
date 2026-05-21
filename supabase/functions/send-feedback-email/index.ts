import { Resend } from "resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

Deno.serve(async (req) => {
  const reqId = crypto.randomUUID().slice(0, 8);
  const startedAt = Date.now();
  const log = (...args: unknown[]) => console.log(`[feedback ${reqId}]`, ...args);
  const errLog = (...args: unknown[]) => console.error(`[feedback ${reqId}]`, ...args);

  log("incoming", {
    method: req.method,
    url: req.url,
    origin: req.headers.get("origin"),
    referer: req.headers.get("referer"),
    userAgent: req.headers.get("user-agent"),
    contentType: req.headers.get("content-type"),
    contentLength: req.headers.get("content-length"),
    hasAuth: !!req.headers.get("authorization"),
    hasApiKey: !!req.headers.get("apikey"),
  });

  if (req.method === "OPTIONS") {
    log("preflight OPTIONS");
    return new Response(null, { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    errLog("RESEND_API_KEY env var is missing");
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch (parseErr: any) {
      errLog("failed to parse JSON body:", parseErr?.message || parseErr);
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { feedback, pageUrl, timestamp } = body || {};
    log("payload received", {
      feedbackType: typeof feedback,
      feedbackLength: typeof feedback === "string" ? feedback.length : null,
      pageUrl,
      timestamp,
    });

    if (!feedback || typeof feedback !== "string" || feedback.trim().length === 0) {
      log("validation failed: empty feedback");
      return new Response(JSON.stringify({ error: "Feedback is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (feedback.length > 5000) {
      log("validation failed: feedback too long", feedback.length);
      return new Response(JSON.stringify({ error: "Feedback must be under 5000 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeFeedback = escapeHtml(feedback.trim());
    const safePageUrl = pageUrl ? escapeHtml(String(pageUrl).slice(0, 500)) : "N/A";
    const safeTimestamp = escapeHtml(String(timestamp || new Date().toISOString()));

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 24px; border-radius: 12px 12px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 22px;">📬 New Feedback</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">from PND50 website</p>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6; margin-bottom: 20px;">${safeFeedback}</div>
          <table style="width: 100%; font-size: 13px; color: #666;">
            <tr><td style="padding: 4px 0; width: 90px;">Page:</td><td><a href="${safePageUrl}" style="color: #0ea5e9;">${safePageUrl}</a></td></tr>
            <tr><td style="padding: 4px 0;">Time:</td><td>${safeTimestamp}</td></tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const from = "PND50 Feedback <noreply@pnd50.com>";
    const to = ["info@pnd50.com", "sebastian@avenkara.ai"];
    const subject = "New Feedback from PND50 website";

    log("calling Resend.emails.send", { from, to, subject, htmlBytes: html.length });
    const sendStart = Date.now();

    const response = await resend.emails.send({ from, to, subject, html });
    const sendMs = Date.now() - sendStart;

    log("Resend response", {
      ms: sendMs,
      data: response?.data ?? null,
      error: response?.error ?? null,
    });

    if (response?.error) {
      errLog("Resend returned error", response.error);
      return new Response(
        JSON.stringify({ error: "Email provider error", details: response.error }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    log("done OK", { totalMs: Date.now() - startedAt, messageId: response?.data?.id });

    return new Response(JSON.stringify({ success: true, id: response?.data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    errLog("unhandled exception", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      totalMs: Date.now() - startedAt,
    });
    return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});