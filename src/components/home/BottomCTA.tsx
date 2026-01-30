import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export function BottomCTA() {
  return (
    <section className="py-20 bg-primary">
      <AnimatedSection className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
            Ready to get started?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Understand your requirements and get transparent pricing in minutes.
          </p>
          <Link to="/services">
            <Button size="lg" variant="secondary" className="group">
              See what applies to you
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}
