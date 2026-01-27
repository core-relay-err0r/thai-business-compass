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
import { Check, Copy, Send, Calculator, Building2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    console.log("Submission:", {
      contactInfo,
      companyInfo,
      notes,
      accountingResult,
      selectedCorporateServices,
      selectedConsultingServices,
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="max-w-xl mx-auto text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Request Submitted</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for your submission. We'll review your request and reply with next steps within 1 business day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    clearAll();
                    setIsSubmitted(false);
                    window.location.href = "/";
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
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit Request</h1>
            <p className="text-lg text-muted-foreground">
              Review your selections and provide your contact details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How should we reach you?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Contact Method</Label>
                  <RadioGroup
                    value={contactInfo.preferredContact}
                    onValueChange={(value) =>
                      setContactInfo({ preferredContact: value as "email" | "phone" | "whatsapp" })
                    }
                    className="flex gap-4"
                  >
                    {[
                      { value: "email", label: "Email" },
                      { value: "phone", label: "Phone" },
                      { value: "whatsapp", label: "WhatsApp" },
                    ].map((option) => (
                      <Label
                        key={option.value}
                        htmlFor={`contact-${option.value}`}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <RadioGroupItem value={option.value} id={`contact-${option.value}`} />
                        <span>{option.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Tell us about your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={companyInfo.companyName}
                    onChange={(e) => setCompanyInfo({ companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registration">Registration Number (optional)</Label>
                    <Input
                      id="registration"
                      value={companyInfo.registrationNumber}
                      onChange={(e) => setCompanyInfo({ registrationNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry (optional)</Label>
                    <Input
                      id="industry"
                      value={companyInfo.industry}
                      onChange={(e) => setCompanyInfo({ industry: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Services Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Services</CardTitle>
                <CardDescription>
                  {hasAnySelection
                    ? "Based on your selections from the calculators"
                    : "No services selected yet. Visit the calculators to add services."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {hasAccountingData && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator className="h-5 w-5 text-primary" />
                      <span className="font-medium">Accounting Services</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Monthly:</span>{" "}
                        <span className="font-medium">฿{formatPrice(accountingResult!.totalMonthly)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Annual:</span>{" "}
                        <span className="font-medium">฿{formatPrice(accountingResult!.totalAnnual)}</span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Required: {accountingResult!.requiredItems.join(", ")}
                    </div>
                  </div>
                )}

                {hasCorporateData && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">Corporate Services</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedCorporateServices.map((service) => (
                        <li key={service.id} className="text-sm flex justify-between">
                          <span>{service.name}</span>
                          <span className="font-medium">฿{formatPrice(service.price)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm font-medium">
                      <span>Total</span>
                      <span>
                        ฿{formatPrice(selectedCorporateServices.reduce((sum, s) => sum + s.price, 0))}
                      </span>
                    </div>
                  </div>
                )}

                {hasConsultingData && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span className="font-medium">Consulting Services</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedConsultingServices.map((service) => (
                        <li key={service.id} className="text-sm flex justify-between">
                          <span>{service.name}</span>
                          <span className="font-medium">
                            ฿{formatPrice(service.priceRange.min)}–{formatPrice(service.priceRange.max)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!hasAnySelection && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-4">You haven't selected any services yet.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/accounting">Calculate accounting</a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/corporate">Browse corporate</a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/consulting">Browse consulting</a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>Any other details you'd like to share (optional)</CardDescription>
              </CardHeader>
              <CardContent>
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
                <CardHeader>
                  <CardTitle>Copy Summary</CardTitle>
                  <CardDescription>
                    Generate a text summary you can paste into email or WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button type="button" variant="outline" onClick={handleCopySummary}>
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
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={!contactInfo.name || !contactInfo.email || !companyInfo.companyName}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
