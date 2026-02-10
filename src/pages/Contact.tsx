import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
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
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/seo/SEOHead";
import { LocalBusinessSchema } from "@/components/seo/StructuredData";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    companyName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact', {
        body: formData
      });

      if (error) throw error;

      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        whatsapp: "",
        companyName: "",
        message: "",
      });
    } catch (error: any) {
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
        description="Contact PND50 for Thai accounting, corporate tax, and business advisory services. Office in EmQuartier, Bangkok. English-speaking team responds within 24 hours."
        path="/contact"
        keywords="contact PND50, Bangkok accountant contact, Thai accounting firm contact, EmQuartier accountant, accountant Bangkok"
      />
      <LocalBusinessSchema />
      <div className="py-8 sm:py-12 md:py-20">
        <div className="container px-4 sm:px-6">
          {/* Hero Section - Two Column */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 lg:gap-16 mb-12 sm:mb-16">
            {/* Left - Title */}
            <div className="max-w-lg">
              <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-3 sm:mb-4">
                Contact
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
                Let's talk about<br />
                <span className="text-primary">your business</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Have questions about Thai accounting or compliance? We're here to help you navigate with confidence.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 text-sm">
                <a href="tel:+6620172949" className="flex items-center gap-2 hover:text-primary transition-colors min-h-[44px] sm:min-h-0">
                  <Phone className="h-4 w-4" />
                  +66 2 017 2949
                </a>
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
                  <h3 className="font-semibold text-sm sm:text-base">Quick Response</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-1 p-3 sm:p-4 rounded-xl bg-background border border-border/50 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">24h</div>
                  <div className="text-xs text-muted-foreground">Email Response</div>
                </div>
                <div className="flex-1 p-3 sm:p-4 rounded-xl bg-background border border-border/50 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">1h</div>
                  <div className="text-xs text-muted-foreground">WhatsApp Reply</div>
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
                    <h2 className="font-semibold text-sm sm:text-base">Send a Message</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Fill out the form and we'll be in touch</p>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="phone" className="text-sm">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+66 XX XXX XXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="min-h-[44px]"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="whatsapp" className="text-sm">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        placeholder="+66 XX XXX XXXX"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="companyName" className="text-sm">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Your Company Ltd."
                      value={formData.companyName}
                      onChange={handleChange}
                      required
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
                        Send Message
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
                      href="tel:+6620172949" 
                      className="flex items-center justify-between text-sm hover:text-primary transition-colors group min-h-[44px] sm:min-h-0"
                    >
                      <span>+66 2 017 2949</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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

              {/* Message Us Card */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">Message Us</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <a 
                      href="https://wa.me/66843563805" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-green-500/30 bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-xs sm:text-sm min-h-[44px]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <a 
                      href="https://t.me/+66843563805"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-blue-500/30 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs sm:text-sm min-h-[44px]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
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
