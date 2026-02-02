import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useServices } from "@/contexts/ServiceContext";
import { formatPrice } from "@/lib/pricing";
import { Check, Copy, Send, Calculator, Building2, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Submit() {
  const {
    contactInfo,
    setContactInfo,
    companyInfo,
    setCompanyInfo,
    notes,
    setNotes,
    accountingResult,
    selectedCorporateServices,
    selectedConsultingServices,
    generateSummary,
    clearAll,
  } = useServices();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasAccountingData = !!accountingResult;
  const hasCorporateData = selectedCorporateServices.length > 0;
  const hasConsultingData = selectedConsultingServices.length > 0;
  const hasAnySelection = hasAccountingData || hasCorporateData || hasConsultingData;

  const handleCopySummary = () => {
    const summary = generateSummary();
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Summary copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-submission", {
        body: {
          contactInfo,
          companyInfo,
          notes,
          accountingResult,
          selectedCorporateServices,
          selectedConsultingServices,
        },
      });

      if (error) {
        throw error;
      }

      console.log("Submission sent successfully:", data);
      setIsSubmitted(true);
      toast.success("Request submitted successfully!");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-16 sm:py-20 md:py-32">
          <div className="container px-4 sm:px-6">
            <div className="max-w-xl mx-auto text-center">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4 sm:mb-6">
                <Check className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Request Submitted</h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                Thank you for your submission. We'll review your request and reply with next steps within 1 business day.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  variant="outline"
                  className="min-h-[44px]"
                  onClick={() => {
                    clearAll();
                    setIsSubmitted(false);
                    window.location.href = "/services";
                  }}
                >
                  Start new request
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 sm:py-12 md:py-20">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Submit Request</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Review your selections and provide your contact details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            {/* Contact Info */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
                <CardDescription className="text-sm">How should we reach you?</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="text-sm">Full Name *</Label>
                    <Input
                      id="name"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ name: e.target.value })}
                      required
                      className="min-h-[44px]"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-sm">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ email: e.target.value })}
                      required
                      className="min-h-[44px]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="phone" className="text-sm">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ phone: e.target.value })}
                    required
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm">Preferred Contact Method</Label>
                  <RadioGroup
                    value={contactInfo.preferredContact}
                    onValueChange={(value) =>
                      setContactInfo({ preferredContact: value as "email" | "phone" | "whatsapp" })
                    }
                    className="flex flex-wrap gap-3 sm:gap-4"
                  >
                    {[
                      { value: "email", label: "Email" },
                      { value: "phone", label: "Phone" },
                      { value: "whatsapp", label: "WhatsApp" },
                    ].map((option) => (
                      <Label
                        key={option.value}
                        htmlFor={`contact-${option.value}`}
                        className="flex items-center space-x-2 cursor-pointer min-h-[44px]"
                      >
                        <RadioGroupItem value={option.value} id={`contact-${option.value}`} />
                        <span className="text-sm">{option.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Company Information</CardTitle>
                <CardDescription className="text-sm">Tell us about your company</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="company-name" className="text-sm">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={companyInfo.companyName}
                    onChange={(e) => setCompanyInfo({ companyName: e.target.value })}
                    required
                    className="min-h-[44px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="registration" className="text-sm">Registration Number (optional)</Label>
                    <Input
                      id="registration"
                      value={companyInfo.registrationNumber}
                      onChange={(e) => setCompanyInfo({ registrationNumber: e.target.value })}
                      className="min-h-[44px]"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="industry" className="text-sm">Industry (optional)</Label>
                    <Input
                      id="industry"
                      value={companyInfo.industry}
                      onChange={(e) => setCompanyInfo({ industry: e.target.value })}
                      className="min-h-[44px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Services Summary */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Selected Services</CardTitle>
                <CardDescription className="text-sm">
                  {hasAnySelection
                    ? "Based on your selections from the calculators"
                    : "No services selected yet. Visit the calculators to add services."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {hasAnySelection ? (
                  <div className="divide-y divide-border">
                    {hasAccountingData && (
                      <div className="pb-5 sm:pb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Calculator className="h-4 w-4 text-primary" />
                          <span className="font-medium">Accounting Services</span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mb-2">
                          <div>
                            <span className="text-primary">Monthly:</span>{" "}
                            <span className="font-medium">${formatPrice(accountingResult!.totalMonthly)}</span>
                          </div>
                          <div>
                            <span className="text-primary">Annual:</span>{" "}
                            <span className="font-medium">${formatPrice(accountingResult!.totalAnnual)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Required: {accountingResult!.requiredItems.join(", ")}
                        </div>
                      </div>
                    )}

                    {hasCorporateData && (
                      <div className={`${hasAccountingData ? "pt-5 sm:pt-6" : ""} ${hasConsultingData ? "pb-5 sm:pb-6" : ""}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="font-medium">Corporate Services</span>
                        </div>
                        <div className="space-y-2">
                          {selectedCorporateServices.map((service) => (
                            <div key={service.id} className="flex justify-between text-sm">
                              <span className="text-primary">{service.name}</span>
                              <span className="font-medium">${formatPrice(service.price)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm pt-3 border-t border-border/50">
                            <span>Total</span>
                            <span className="font-medium">
                              ${formatPrice(selectedCorporateServices.reduce((sum, s) => sum + s.price, 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {hasConsultingData && (
                      <div className={`${hasAccountingData || hasCorporateData ? "pt-5 sm:pt-6" : ""}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="font-medium">Consulting Services</span>
                        </div>
                        <div className="space-y-2">
                          {selectedConsultingServices.map((service) => (
                            <div key={service.id} className="flex justify-between text-sm">
                              <span className="text-primary">{service.name}</span>
                              <span className="font-medium">
                                ${formatPrice(service.priceRange.min)}–{formatPrice(service.priceRange.max)}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm pt-3 border-t border-border/50">
                            <span>Total</span>
                            <span className="font-medium">
                              ${formatPrice(selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.min, 0))}–{formatPrice(selectedConsultingServices.reduce((sum, s) => sum + s.priceRange.max, 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <p className="mb-3 sm:mb-4 text-sm">You haven't selected any services yet.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm" asChild className="min-h-[44px]">
                        <a href="/services">Browse services</a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Additional Notes</CardTitle>
                <CardDescription className="text-sm">Any other details you'd like to share (optional)</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Questions, special requirements, timeline expectations..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Generate Summary */}
            {hasAnySelection && (
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Copy Summary</CardTitle>
                  <CardDescription className="text-sm">
                    Generate a text summary you can paste into email or WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <Button type="button" variant="outline" onClick={handleCopySummary} className="min-h-[44px]">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy to clipboard
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            <div className="flex justify-center sm:justify-end">
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto min-h-[44px]"
                disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone || !companyInfo.companyName || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
