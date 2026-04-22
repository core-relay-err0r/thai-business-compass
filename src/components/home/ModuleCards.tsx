import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Building2, MessageSquare, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const modules = [
  {
    href: "/corporate",
    icon: Building2,
    title: "Corporate Services",
    description: "Choose the event (incorporation, director change, share transfer). Get scope + one-time price.",
    features: ["Company registration Thailand", "Director changes", "Share transfers", "Business setup Thailand"],
  },
  {
    href: "/accounting",
    icon: Calculator,
    title: "Accounting",
    description: "Calculate monthly + yearly cost while learning what's required.",
    features: ["Monthly bookkeeping", "Corporate tax filing", "VAT reporting", "Payroll services Thailand"],
  },
  {
    href: "/consulting",
    icon: MessageSquare,
    title: "Consulting",
    description: "Choose the business problem. Get expected outcomes + price range.",
    features: ["Business advisory", "Market entry", "Due diligence", "Tax planning Thailand"],
  },
];

export function ModuleCards() {
  return (
    <section className="py-8 sm:py-12 md:py-20 bg-muted/30">
      <AnimatedSection className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">What do you need?</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Choose your starting point. Each module guides you through the scope and shows you the cost.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {modules.map((module) => (
            <Card key={module.href} className="relative group hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 mb-3 sm:mb-4">
                  <module.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{module.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 flex flex-col flex-1">
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  {module.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link to={module.href}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors min-h-[44px]">
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
