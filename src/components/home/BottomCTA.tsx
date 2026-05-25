import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { motion } from "framer-motion";

export function BottomCTA() {
  return (
    <section className="py-8 sm:py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 hero-grid-pattern opacity-40" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-10 left-[10%] w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-primary/10 blur-3xl"
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
        className="absolute bottom-10 right-[15%] w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-primary/15 blur-3xl"
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
      
      <AnimatedSection className="container relative z-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">
            Not sure what services you need?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Use our cost estimate tool to understand monthly accounting, year-end audit, company changes, documents, and advisory costs before requesting a final quote.
          </p>
          <a href="https://calculator.pnd50.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="group neumorphic-button min-h-[44px]">
              Open Cost Calculator
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}
