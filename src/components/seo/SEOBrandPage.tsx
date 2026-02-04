import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { LucideIcon } from "lucide-react";

interface Stat {
  value: string;
  label: string;
}

interface Reason {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SEOBrandPageProps {
  badge: string;
  title: string;
  titleAccent?: string;
  description: string;
  primaryKeyword: string;
  stats?: Stat[];
  reasons: Reason[];
  benefits: string[];
}

export function SEOBrandPage({
  badge,
  title,
  titleAccent,
  description,
  primaryKeyword,
  stats,
  reasons,
  benefits,
}: SEOBrandPageProps) {
  return (
    <Layout>
      {/* SEO H1 - visually hidden */}
      <h1 className="sr-only">{primaryKeyword}</h1>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-border">
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

          {/* Stats */}
          {stats && stats.length > 0 && (
            <AnimatedSection className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose PND50</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What sets us apart as Thailand's trusted accounting partner for foreign businesses.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reasons.map((reason) => (
              <Card key={reason.title} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <reason.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
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
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">What You Get</h2>
              <p className="text-muted-foreground">
                Comprehensive support for your Thai business operations.
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

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Simplify Your Thai Compliance?
            </h2>
            <p className="text-muted-foreground mb-8">
              Discover what your business needs with our interactive tools, or get in touch directly.
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
