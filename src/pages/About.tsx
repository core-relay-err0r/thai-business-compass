import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Award, Users, ThumbsUp, MessageCircle, ShieldCheck, Heart, ArrowRight, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import aboutHeroBuilding from "@/assets/about-hero-building.jpg";
import companyLogo from "@/assets/company-logo.png";
import teamAtWork from "@/assets/team-at-work.jpg";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema, OrganizationSchema } from "@/components/seo/StructuredData";
export default function About() {
  const stats = [{
    icon: Award,
    value: "10+",
    label: "Years of Excellence",
    description: "Trusted expertise in Thai accounting"
  }, {
    icon: Users,
    value: "150+",
    label: "Happy Clients",
    description: "International businesses served"
  }, {
    icon: ThumbsUp,
    value: "100%",
    label: "Client Satisfaction",
    description: "Rated by our customers"
  }];
  const values = [{
    icon: MessageCircle,
    title: "Crystal Clear",
    description: "Plain-English communication about your numbers and obligations"
  }, {
    icon: ShieldCheck,
    title: "Always Compliant",
    description: "Stay ahead of deadlines with proactive compliance management"
  }, {
    icon: Heart,
    title: "Peace of Mind",
    description: "Human expertise backed by reliable technology and real-time support"
  }];
  return <Layout>
      <SEOHead title="About PND50 | Bangkok Accounting Firm for Foreign Companies" description="PND50 is a Bangkok-based accounting firm with 10+ years helping foreign-owned businesses navigate Thai accounting, corporate tax, and compliance. English-speaking accountants." path="/about" keywords="PND50 about, Bangkok accounting firm, English speaking accountant Thailand, accountant for foreigners Thailand, Thai accounting company" />
      <BreadcrumbSchema items={[{
      name: "Home",
      url: "https://pnd50.com/"
    }, {
      name: "About",
      url: "https://pnd50.com/about"
    }]} />
      <OrganizationSchema />
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center relative overflow-hidden py-16 sm:py-20 lg:py-0">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 hero-grid-pattern" />

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="lg:pr-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Badge variant="secondary" className="mb-4 sm:mb-6 text-sm px-4 py-1.5">
                  About PND50
                </Badge>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] lg:text-6xl">
                Regional corporate specialist with{" "}
                <span className="text-primary">Global standards</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-muted-foreground mt-6 sm:mt-8 text-lg sm:text-xl max-w-xl leading-relaxed lg:text-lg">
                PND50 is a Bangkok-based accounting firm helping foreign-owned businesses 
                navigate Thai accounting, corporate tax, and compliance.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Link to="/services" className="inline-block mt-8 sm:mt-10">
                  <Button size="lg" className="neumorphic-button group min-h-[56px] text-lg px-8">
                    See what applies to you
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>

              {/* Mobile Stats Preview */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="lg:hidden mt-10 grid grid-cols-3 gap-4">
                {stats.map(stat => <div key={stat.label} className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground leading-tight mt-1.5">{stat.label}</div>
                  </div>)}
              </motion.div>
            </div>

            {/* Right: Portrait */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-[560px] xl:max-w-[620px] aspect-square flex items-center justify-center">
                {/* Large soft radial glow */}
                <div className="absolute inset-[-20%] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18)_0%,hsl(var(--primary)/0.10)_30%,hsl(var(--primary)/0.04)_55%,transparent_75%)] blur-sm" />
                {/* Secondary warm glow offset */}
                <div className="absolute inset-[-10%] bg-[radial-gradient(ellipse_at_60%_40%,hsl(var(--primary)/0.12)_0%,transparent_60%)]" />
                {/* Logo */}
                <img src={companyLogo} alt="PND50 company logo" className="relative z-10 w-[80%] h-auto drop-shadow-md" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section id="stats" className="container py-12 sm:py-16 md:py-24 px-4 sm:px-6 hidden lg:block">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, i) => <AnimatedSection key={stat.label} delay={i * 100}>
                <Card className="border-border/50 text-center">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="p-2.5 sm:p-3 rounded-full bg-primary/10">
                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="font-semibold text-sm sm:text-base mb-1">{stat.label}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              </AnimatedSection>)}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="bg-muted/30 border-y border-border/40">
          <div className="container py-12 sm:py-16 md:py-24 px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Content */}
              <AnimatedSection delay={100}>
                <div>
                  <Badge variant="secondary" className="mb-3 sm:mb-4">
                    Our Mission
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    Making Thai Accounting{" "}
                    <span className="text-primary">Clear & Stress-Free</span>
                  </h2>
                  <p className="text-muted-foreground mt-4 sm:mt-6 text-sm sm:text-base max-w-lg">
                    We believe accounting should empower, not confuse. Our approach combines 
                    expert knowledge with modern technology to make Thai compliance transparent 
                    and manageable.
                  </p>
                  <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                    {values.map(value => <div key={value.title} className="flex items-start gap-3 sm:gap-4">
                        <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 shrink-0 mt-0.5">
                          <value.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">{value.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
                        </div>
                      </div>)}
                  </div>
                </div>
              </AnimatedSection>

              {/* Right: Image */}
              <AnimatedSection delay={200}>
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-border/50">
                    <img src={teamAtWork} alt="PND50 accounting team meeting in Bangkok office" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 rounded-xl bg-primary/10 -z-10" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="container py-12 sm:py-16 text-center px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Ready to simplify your Thai compliance?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
            Discover what your business needs with our interactive tools, or get in touch directly.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
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
        </section>
      </AnimatedSection>
    </Layout>;
}