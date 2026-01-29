import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Users, 
  ThumbsUp, 
  MessageCircle, 
  ShieldCheck, 
  Heart,
  ArrowRight
} from "lucide-react";

export default function About() {
  const stats = [
    {
      icon: Award,
      value: "10+",
      label: "Years of Excellence",
      description: "Trusted expertise in Thai accounting",
    },
    {
      icon: Users,
      value: "150+",
      label: "Happy Clients",
      description: "International businesses served",
    },
    {
      icon: ThumbsUp,
      value: "100%",
      label: "Client Satisfaction",
      description: "Rated by our customers",
    },
  ];

  const values = [
    {
      icon: MessageCircle,
      title: "Crystal Clear",
      description: "Plain-English communication about your numbers and obligations",
    },
    {
      icon: ShieldCheck,
      title: "Always Compliant",
      description: "Stay ahead of deadlines with proactive compliance management",
    },
    {
      icon: Heart,
      title: "Peace of Mind",
      description: "Human expertise backed by reliable technology and real-time support",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <Badge variant="secondary" className="mb-4">
              About PND50
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Regional corporate specialist with{" "}
              <span className="text-primary">Global standards</span>
            </h1>
            <p className="text-muted-foreground mt-6 text-lg max-w-lg">
              PND50 is an accounting and advisory firm based in Thailand, helping 
              foreign-owned businesses navigate Thai accounting and compliance with 
              clarity and confidence.
            </p>
            <Link to="/contact" className="inline-block mt-8">
              <Button size="lg">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right: Team Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary/20" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-muted" />
              
              {/* Team avatar placeholders */}
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex flex-col gap-4">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                    <Users className="w-10 h-10 text-primary/60" />
                  </div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-4 border-background shadow-lg ml-8">
                    <Users className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-background shadow-lg">
                    <Users className="w-8 h-8 text-primary/50" />
                  </div>
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center border-4 border-background shadow-lg">
                    <Users className="w-12 h-12 text-primary/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container pb-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/30 border-y border-border/40">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <Badge variant="secondary" className="mb-4">
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Making Thai Accounting{" "}
                <span className="text-primary">Clear & Stress-Free</span>
              </h2>
              <p className="text-muted-foreground mt-6 max-w-lg">
                We believe accounting should empower, not confuse. Our approach combines 
                expert knowledge with modern technology to make Thai compliance transparent 
                and manageable.
              </p>

              <div className="mt-8 space-y-6">
                {values.map((value) => (
                  <div key={value.title} className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10 shrink-0 mt-0.5">
                      <value.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image placeholder */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 aspect-[4/3] flex items-center justify-center border border-border/50">
                <div className="text-center p-8">
                  <Users className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">Our team at work</p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-xl bg-primary/10 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to simplify your Thai compliance?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Discover what your business needs with our interactive tools, or get in touch directly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/corporate">
            <Button size="lg">
              Explore Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
