import { useState } from "react";
import { Check, Loader2, Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";

import { Layout } from "@/components/layout/Layout";
import { LocalBusinessSchema } from "@/components/seo/StructuredData";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { invokeEdgeFunction } from "@/lib/edge-functions";

const trustPoints = [
  "English-speaking team",
  "Reply within one business day",
  "No service selection required",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await invokeEdgeFunction("send-contact", {
        body: formData,
      });

      if (error) throw error;

      toast.success("Request sent. We will reply within one business day.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        message: "",
      });
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      toast.error("Failed to send your request. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Layout>
      <SEOHead
        title="Contact PND50 | Thai Accounting & Tax Services | Bangkok"
        description="Contact PND50 for Thai accounting, corporate tax, and business advisory services. Speak with our English-speaking team in Bangkok."
        path="/contact"
        keywords="contact PND50, Bangkok accountant contact, Thai accounting firm contact, accountant Bangkok"
      />
      <LocalBusinessSchema />

      <section className="border-b border-border">
        <div className="container px-4 py-6 sm:px-6 sm:py-10 lg:py-14">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(32rem,1.2fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Contact PND50
              </p>
              <h1 className="mt-4 max-w-xl font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Tell us what you need.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Describe your situation. We&apos;ll review it and reply within one business day.
              </p>

              <ul className="mt-8 hidden flex-col gap-3 lg:flex" aria-label="What to expect">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm sm:text-base">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-border bg-card p-4 sm:p-7 lg:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      autoComplete="name"
                      placeholder="Your name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="min-h-12"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="min-h-12"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">
                    Phone <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+66 XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="min-h-12"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">How can we help?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Briefly describe your situation, deadline, or question."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-24 resize-y sm:min-h-32"
                  />
                </div>

                <Button type="submit" size="lg" className="min-h-12 w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send request
                      <Send className="ml-2 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                  Your details are used only to respond to this request.
                </p>
                <ul className="flex flex-col gap-2 border-t border-border pt-4 lg:hidden" aria-label="What to expect">
                  {trustPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border" aria-label="Direct contact details">
        <div className="container flex flex-col gap-4 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a href="mailto:info@pnd50.com" className="inline-flex min-h-11 items-center gap-2 hover:text-primary">
              <Mail className="h-4 w-4" aria-hidden="true" />
              info@pnd50.com
            </a>
            <a href="tel:+6620172950" className="inline-flex min-h-11 items-center gap-2 hover:text-primary">
              <Phone className="h-4 w-4" aria-hidden="true" />
              +66 (0)2 017 2950
            </a>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            Bhiraj Tower at EmQuartier · Bangkok
          </p>
        </div>
      </section>
    </Layout>
  );
}
