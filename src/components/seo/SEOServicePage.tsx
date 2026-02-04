import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { LucideIcon } from "lucide-react";

interface ServiceFeature {
  title: string;
  description: string;
}

interface RelatedService {
  title: string;
  href: string;
  description: string;
}

interface SEOServicePageProps {
  badge: string;
  title: string;
  titleAccent?: string;
  description: string;
  metaDescription?: string;
  primaryKeyword: string;
  icon: LucideIcon;
  features: ServiceFeature[];
  benefits: string[];
  relatedServices: RelatedService[];
  ctaText?: string;
  ctaHref?: string;
}

export function SEOServicePage({
  badge,
  title,
  titleAccent,
  description,
  primaryKeyword,
  icon: Icon,
  features,
  benefits,
  relatedServices,
  ctaText = "Get Started",
  ctaHref = "/contact",
}: SEOServicePageProps) {
  return (
    <Layout>
      {/* SEO H1 - visually hidden */}
      <h1 className="sr-only">{primaryKeyword}</h1>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-border">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              {badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {title}{" "}
              {titleAccent && <span className="text-primary">{titleAccent}</span>}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ctaHref}>
                <Button size="lg" className="min-h-[44px] w-full sm:w-auto">
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="min-h-[44px] w-full sm:w-auto">
                  Talk to an Expert
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">What's Included</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive services designed for foreign-owned businesses in Thailand.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose PND50</h2>
              <p className="text-muted-foreground">
                Trusted by 150+ foreign-owned companies across Thailand.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Related Services</h2>
            <p className="text-muted-foreground">
              Explore other services that complement your needs.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {relatedServices.map((service) => (
              <Link key={service.href} to={service.href} className="group">
                <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <span className="text-sm text-primary flex items-center gap-1">
                      Learn more
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              See what applies to your business or speak with our team directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button size="lg" className="min-h-[44px] w-full sm:w-auto">
                  See what applies to you
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="min-h-[44px] w-full sm:w-auto">
                  Get in touch
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
