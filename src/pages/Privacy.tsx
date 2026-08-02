import { Layout } from "@/components/layout/Layout";
import { InternalPageHeader } from "@/components/layout/InternalPageHeader";
import { SEOHead } from "@/components/seo/SEOHead";

export default function Privacy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We collect information you provide directly when you request services, communicate with us,
            submit a form, or subscribe to practical updates. Depending on the interaction, this may include:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Name, email address, and phone number</li>
            <li>Company name and business information</li>
            <li>Financial and accounting documents</li>
            <li>Subscription interest, page language, source page, signup location, consent time, UTM parameters, and referrer</li>
            <li>Any other information you choose to provide</li>
          </ul>
        </>
      ),
    },
    {
      title: "2. How We Use Your Information",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We use the information to respond to requests, provide agreed services, maintain our systems,
          understand which topics are useful, and send practical accounting, tax, payroll, and corporate
          updates when you have subscribed. Subscription data is not used to make automated legal or tax decisions.
        </p>
      ),
    },
    {
      title: "3. Email Updates, Consent, and Unsubscribe",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          When you submit a subscription form, we record the time and context of your request. You can
          unsubscribe at any time using the link included in subscription emails. Unsubscribing changes
          the subscription status so further practical updates are not sent to that subscription.
        </p>
      ),
    },
    {
      title: "4. Service Providers and Information Sharing",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We do not sell subscription data. We may use service providers that operate the website,
          store form data, deliver email, prevent abuse, or measure site usage. These currently include
          Vercel, Supabase, Resend, and Microsoft Clarity. Information may also be disclosed when required
          to comply with applicable obligations or protect the security of our services.
        </p>
      ),
    },
    {
      title: "5. Analytics and Browser Storage",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We use Microsoft Clarity and internal website events to understand whether subscription forms
          are viewed, submitted, completed, or return an error. Subscription analytics events do not include
          the email address. Browser storage records a successful subscription and, when a popup is dismissed,
          hides it for 14 days.
        </p>
      ),
    },
    {
      title: "6. Data Security",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We use access controls and server-side processing intended to limit unauthorized access,
          alteration, disclosure, or destruction. No internet transmission or storage method is completely secure.
        </p>
      ),
    },
    {
      title: "7. Data Retention",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We retain information for as long as reasonably needed for the purpose for which it was collected,
          to maintain suppression records after unsubscribe, to resolve disputes, and to meet applicable obligations.
          Retention periods may differ by record type and engagement.
        </p>
      ),
    },
    {
      title: "8. Your Choices and Requests",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          You may ask to access, correct, or delete personal information associated with you, or object to
          particular processing. Some records may need to be retained where there is a valid operational or legal reason.
          Contact us using the address below to make a request.
        </p>
      ),
    },
    {
      title: "9. Nature of Practical Updates",
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Subscription emails provide general practical information. They do not replace accounting, tax,
          legal, payroll, or other professional advice based on your company&apos;s specific facts.
        </p>
      ),
    },
    {
      title: "10. Contact Us",
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
      <SEOHead
        title="Privacy Policy | PND50"
        description="PND50 Privacy Policy. Learn how we collect, use, and protect your personal information when using our Thai accounting and corporate services."
        path="/privacy"
      />
      <InternalPageHeader
        eyebrow="Legal"
        meta="Last updated · August 2026"
        title={<>Privacy <span className="text-primary">policy.</span></>}
        description="How PND50 collects, uses, safeguards, and retains information provided through our services."
      />

      {/* Content Section */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Introduction */}
            <div className="bg-muted/30 rounded-lg p-4 sm:p-6 mb-8 sm:mb-10 border">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                At PND50, we are committed to protecting your privacy and ensuring the security of your 
                personal information. This Privacy Policy explains how we collect, use, disclose, and 
                safeguard your information when you use our services.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-6 sm:space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="pb-6 sm:pb-8 border-b last:border-b-0 last:pb-0">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{section.title}</h2>
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
