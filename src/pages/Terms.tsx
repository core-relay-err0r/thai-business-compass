import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              LEGAL
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 md:pb-32">
        <div className="container">
          <div className="max-w-3xl space-y-10">
            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using PND50's services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                PND50 provides accounting, corporate, and consulting services to businesses operating 
                in Thailand. Our services include but are not limited to bookkeeping, tax filing, 
                company registration, and business advisory services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Client Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a client, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Supply necessary documents in a timely manner</li>
                <li>Respond to our requests for information promptly</li>
                <li>Pay for services according to agreed terms</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Fees and Payment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Service fees will be communicated before the commencement of work. Payment terms 
                are specified in individual service agreements. We reserve the right to suspend 
                services for overdue payments.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed">
                We maintain strict confidentiality of all client information and documents. 
                We will not disclose your information to third parties except as required by law 
                or with your explicit consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                PND50's liability is limited to the fees paid for the specific service in question. 
                We are not liable for any indirect, incidental, or consequential damages arising 
                from the use of our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                Either party may terminate the service agreement with written notice. 
                Upon termination, you remain responsible for any outstanding fees and we will 
                return your documents as requested.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms are governed by the laws of the Kingdom of Thailand. Any disputes 
                shall be resolved in the courts of Bangkok, Thailand.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at:<br />
                <a href="mailto:info@pnd50.com" className="text-primary hover:underline">
                  info@pnd50.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
