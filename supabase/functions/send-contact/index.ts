import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactRequest {
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  companyName?: string;
  message: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) : str;
}

function generateEmailHtml(data: ContactRequest): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 24px; border-radius: 12px 12px 0 0; color: white;">
        <h1 style="margin: 0; font-size: 24px;">New Contact Message</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">from PND50 website</p>
      </div>
      
      <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="margin: 0 0 16px 0; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Contact Details</h2>
        <table style="width: 100%; margin-bottom: 24px;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name:</td><td style="padding: 8px 0;"><strong>${escapeHtml(data.fullName)}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;"><strong><a href="mailto:${encodeURIComponent(data.email)}" style="color: #0ea5e9;">${escapeHtml(data.email)}</a></strong></td></tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><strong><a href="tel:${data.phone.replace(/[^0-9+\- ]/g, '')}" style="color: #0ea5e9;">${escapeHtml(data.phone)}</a></strong></td></tr>` : ''}
          ${data.whatsapp ? `<tr><td style="padding: 8px 0; color: #666;">WhatsApp:</td><td style="padding: 8px 0;"><strong><a href="https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}" style="color: #25D366;">${escapeHtml(data.whatsapp)}</a></strong></td></tr>` : ''}
          ${data.companyName ? `<tr><td style="padding: 8px 0; color: #666;">Company:</td><td style="padding: 8px 0;"><strong>${escapeHtml(data.companyName)}</strong></td></tr>` : ''}
        </table>

        <h2 style="margin: 0 0 16px 0; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Message</h2>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">
${escapeHtml(data.message)}
        </div>
      </div>
      
      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 24px;">
        This message was sent from the PND50 contact form.
      </p>
    </body>
    </html>
  `;
}

function generateClientConfirmationHtml(data: ContactRequest): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 32px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Thank you for reaching out!</h1>
        <p style="margin: 12px 0 0 0; opacity: 0.95; font-size: 16px;">We've received your message, ${escapeHtml(data.fullName.split(' ')[0])}</p>
      </div>
      
      <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #bae6fd;">
          <p style="margin: 0; color: #0369a1; font-size: 15px; line-height: 1.6;">
            Our team will review your message and get back to you within <strong>1-2 business days</strong>.
          </p>
        </div>

        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📝 Your Message</h2>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6; color: #374151;">
${escapeHtml(data.message)}
        </div>

        <div style="margin-top: 28px; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
          <h3 style="margin: 0 0 12px 0; color: #166534; font-size: 14px;">📞 Need immediate assistance?</h3>
          <p style="margin: 0; color: #15803d; font-size: 14px; line-height: 1.6;">
            Feel free to reach us directly at <a href="mailto:info@pnd50.com" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">info@pnd50.com</a>
          </p>
        </div>
      </div>
      
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
        This is an automated confirmation from PND50.
      </p>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactRequest = await req.json();

    // Truncate and sanitize inputs
    data.fullName = truncate(String(data.fullName || '').trim(), 100);
    data.email = truncate(String(data.email || '').trim(), 255);
    data.message = truncate(String(data.message || '').trim(), 5000);
    if (data.phone) data.phone = truncate(String(data.phone).trim(), 30);
    if (data.whatsapp) data.whatsapp = truncate(String(data.whatsapp).trim(), 30);
    if (data.companyName) data.companyName = truncate(String(data.companyName).trim(), 200);

    // Validate required fields
    if (!data.fullName || !data.email || !data.message) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, email, or message" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    }

    const internalHtml = generateEmailHtml(data);
    const clientHtml = generateClientConfirmationHtml(data);

    // Send both emails in parallel
    const [internalResponse, clientResponse] = await Promise.all([
      // Email to internal team
      resend.emails.send({
        from: "PND50 <noreply@pnd50.com>",
        to: ["info@pnd50.com", "sebastian@avenkara.ai"],
        reply_to: data.email,
        subject: `Contact: ${data.fullName}${data.companyName ? ` (${data.companyName})` : ''}`,
        html: internalHtml,
      }),
      // Confirmation email to client
      resend.emails.send({
        from: "PND50 <noreply@pnd50.com>",
        to: [data.email],
        subject: `We've received your message - PND50`,
        html: clientHtml,
      }),
    ]);

    console.log("Emails sent successfully:", { internal: internalResponse, client: clientResponse });

    return new Response(JSON.stringify({ success: true, data: { internal: internalResponse, client: clientResponse } }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
