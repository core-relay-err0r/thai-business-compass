import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { InternalPageHeader } from "@/components/layout/InternalPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building2, 
  MapPin,
  Send,
  ArrowRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { invokeEdgeFunction } from "@/lib/edge-functions";
import { SEOHead } from "@/components/seo/SEOHead";
import { LocalBusinessSchema } from "@/components/seo/StructuredData";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",

    companyName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await invokeEdgeFunction('send-contact', {
        body: formData
      });

      if (error) throw error;

      toast.success("Message sent. Our team will review your enquiry.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
    
        companyName: "",
        message: "",
      });
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Layout>
      <SEOHead
        title="Contact PND50 | Thai Accounting & Tax Services | Bangkok"
        description="Contact PND50 for Thai accounting, corporate tax, and business advisory services. Speak with our English-speaking team in EmQuartier, Bangkok."
        path="/contact"
        keywords="contact PND50, Bangkok accountant contact, Thai accounting firm contact, EmQuartier accountant, accountant Bangkok"
      />
      <LocalBusinessSchema />
      <InternalPageHeader
        eyebrow="Bring us the difficult question"
        meta="Bangkok · English-speaking team"
        title={<>Vague advice is expensive. <span className="text-primary">Ask directly.</span></>}
        description="Tell us what is changing, overdue, unclear, or at risk. Our English-speaking team will identify the most useful next step — even if it is not a service we sell."
      />
      <div className="py-10 sm:py-14 md:py-16">
        <div className="container px-4 sm:px-6">
          {/* Hero Section - Two Column */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 lg:gap-16 mb-12 sm:mb-16">
            {/* Left - Title */}
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Direct contact</p>
              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight">Skip the polished brief. Tell us where it hurts.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Choose the channel that works for you. A deadline, broken process, unclear structure, or difficult decision is enough to start.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="mt-1 h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <a href="tel:+6620172950" className="flex min-h-[44px] items-center transition-colors hover:text-primary sm:min-h-0">
                      +66(0)2 017 2950
                    </a>
                    <a href="tel:+6620172949" className="flex min-h-[44px] items-center transition-colors hover:text-primary sm:min-h-0">
                      +66(0)2 017 2949
                    </a>
                  </div>
                </div>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a href="mailto:info@pnd50.com" className="flex items-center gap-2 hover:text-primary transition-colors min-h-[44px] sm:min-h-0">
                  <Mail className="h-4 w-4" />
                  info@pnd50.com
                </a>
              </div>
            </div>

            {/* Right - Quick Response Card */}
            <div className="w-full lg:w-96 p-4 sm:p-6 rounded-2xl bg-muted/30">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="h-10 w-10 sm:h-11 sm:w-11 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Direct support</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Choose the channel that suits you</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-1 p-3 sm:p-4 rounded-xl bg-background border border-border/50 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">Email</div>
                  <div className="text-xs text-muted-foreground">Business enquiries</div>
                </div>
                <div className="flex-1 p-3 sm:p-4 rounded-xl bg-background border border-border/50 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">Phone</div>
                  <div className="text-xs text-muted-foreground">Call our office</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form & Info Cards Section */}
          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Left - Form (3 columns) */}
            <Card className="lg:col-span-3">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm sm:text-base">Tell us what you need</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Four short fields. No service selection required.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="fullName" className="text-sm">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="min-h-[44px]"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="email" className="text-sm">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-sm">Phone <span className="font-normal text-muted-foreground">(optional)</span></Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+66 XX XXX XXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="companyName" className="text-sm">Company Name <span className="font-normal text-muted-foreground">(optional)</span></Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Your Company Ltd."
                      value={formData.companyName}
                      onChange={handleChange}
                      className="min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="message" className="text-sm">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your needs..."
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full min-h-[44px]" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Right - Info Cards (2 columns) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Office Card */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">Office</h3>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Suite 3065, 30th Floor</p>
                    <p>Bhiraj Tower at EmQuartier</p>
                    <p>689 Sukhumvit Rd, Khlong Tan Nuea</p>
                    <p>Watthana, Bangkok 10110</p>
                  </div>
                </CardContent>
              </Card>

              {/* Direct Contact Card */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">Direct Contact</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <a
                      href="tel:+6620172950"
                      className="group flex min-h-[44px] items-center justify-between text-sm transition-colors hover:text-primary sm:min-h-0"
                    >
                      <span>+66(0)2 017 2950</span>
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                    <a
                      href="tel:+6620172949"
                      className="group flex min-h-[44px] items-center justify-between text-sm transition-colors hover:text-primary sm:min-h-0"
                    >
                      <span>+66(0)2 017 2949</span>
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                    <a 
                      href="mailto:info@pnd50.com" 
                      className="flex items-center justify-between text-sm hover:text-primary transition-colors group min-h-[44px] sm:min-h-0"
                    >
                      <span>info@pnd50.com</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Find Us Section */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Find Us</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">EmQuartier, Bangkok</p>
                  </div>
                </div>
                <a 
                  href="https://maps.google.com/?q=Bhiraj+Tower+at+EmQuartier+Bangkok" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline min-h-[44px] sm:min-h-0"
                >
                  Get Directions
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              
              <div className="rounded-xl overflow-hidden border border-border/50">
                <iframe
                  src="https://www.google.com/maps?q=Bhiraj+Tower+at+EmQuartier,+Bangkok&output=embed"
                  width="100%"
                  className="h-48 sm:h-64 md:h-[300px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PND50 Office - Suite 3065, Bhiraj Tower at EmQuartier"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
