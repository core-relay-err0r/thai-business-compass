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
import teamMember1 from "@/assets/team-member-1.jpeg";
import teamMember2 from "@/assets/team-member-2.png";
import teamAtWork from "@/assets/team-at-work.jpg";

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
      <section className="lg:min-h-[calc(100vh-4rem)] flex items-center relative overflow-hidden py-12 sm:py-16 lg:py-0">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 hero-grid-pattern" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 -right-32 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 rounded-full bg-primary/10 blur-3xl"
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
          className="absolute -bottom-32 -left-32 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 rounded-full bg-primary/5 blur-3xl"
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

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="secondary" className="mb-3 sm:mb-4">
                  About PND50
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              >
                Regional corporate specialist with{" "}
                <span className="text-primary">Global standards</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground mt-4 sm:mt-6 text-base sm:text-lg max-w-lg"
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
                <Link to="/services" className="inline-block mt-6 sm:mt-8">
                  <Button size="lg" className="neumorphic-button group min-h-[44px]">
                    See what applies to you
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>

              {/* Mobile Stats Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:hidden mt-8 grid grid-cols-3 gap-3"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-muted/40 border border-border/50">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Team Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-[450px] md:max-w-[550px] lg:max-w-[600px] h-[400px] md:h-[450px] lg:h-[500px] mx-auto hidden lg:block"
            >
              {/* Animated decorative background circles */}
              <motion.div 
                className="absolute top-[8%] left-[2%] w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full z-0 bg-primary/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute top-[3%] right-[12%] w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-primary/30 z-0"
                animate={{ scale: [1.05, 1, 1.05] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-[12%] right-[2%] w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-muted-foreground/50 z-0"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Floating accent dots */}
              <motion.div 
                className="absolute top-[25%] left-[25%] w-4 h-4 rounded-full bg-primary/40 z-0"
                animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-[30%] right-[20%] w-3 h-3 rounded-full bg-primary/30 z-0"
                animate={{ y: [0, 6, 0], x: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Team member photos */}
              <motion.div 
                className="absolute top-[12%] right-[8%] w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden border-4 border-background shadow-2xl z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={teamMember1} 
                  alt="Team member" 
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
              <motion.div 
                className="absolute bottom-[8%] left-[12%] w-48 h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 rounded-full overflow-hidden border-4 border-background shadow-2xl z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={teamMember2} 
                  alt="Team member" 
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
              
              {/* Connection line */}
              <svg className="absolute inset-0 w-full h-full z-5 pointer-events-none" viewBox="0 0 600 500">
                <motion.path
                  d="M 380 150 Q 300 250 220 350"
                  stroke="hsl(var(--primary) / 0.15)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator - Desktop only */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2"
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

      {/* Stats Section - Desktop only (mobile stats are in hero) */}
      <section id="stats" className="container py-12 sm:py-16 md:py-24 px-4 sm:px-6 hidden lg:block">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 text-center">
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
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/30 border-y border-border/40">
        <div className="container py-12 sm:py-16 md:py-24 px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
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
                {values.map((value) => (
                  <div key={value.title} className="flex items-start gap-3 sm:gap-4">
                    <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 shrink-0 mt-0.5">
                      <value.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{value.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image placeholder */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-border/50">
                <img 
                  src={teamAtWork} 
                  alt="Our team at work" 
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlays for fading effect */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 rounded-xl bg-primary/10 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
    </Layout>
  );
}
