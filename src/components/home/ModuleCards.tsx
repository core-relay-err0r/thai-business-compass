import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Building2, MessageSquare, ArrowRight } from "lucide-react";

const modules = [
  {
    href: "/accounting",
    icon: Calculator,
    title: "Accounting",
    description: "Calculate monthly + yearly cost while learning what's required.",
    features: ["Monthly bookkeeping", "Tax filings", "VAT reporting", "Payroll"],
  },
  {
    href: "/corporate",
    icon: Building2,
    title: "Corporate Services",
    description: "Choose the event (incorporation, director change, share transfer). Get scope + one-time price.",
    features: ["Company registration", "Director changes", "Share transfers", "Address updates"],
  },
  {
    href: "/consulting",
    icon: MessageSquare,
    title: "Consulting",
    description: "Choose the business problem. Get expected outcomes + price range.",
    features: ["Cost reduction", "Market entry", "Due diligence", "Compliance"],
  },
];

export function ModuleCards() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What do you need?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your starting point. Each module guides you through the scope and shows you the cost.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modules.map((module) => (
            <Card key={module.href} className="relative group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <module.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  {module.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={module.href}>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
