import { Layout } from "@/components/layout/Layout";
import { Shield } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            request our services, communicate with us, or submit a contact form. This may include:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Name, email address, and phone number</li>
            <li>Company name and business information</li>
            <li>Financial and accounting documents</li>
            <li>Any other information you choose to provide</li>
          </ul>
        </>
      ),
    },
    {
      title: "2. How We Use Your Information",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We use the information we collect to provide, maintain, and improve our services, 
          including processing your requests, communicating with you about our services, 
          and ensuring compliance with legal and regulatory requirements.
        </p>
      ),
    },
    {
      title: "3. Information Sharing",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We do not sell, trade, or otherwise transfer your personal information to third parties 
          without your consent, except as required to provide our services or comply with legal 
          obligations. We may share information with trusted service providers who assist us in 
          operating our business.
        </p>
      ),
    },
    {
      title: "4. Data Security",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We implement appropriate security measures to protect your personal information against 
          unauthorized access, alteration, disclosure, or destruction. However, no method of 
          transmission over the internet is 100% secure.
        </p>
      ),
    },
    {
      title: "5. Data Retention",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We retain your personal information for as long as necessary to fulfill the purposes 
          for which it was collected, comply with legal obligations, and resolve disputes.
        </p>
      ),
    },
    {
      title: "6. Your Rights",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          You have the right to access, correct, or delete your personal information. 
          You may also object to or restrict certain processing of your data. 
          To exercise these rights, please contact us using the information below.
        </p>
      ),
    },
    {
      title: "7. Contact Us",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at{" "}
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              LEGAL
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
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
                At PND50, we are committed to protecting your privacy and ensuring the security of your 
                personal information. This Privacy Policy explains how we collect, use, disclose, and 
                safeguard your information when you use our services.
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
