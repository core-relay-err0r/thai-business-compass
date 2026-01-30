import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Award, 
  Users, 
  ThumbsUp, 
  MessageCircle, 
  ShieldCheck, 
  Heart,
  ArrowRight,
  ChevronDown
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
      {/* Hero Section - Full Viewport */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 hero-grid-pattern" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="secondary" className="mb-4">
                  About PND50
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              >
                Regional corporate specialist with{" "}
                <span className="text-primary">Global standards</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground mt-6 text-lg max-w-lg"
              >
                PND50 is an accounting and advisory firm based in Thailand, helping 
                foreign-owned businesses navigate Thai accounting and compliance with 
                clarity and confidence.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link to="/contact" className="inline-block mt-8">
                  <Button size="lg" className="neumorphic-button group">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right: Team Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-[450px] md:max-w-[550px] lg:max-w-[600px] h-[400px] md:h-[450px] lg:h-[500px] mx-auto"
            >
              {/* Decorative background circles */}
              <div className="absolute top-[8%] left-[2%] w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full opacity-90 z-0 bg-primary/20" />
              <div className="absolute top-[3%] right-[12%] w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-primary/40 opacity-80 z-0" />
              <div className="absolute bottom-[12%] right-[2%] w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-muted-foreground/70 opacity-90 z-0" />
              
              {/* Team member photos */}
              <div className="absolute top-[12%] right-[8%] w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-background shadow-xl z-10 hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <Users className="w-16 h-16 md:w-20 md:h-20 text-primary/60" />
                </div>
              </div>
              <div className="absolute bottom-[8%] left-[12%] w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-background shadow-xl z-10 hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
                  <Users className="w-20 h-20 md:w-24 md:h-24 text-primary/70" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#stats" className="flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-primary transition-colors">
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </a>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="container py-16 md:py-24">
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
