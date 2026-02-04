

# Send Confirmation Email to Both Client and Company

## Overview

Modify the submission email flow to send two separate emails:
1. **Company notification** (existing) - Full details sent to info@pnd50.com
2. **Client confirmation** (new) - A confirmation email sent to the user's email address

## Changes Required

### File: `supabase/functions/send-submission/index.ts`

**1. Create a client confirmation email template**

A new function `generateClientConfirmationHtml` that creates a professional confirmation email for the client with:
- Confirmation header thanking them for their inquiry
- Summary of their selected services and estimated costs
- Payment summary breakdown
- Clear next steps (expect contact within 1-2 business days)
- Company contact information

**2. Send two emails using Promise.all**

Modify the handler to send both emails in parallel:

```typescript
// Send to company (internal notification)
const companyEmail = resend.emails.send({
  from: "PND50 <noreply@pnd50.com>",
  to: ["info@pnd50.com"],
  reply_to: data.contactInfo.email,
  subject: `New Service Request from ${data.contactInfo.name} (${data.companyInfo.companyName})`,
  html: generateEmailHtml(data),  // existing detailed internal email
});

// Send to client (confirmation)
const clientEmail = resend.emails.send({
  from: "PND50 <noreply@pnd50.com>",
  to: [data.contactInfo.email],
  subject: `Your Service Request - PND50`,
  html: generateClientConfirmationHtml(data),  // new client-facing email
});

// Send both in parallel
const [companyResponse, clientResponse] = await Promise.all([companyEmail, clientEmail]);
```

**3. Client email content structure**

```
Header: "Thank you for your inquiry, [Name]!"

YOUR REQUEST SUMMARY
- Company: [Company Name]
- Services requested: [list]
- Estimated First-Year Total: $X,XXX - $X,XXX

WHAT HAPPENS NEXT
1. Our team will review your requirements
2. We'll contact you within 1-2 business days
3. We'll schedule a consultation to finalize scope and pricing

Questions? Contact us at info@pnd50.com or +66 84 356 3805

Footer: PND50 Co., Ltd. | Bangkok, Thailand
```

## Summary

The edge function will be updated to:
- Keep the existing detailed email for the company
- Add a new client-facing confirmation email
- Send both emails in parallel for efficiency
- Include proper error handling for both sends

