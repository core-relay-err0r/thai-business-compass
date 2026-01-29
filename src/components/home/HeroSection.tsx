import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
export function HeroSection() {
  return <section className="py-20 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Figure out what your business actually needs in Thailand —{" "}
            <span className="text-muted-foreground">before you talk to anyone.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            An interactive way for foreign founders to understand their company setup, accounting, corporate actions, and advisory scope — with clear structure and transparent cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/corporate">
              <Button size="lg" className="w-full sm:w-auto">
                See what applies to you
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <a href="#how-it-works">
                See how it works
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground/60">Understand first. Decide later. No pressure.</p>
        </div>
      </div>
    </section>;
}