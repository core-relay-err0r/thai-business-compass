import { Layout } from "@/components/layout/Layout";
import { FileText } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          By accessing or using PND50's services, you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use our services.
        </p>
      ),
    },
    {
      title: "2. Services",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          PND50 provides accounting, corporate, and consulting services to businesses operating 
          in Thailand. Our services include but are not limited to bookkeeping, tax filing, 
          company registration, and business advisory services.
        </p>
      ),
    },
    {
      title: "3. Client Responsibilities",
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">
            As a client, you agree to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Provide accurate and complete information</li>
            <li>Supply necessary documents in a timely manner</li>
            <li>Respond to our requests for information promptly</li>
            <li>Pay for services according to agreed terms</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Fees and Payment",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Service fees will be communicated before the commencement of work. Payment terms 
          are specified in individual service agreements. We reserve the right to suspend 
          services for overdue payments.
        </p>
      ),
    },
    {
      title: "5. Confidentiality",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We maintain strict confidentiality of all client information and documents. 
          We will not disclose your information to third parties except as required by law 
          or with your explicit consent.
        </p>
      ),
    },
    {
      title: "6. Limitation of Liability",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          PND50's liability is limited to the fees paid for the specific service in question. 
          We are not liable for any indirect, incidental, or consequential damages arising 
          from the use of our services.
        </p>
      ),
    },
    {
      title: "7. Termination",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Either party may terminate the service agreement with written notice. 
          Upon termination, you remain responsible for any outstanding fees and we will 
          return your documents as requested.
        </p>
      ),
    },
    {
      title: "8. Governing Law",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          These terms are governed by the laws of the Kingdom of Thailand. Any disputes 
          shall be resolved in the courts of Bangkok, Thailand.
        </p>
      ),
    },
    {
      title: "9. Contact",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          For questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:info@pnd50.com" className="text-primary hover:underline font-medium">
            info@pnd50.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-muted/30 border-b">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              LEGAL
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Introduction */}
            <div className="bg-muted/30 rounded-lg p-6 mb-10 border">
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service govern your use of PND50's accounting, corporate, and consulting 
                services. By engaging our services, you agree to comply with and be bound by these terms.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="pb-8 border-b last:border-b-0 last:pb-0">
                  <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                  {section.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
