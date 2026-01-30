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
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name:</td><td style="padding: 8px 0;"><strong>${data.fullName}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;"><strong><a href="mailto:${data.email}" style="color: #0ea5e9;">${data.email}</a></strong></td></tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><strong><a href="tel:${data.phone}" style="color: #0ea5e9;">${data.phone}</a></strong></td></tr>` : ''}
          ${data.whatsapp ? `<tr><td style="padding: 8px 0; color: #666;">WhatsApp:</td><td style="padding: 8px 0;"><strong><a href="https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}" style="color: #25D366;">${data.whatsapp}</a></strong></td></tr>` : ''}
          ${data.companyName ? `<tr><td style="padding: 8px 0; color: #666;">Company:</td><td style="padding: 8px 0;"><strong>${data.companyName}</strong></td></tr>` : ''}
        </table>

        <h2 style="margin: 0 0 16px 0; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Message</h2>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">
${data.message}
        </div>
      </div>
      
      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 24px;">
        This message was sent from the PND50 contact form.
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
    
    console.log("Received contact message from:", data.fullName, data.email);

    // Validate required fields
    if (!data.fullName || !data.email || !data.message) {
      throw new Error("Missing required fields: name, email, or message");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email address");
    }

    const html = generateEmailHtml(data);

    const emailResponse = await resend.emails.send({
      from: "PND50 <noreply@pnd50.com>",
      to: ["info@pnd50.com"],
      reply_to: data.email,
      subject: `Contact: ${data.fullName}${data.companyName ? ` (${data.companyName})` : ''}`,
      html,
    });

    console.log("Contact email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
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
