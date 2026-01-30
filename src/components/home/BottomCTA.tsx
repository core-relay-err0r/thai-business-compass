import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { motion } from "framer-motion";

export function BottomCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 hero-grid-pattern opacity-40" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-primary/10 blur-3xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-[15%] w-40 h-40 rounded-full bg-primary/15 blur-3xl"
        animate={{
          y: [0, 20, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <AnimatedSection className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Understand your requirements and get transparent pricing in minutes.
          </p>
          <Link to="/services">
            <Button size="lg" className="group neumorphic-button">
              See what applies to you
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}
