// Vercel Serverless Function: /api/resend/inbound
// Signature verification requires the unmodified request body.

import { Resend } from "resend";
import { sendLeadEvent } from "../../server/lead-router.js";
import {
  createInboundEmailHandler,
  type ResendInboundClient,
} from "../../server/pnd50-inbound-email.js";

export const config = {
  runtime: "nodejs",
  api: {
    bodyParser: false,
  },
};

function createResendClient(apiKey: string | undefined): ResendInboundClient {
  // Webhook verification is local and does not need an API key. Network methods
  // are called only after the handler confirms the real forwarding configuration.
  const resend = new Resend(apiKey || "re_signature_verification_only");
  return {
    verify: (options) => resend.webhooks.verify(options),
    retrieve: (emailId) => resend.emails.receiving.get(emailId, { html_format: "cid" }),
    forward: ({ emailId, to, from, idempotencyKey }) =>
      resend.emails.receiving.forward(
        { emailId, to, from, passthrough: true },
        { idempotencyKey },
      ),
  };
}

export default createInboundEmailHandler({
  env: process.env,
  createResendClient,
  sendRouter: (event, env) => sendLeadEvent(event, { env }),
});
