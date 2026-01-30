import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calculator, Building2, MessageSquare, ArrowRight } from "lucide-react";

export function FloatingStartButton() {
  const [isOpen, setIsOpen] = useState(false);

  const startOptions = [
    {
      href: "/corporate",
      icon: Building2,
      title: "Corporate",
      description: "One-time corporate services",
    },
    {
      href: "/accounting",
      icon: Calculator,
      title: "Accounting",
      description: "Calculate monthly + yearly cost",
    },
    {
      href: "/consulting",
      icon: MessageSquare,
      title: "Consulting",
      description: "Business problem solving",
    },
  ];

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 shadow-lg md:hidden min-h-[44px] pb-safe"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
        onClick={() => setIsOpen(true)}
      >
        Start <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">What do you need?</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 sm:gap-3 py-3 sm:py-4">
            {startOptions.map((option) => (
              <Link
                key={option.href}
                to={option.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border hover:border-foreground/20 hover:bg-accent/50 transition-colors min-h-[60px]"
              >
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10">
                  <option.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm sm:text-base">{option.title}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
