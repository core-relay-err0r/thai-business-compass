import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SubmissionRequest {
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    preferredContact: string;
  };
  companyInfo: {
    companyName: string;
    registrationNumber?: string;
    industry?: string;
  };
  notes?: string;
  accountingResult?: {
    totalMonthly: number;
    totalAnnual: number;
    requiredItems: string[];
  };
  selectedCorporateServices: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  selectedConsultingServices: Array<{
    id: string;
    name: string;
    priceRange: { min: number; max: number };
  }>;
}

function formatPrice(price: number): string {
  return price.toLocaleString();
}

function generateEmailHtml(data: SubmissionRequest): string {
  const { contactInfo, companyInfo, notes, accountingResult, selectedCorporateServices, selectedConsultingServices } = data;
  
  let servicesHtml = "";

  // Accounting Services
  if (accountingResult) {
    servicesHtml += `
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #333;">📊 Accounting Services</h3>
        <p style="margin: 4px 0;"><strong>Monthly:</strong> ฿${formatPrice(accountingResult.totalMonthly)}</p>
        <p style="margin: 4px 0;"><strong>Annual:</strong> ฿${formatPrice(accountingResult.totalAnnual)}</p>
        <p style="margin: 4px 0;"><strong>Required:</strong> ${accountingResult.requiredItems.join(", ")}</p>
      </div>
    `;
  }

  // Corporate Services
  if (selectedCorporateServices.length > 0) {
    const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
    servicesHtml += `
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #333;">🏢 Corporate Services</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${selectedCorporateServices.map(s => `<li>${s.name} - ฿${formatPrice(s.price)}</li>`).join("")}
        </ul>
        <p style="margin: 12px 0 0 0;"><strong>Total:</strong> ฿${formatPrice(corporateTotal)}</p>
      </div>
    `;
  }

  // Consulting Services
  if (selectedConsultingServices.length > 0) {
    servicesHtml += `
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #333;">💬 Consulting Services</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${selectedConsultingServices.map(s => `<li>${s.name} - ฿${formatPrice(s.priceRange.min)}–${formatPrice(s.priceRange.max)}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  if (!servicesHtml) {
    servicesHtml = '<p style="color: #666;">No services selected</p>';
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 24px; border-radius: 12px 12px 0 0; color: white;">
        <h1 style="margin: 0; font-size: 24px;">New Service Request</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">from PND50 website</p>
      </div>
      
      <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="margin: 0 0 16px 0; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Contact Information</h2>
        <table style="width: 100%; margin-bottom: 24px;">
          <tr><td style="padding: 4px 0; color: #666;">Name:</td><td style="padding: 4px 0;"><strong>${contactInfo.name}</strong></td></tr>
          <tr><td style="padding: 4px 0; color: #666;">Email:</td><td style="padding: 4px 0;"><strong><a href="mailto:${contactInfo.email}">${contactInfo.email}</a></strong></td></tr>
          <tr><td style="padding: 4px 0; color: #666;">Phone:</td><td style="padding: 4px 0;"><strong>${contactInfo.phone || "Not provided"}</strong></td></tr>
          <tr><td style="padding: 4px 0; color: #666;">Preferred Contact:</td><td style="padding: 4px 0;"><strong>${contactInfo.preferredContact}</strong></td></tr>
        </table>

        <h2 style="margin: 0 0 16px 0; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Company Information</h2>
        <table style="width: 100%; margin-bottom: 24px;">
          <tr><td style="padding: 4px 0; color: #666;">Company Name:</td><td style="padding: 4px 0;"><strong>${companyInfo.companyName}</strong></td></tr>
          <tr><td style="padding: 4px 0; color: #666;">Registration #:</td><td style="padding: 4px 0;"><strong>${companyInfo.registrationNumber || "Not provided"}</strong></td></tr>
          <tr><td style="padding: 4px 0; color: #666;">Industry:</td><td style="padding: 4px 0;"><strong>${companyInfo.industry || "Not provided"}</strong></td></tr>
        </table>

        <h2 style="margin: 0 0 16px 0; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Selected Services</h2>
        ${servicesHtml}

        ${notes ? `
          <h2 style="margin: 24px 0 16px 0; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Additional Notes</h2>
          <p style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 0; white-space: pre-wrap;">${notes}</p>
        ` : ""}
      </div>
      
      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 24px;">
        This email was sent from the PND50 website submission form.
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
    const data: SubmissionRequest = await req.json();
    
    console.log("Received submission request:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.contactInfo?.name || !data.contactInfo?.email || !data.companyInfo?.companyName) {
      throw new Error("Missing required fields: name, email, or company name");
    }

    const html = generateEmailHtml(data);

    const emailResponse = await resend.emails.send({
      from: "PND50 <noreply@pnd50.com>",
      to: ["info@pnd50.com"],
      reply_to: data.contactInfo.email,
      subject: `New Service Request from ${data.contactInfo.name} (${data.companyInfo.companyName})`,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-submission function:", error);
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
