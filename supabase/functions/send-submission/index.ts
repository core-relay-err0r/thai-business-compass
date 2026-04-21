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
    price: number;
    isFrom?: boolean;
    timeline?: string;
    note?: string;
  }>;
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

function formatPrice(price: number): string {
  return price.toLocaleString();
}

function generateEmailHtml(data: SubmissionRequest): string {
  const { contactInfo, companyInfo, notes, accountingResult, selectedCorporateServices, selectedConsultingServices } = data;
  
  // Calculate totals for payment summary
  const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
  const consultingTotal = selectedConsultingServices.reduce((sum, s) => sum + s.price, 0);
  const hasFromConsulting = selectedConsultingServices.some(s => s.isFrom);
  
  const monthlyFee = accountingResult?.totalMonthly ?? 0;
  const annualFees = accountingResult?.annualAddons?.reduce((sum, a) => sum + a.amount, 0) ?? 0;
  
  const initialTotal = corporateTotal + consultingTotal;
  
  const firstYearTotal = initialTotal + (monthlyFee * 12) + annualFees;
  
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
              <td style="padding: 4px 0; text-align: right; font-weight: 500;">${s.isFrom ? "From " : ""}$${formatPrice(s.price)}</td>
            </tr>
          `).join("")}
          <tr style="border-top: 1px solid #e5e7eb;">
            <td style="padding: 8px 0 4px 0; font-weight: 600; color: #1f2937;">Total Range</td>
            <td style="padding: 8px 0 4px 0; text-align: right; font-weight: 700; color: #6d28d9;">${hasFromConsulting ? "From " : ""}$${formatPrice(consultingTotal)}</td>
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
      
      ${(corporateTotal > 0 || consultingTotal > 0) ? `
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
            ${consultingTotal > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #4b5563;">Consulting (indicative)</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 500;">${hasFromConsulting ? "From " : ""}$${formatPrice(consultingTotal)}</td>
              </tr>
            ` : ''}
            <tr style="border-top: 1px solid #a5b4fc;">
              <td style="padding: 8px 0 4px 0; font-weight: 600; color: #1f2937;">Initial Total</td>
              <td style="padding: 8px 0 4px 0; text-align: right; font-weight: 700; color: #1e40af;">
                ${hasFromConsulting ? "From " : ""}$${formatPrice(initialTotal)}
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
              ${hasFromConsulting ? "From " : ""}$${formatPrice(firstYearTotal)}
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
        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">from ${escapeHtml(contactInfo.name)} • ${escapeHtml(companyInfo.companyName)}</p>
      </div>
      
      <div style="background: white; padding: 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        
        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">👤 Contact Information</h2>
        <table style="width: 100%; margin-bottom: 28px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: 500;">${escapeHtml(contactInfo.name)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0; font-weight: 500;"><a href="mailto:${encodeURIComponent(contactInfo.email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(contactInfo.email)}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0; font-weight: 500;">${escapeHtml(contactInfo.phone || "Not provided")}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Preferred Contact</td><td style="padding: 6px 0; font-weight: 500;">${escapeHtml(contactInfo.preferredContact)}</td></tr>
        </table>

        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">🏬 Company Information</h2>
        <table style="width: 100%; margin-bottom: 28px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Company Name</td><td style="padding: 6px 0; font-weight: 500;">${escapeHtml(companyInfo.companyName)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Registration #</td><td style="padding: 6px 0; font-weight: 500;">${escapeHtml(companyInfo.registrationNumber || "Not provided")}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Industry</td><td style="padding: 6px 0; font-weight: 500;">${escapeHtml(companyInfo.industry || "Not provided")}</td></tr>
        </table>

        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📋 Selected Services</h2>
        ${servicesHtml}

        ${paymentSummaryHtml}

        ${notes ? `
          <h2 style="margin: 28px 0 16px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📝 Additional Notes</h2>
          <p style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 0; white-space: pre-wrap; color: #374151; line-height: 1.6;">${escapeHtml(notes)}</p>
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

function generateClientConfirmationHtml(data: SubmissionRequest): string {
  const { contactInfo, companyInfo, accountingResult, selectedCorporateServices, selectedConsultingServices } = data;
  
  // Calculate totals
  const corporateTotal = selectedCorporateServices.reduce((sum, s) => sum + s.price, 0);
  const consultingTotal = selectedConsultingServices.reduce((sum, s) => sum + s.price, 0);
  const hasFromConsulting = selectedConsultingServices.some(s => s.isFrom);
  const monthlyFee = accountingResult?.totalMonthly ?? 0;
  const annualFees = accountingResult?.annualAddons?.reduce((sum, a) => sum + a.amount, 0) ?? 0;
  
  const initialTotal = corporateTotal + consultingTotal;
  const firstYearTotal = initialTotal + (monthlyFee * 12) + annualFees;

  // Build services list
  const servicesList: string[] = [];
  if (accountingResult) servicesList.push("Accounting Services");
  if (selectedCorporateServices.length > 0) {
    selectedCorporateServices.forEach(s => servicesList.push(s.name));
  }
  if (selectedConsultingServices.length > 0) {
    selectedConsultingServices.forEach(s => servicesList.push(s.name));
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; color: #1f2937; background-color: #f9fafb;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 32px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Thank you for your inquiry!</h1>
        <p style="margin: 12px 0 0 0; opacity: 0.95; font-size: 16px;">We've received your service request, ${escapeHtml(contactInfo.name.split(' ')[0])}</p>
      </div>
      
      <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 28px; border: 1px solid #bae6fd;">
          <h2 style="margin: 0 0 16px 0; color: #0369a1; font-size: 16px;">📋 Your Request Summary</h2>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Company</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right;">${escapeHtml(companyInfo.companyName)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Services</td>
              <td style="padding: 6px 0; font-weight: 500; text-align: right;">${servicesList.length > 0 ? servicesList.join(', ') : 'None selected'}</td>
            </tr>
          </table>
        </div>

        ${firstYearTotal > 0 ? `
          <div style="background: linear-gradient(135deg, #dbeafe, #ede9fe); padding: 24px; border-radius: 12px; margin-bottom: 28px; border: 1px solid #c7d2fe; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Estimated First-Year Total</p>
            <p style="margin: 0; font-size: 28px; font-weight: 800; color: #1e3a8a;">
              ${hasFromConsulting ? "From " : ""}$${formatPrice(firstYearTotal)}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Final pricing confirmed after consultation</p>
          </div>
        ` : ''}

        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px;">🚀 What Happens Next</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
          <tr>
            <td style="width: 40px; vertical-align: top; padding: 0 12px 16px 0;">
              <table style="width: 28px; height: 28px; border-collapse: collapse; background: #3b82f6; border-radius: 50%;">
                <tr><td style="text-align: center; vertical-align: middle; color: white; font-weight: 600; font-size: 14px;">1</td></tr>
              </table>
            </td>
            <td style="vertical-align: top; padding-bottom: 16px;">
              <p style="margin: 0; font-weight: 600; color: #1f2937;">Review</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Our team will carefully review your requirements</p>
            </td>
          </tr>
          <tr>
            <td style="width: 40px; vertical-align: top; padding: 0 12px 16px 0;">
              <table style="width: 28px; height: 28px; border-collapse: collapse; background: #3b82f6; border-radius: 50%;">
                <tr><td style="text-align: center; vertical-align: middle; color: white; font-weight: 600; font-size: 14px;">2</td></tr>
              </table>
            </td>
            <td style="vertical-align: top; padding-bottom: 16px;">
              <p style="margin: 0; font-weight: 600; color: #1f2937;">Contact</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">We'll reach out within <strong>1-2 business days</strong></p>
            </td>
          </tr>
          <tr>
            <td style="width: 40px; vertical-align: top; padding: 0 12px 0 0;">
              <table style="width: 28px; height: 28px; border-collapse: collapse; background: #3b82f6; border-radius: 50%;">
                <tr><td style="text-align: center; vertical-align: middle; color: white; font-weight: 600; font-size: 14px;">3</td></tr>
              </table>
            </td>
            <td style="vertical-align: top;">
              <p style="margin: 0; font-weight: 600; color: #1f2937;">Consultation</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">We'll schedule a call to finalize scope and pricing</p>
            </td>
          </tr>
        </table>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 28px; text-align: center;">
          <p style="margin: 0 0 12px 0; color: #374151; font-weight: 600;">Questions? Get in touch:</p>
          <p style="margin: 0;">
            <a href="mailto:info@pnd50.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">info@pnd50.com</a>
            <span style="color: #9ca3af; margin: 0 8px;">•</span>
            <a href="tel:+66843563805" style="color: #2563eb; text-decoration: none; font-weight: 500;">+66 84 356 3805</a>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0 0 4px 0; font-weight: 500;">PND50 Co., Ltd.</p>
        <p style="margin: 0;">Suite 3065, Bhiraj Tower at EmQuartier, Bangkok, Thailand</p>
      </div>
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

    // Sanitize and truncate user inputs
    if (data.contactInfo) {
      data.contactInfo.name = truncate(String(data.contactInfo.name || '').trim(), 100);
      data.contactInfo.email = truncate(String(data.contactInfo.email || '').trim(), 255);
      if (data.contactInfo.phone) data.contactInfo.phone = truncate(String(data.contactInfo.phone).trim(), 30);
      data.contactInfo.preferredContact = truncate(String(data.contactInfo.preferredContact || '').trim(), 50);
    }
    if (data.companyInfo) {
      data.companyInfo.companyName = truncate(String(data.companyInfo.companyName || '').trim(), 200);
      if (data.companyInfo.registrationNumber) data.companyInfo.registrationNumber = truncate(String(data.companyInfo.registrationNumber).trim(), 50);
      if (data.companyInfo.industry) data.companyInfo.industry = truncate(String(data.companyInfo.industry).trim(), 100);
    }
    if (data.notes) data.notes = truncate(String(data.notes).trim(), 5000);

    // Validate required fields
    if (!data.contactInfo?.name || !data.contactInfo?.email || !data.companyInfo?.companyName) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, email, or company name" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactInfo.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate both email templates
    const companyEmailHtml = generateEmailHtml(data);
    const clientEmailHtml = generateClientConfirmationHtml(data);

    // Send both emails in parallel
    const [companyResponse, clientResponse] = await Promise.all([
      // Email to company (internal notification)
      resend.emails.send({
        from: "PND50 <noreply@pnd50.com>",
        to: ["info@pnd50.com", "sebastian@avenkara.ai"],
        reply_to: data.contactInfo.email,
        subject: `New Service Request from ${data.contactInfo.name} (${data.companyInfo.companyName})`,
        html: companyEmailHtml,
      }),
      // Email to client (confirmation)
      resend.emails.send({
        from: "PND50 <noreply@pnd50.com>",
        to: [data.contactInfo.email],
        subject: `Your Service Request Received - PND50`,
        html: clientEmailHtml,
      }),
    ]);

    console.log("Emails sent successfully:", { company: companyResponse, client: clientResponse });

    return new Response(JSON.stringify({ success: true, data: { company: companyResponse, client: clientResponse } }), {
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
