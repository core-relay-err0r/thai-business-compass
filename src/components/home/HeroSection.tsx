import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Globe3D } from "@/components/ui/globe-3d";

export function HeroSection() {
  return (
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
          {/* Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="text-xs font-medium tracking-wider text-primary uppercase">
                Thai Corporate & Accounting Services
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Figure out what your business actually needs in Thailand —{" "}
              <span className="text-muted-foreground">before you talk to anyone.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl lg:max-w-none"
            >
              An interactive way for foreign founders to understand their company setup, accounting, corporate actions, and advisory scope — with clear structure and transparent cost.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/services">
                <Button size="lg" className="w-full sm:w-auto neumorphic-button group">
                  See what applies to you
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto group" asChild>
                <a href="#how-it-works" className="flex items-center gap-2">
                  See how it works
                  <ArrowRight className="h-4 w-4 opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" />
                </a>
              </Button>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 text-sm text-muted-foreground/60"
            >
              Understand first. Decide later. No pressure.
            </motion.p>
          </div>

          {/* 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow effect behind globe */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-75" />
              <Globe3D className="w-full h-[500px] relative z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
