import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedback, pageUrl, timestamp } = await req.json();

    if (!feedback || typeof feedback !== "string" || feedback.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Feedback is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (feedback.length > 5000) {
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

    const response = await resend.emails.send({
      from: "PND50 Feedback <noreply@pnd50.com>",
      to: ["info@pnd50.com", "sebastian@avenkara.ai"],
      subject: "New Feedback from PND50 website",
      html,
    });

    console.log("Feedback email sent:", response);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending feedback email:", error);
    return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});