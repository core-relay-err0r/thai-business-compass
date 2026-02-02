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
    monthlyBase?: number;
    monthlyAddons?: Array<{ name: string; amount: number; required: boolean }>;
    annualAddons?: Array<{ name: string; amount: number; required: boolean }>;
    requiredItems: string[];
    recommendedItems?: string[];
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
  
  // Calculate totals for payment summary
  const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
  const consultingMin = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.min, 0);
  const consultingMax = selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.max, 0);
  
  const monthlyFee = accountingResult?.totalMonthly ?? 0;
  const annualFees = accountingResult?.annualAddons?.reduce((sum, a) => sum + a.amount, 0) ?? 0;
  
  const initialMin = corporateTotal + consultingMin;
  const initialMax = corporateTotal + consultingMax;
  
  const firstYearMin = initialMin + (monthlyFee * 12) + annualFees;
  const firstYearMax = initialMax + (monthlyFee * 12) + annualFees;
  
  let servicesHtml = "";

  // Accounting Services - detailed breakdown
  if (accountingResult) {
    const monthlyBase = accountingResult.monthlyBase ?? accountingResult.totalMonthly;
    const monthlyAddons = accountingResult.monthlyAddons ?? [];
    const annualAddons = accountingResult.annualAddons ?? [];
    
    servicesHtml += `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #3b82f6;">
        <h3 style="margin: 0 0 16px 0; color: #1e40af; font-size: 16px;">📊 Accounting Services</h3>
        
        <div style="margin-bottom: 16px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">Monthly Fees</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #6b7280;">Base Fee</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(monthlyBase)}</td>
            </tr>
            ${monthlyAddons.map(addon => `
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">+ ${addon.name}${addon.required ? ' (Required)' : ''}</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(addon.amount)}</td>
              </tr>
            `).join('')}
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 8px 0 4px 0; font-weight: 600; color: #1f2937;">Monthly Total</td>
              <td style="padding: 8px 0 4px 0; text-align: right; font-weight: 700; color: #1e40af;">$${formatPrice(accountingResult.totalMonthly)}/mo</td>
            </tr>
          </table>
        </div>
        
        ${annualAddons.length > 0 ? `
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">Annual Fees</p>
            <table style="width: 100%; border-collapse: collapse;">
              ${annualAddons.map(addon => `
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">${addon.name}${addon.required ? ' (Required)' : ''}</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(addon.amount)}</td>
                </tr>
              `).join('')}
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 8px 0 4px 0; font-weight: 600; color: #1f2937;">Annual Total</td>
                <td style="padding: 8px 0 4px 0; text-align: right; font-weight: 700; color: #1e40af;">$${formatPrice(annualFees)}/yr</td>
              </tr>
            </table>
          </div>
        ` : ''}
        
        ${accountingResult.requiredItems.length > 0 ? `
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #6b7280;">
            <strong>Required:</strong> ${accountingResult.requiredItems.join(", ")}
          </p>
        ` : ''}
      </div>
    `;
  }

  // Corporate Services
  if (selectedCorporateServices.length > 0) {
    servicesHtml += `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #10b981;">
        <h3 style="margin: 0 0 16px 0; color: #047857; font-size: 16px;">🏢 Corporate Services</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${selectedCorporateServices.map(s => `
            <tr>
              <td style="padding: 4px 0; color: #6b7280;">${s.name}</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(s.price)}</td>
            </tr>
          `).join("")}
          <tr style="border-top: 1px solid #e5e7eb;">
            <td style="padding: 8px 0 4px 0; font-weight: 600; color: #1f2937;">Total</td>
            <td style="padding: 8px 0 4px 0; text-align: right; font-weight: 700; color: #047857;">$${formatPrice(corporateTotal)}</td>
          </tr>
        </table>
      </div>
    `;
  }

  // Consulting Services
  if (selectedConsultingServices.length > 0) {
    servicesHtml += `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #8b5cf6;">
        <h3 style="margin: 0 0 16px 0; color: #6d28d9; font-size: 16px;">💬 Consulting Services</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${selectedConsultingServices.map(s => `
            <tr>
              <td style="padding: 4px 0; color: #6b7280;">${s.name}</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(s.priceRange.min)}–$${formatPrice(s.priceRange.max)}</td>
            </tr>
          `).join("")}
          <tr style="border-top: 1px solid #e5e7eb;">
            <td style="padding: 8px 0 4px 0; font-weight: 600; color: #1f2937;">Total Range</td>
            <td style="padding: 8px 0 4px 0; text-align: right; font-weight: 700; color: #6d28d9;">$${formatPrice(consultingMin)}–$${formatPrice(consultingMax)}</td>
          </tr>
        </table>
      </div>
    `;
  }

  if (!servicesHtml) {
    servicesHtml = '<p style="color: #6b7280; padding: 16px; background: #f8f9fa; border-radius: 8px;">No services selected</p>';
  }

  // Payment Summary section
  const hasServices = accountingResult || selectedCorporateServices.length > 0 || selectedConsultingServices.length > 0;
  const paymentSummaryHtml = hasServices ? `
    <div style="background: linear-gradient(135deg, #dbeafe, #ede9fe); padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #c7d2fe;">
      <h2 style="margin: 0 0 20px 0; color: #1e3a8a; font-size: 18px;">💵 Payment Summary</h2>
      
      ${(corporateTotal > 0 || consultingMin > 0) ? `
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Initial Payment</p>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">Due at start of engagement</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            ${corporateTotal > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #4b5563;">Corporate Services</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(corporateTotal)}</td>
              </tr>
            ` : ''}
            ${consultingMin > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #4b5563;">Consulting (indicative)</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(consultingMin)}–$${formatPrice(consultingMax)}</td>
              </tr>
            ` : ''}
            <tr style="border-top: 1px solid #a5b4fc;">
              <td style="padding: 8px 0 4px 0; font-weight: 600; color: #1f2937;">Initial Total</td>
              <td style="padding: 8px 0 4px 0; text-align: right; font-weight: 700; color: #1e40af;">
                ${initialMin === initialMax ? `$${formatPrice(initialMin)}` : `$${formatPrice(initialMin)}–$${formatPrice(initialMax)}`}
              </td>
            </tr>
          </table>
        </div>
      ` : ''}
      
      ${monthlyFee > 0 ? `
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Monthly Recurring</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #4b5563;">Accounting Services</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(monthlyFee)}/month</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #4b5563;">First Year (12 months)</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #1e40af;">$${formatPrice(monthlyFee * 12)}</td>
            </tr>
          </table>
        </div>
      ` : ''}
      
      ${annualFees > 0 ? `
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Annual Fees</p>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">Due at financial year-end</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            ${(accountingResult?.annualAddons ?? []).map(addon => `
              <tr>
                <td style="padding: 4px 0; color: #4b5563;">${addon.name}</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 500;">$${formatPrice(addon.amount)}</td>
              </tr>
            `).join('')}
            <tr style="border-top: 1px solid #a5b4fc;">
              <td style="padding: 8px 0 4px 0; font-weight: 600; color: #1f2937;">Annual Total</td>
              <td style="padding: 8px 0 4px 0; text-align: right; font-weight: 700; color: #1e40af;">$${formatPrice(annualFees)}</td>
            </tr>
          </table>
        </div>
      ` : ''}
      
      <div style="border-top: 2px solid #6366f1; padding-top: 16px; margin-top: 8px;">
        <table style="width: 100%;">
          <tr>
            <td style="font-weight: 700; font-size: 16px; color: #1e3a8a;">ESTIMATED FIRST-YEAR TOTAL</td>
            <td style="text-align: right; font-weight: 800; font-size: 18px; color: #1e3a8a;">
              ${firstYearMin === firstYearMax ? `$${formatPrice(firstYearMin)}` : `$${formatPrice(firstYearMin)}–$${formatPrice(firstYearMax)}`}
            </td>
          </tr>
        </table>
      </div>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; color: #1f2937; background-color: #f9fafb;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 28px; border-radius: 12px 12px 0 0; color: white;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Service Request</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">from ${contactInfo.name} • ${companyInfo.companyName}</p>
      </div>
      
      <div style="background: white; padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        
        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">👤 Contact Information</h2>
        <table style="width: 100%; margin-bottom: 28px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: 500;">${contactInfo.name}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0; font-weight: 500;"><a href="mailto:${contactInfo.email}" style="color: #2563eb; text-decoration: none;">${contactInfo.email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0; font-weight: 500;">${contactInfo.phone || "Not provided"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Preferred Contact</td><td style="padding: 6px 0; font-weight: 500;">${contactInfo.preferredContact}</td></tr>
        </table>

        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">🏬 Company Information</h2>
        <table style="width: 100%; margin-bottom: 28px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Company Name</td><td style="padding: 6px 0; font-weight: 500;">${companyInfo.companyName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Registration #</td><td style="padding: 6px 0; font-weight: 500;">${companyInfo.registrationNumber || "Not provided"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Industry</td><td style="padding: 6px 0; font-weight: 500;">${companyInfo.industry || "Not provided"}</td></tr>
        </table>

        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📋 Selected Services</h2>
        ${servicesHtml}

        ${paymentSummaryHtml}

        ${notes ? `
          <h2 style="margin: 28px 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📝 Additional Notes</h2>
          <p style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 0; white-space: pre-wrap; color: #374151; line-height: 1.6;">${notes}</p>
        ` : ""}
        
        <div style="margin-top: 28px; padding: 16px; background: #fef3c7; border-radius: 8px; border: 1px solid #fcd34d;">
          <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.5;">
            <strong>⚠️ Disclaimer:</strong> All prices are estimates based on the information provided. Final pricing may vary depending on the complexity of requirements, timeline, and scope confirmed during consultation. Consulting fees are indicative and will be quoted after initial assessment.
          </p>
        </div>
      </div>
      
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
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
