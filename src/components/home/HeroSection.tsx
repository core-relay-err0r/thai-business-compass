import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Understand what you need in Thailand.{" "}
            <span className="text-muted-foreground">See the cost instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Built for foreign founders running Thai companies. Clear scope. Clear price.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/accounting">
              <Button size="lg" className="w-full sm:w-auto">
                Start the guided setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <a href="#pricing-logic">
                <FileText className="mr-2 h-4 w-4" />
                See pricing logic
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
