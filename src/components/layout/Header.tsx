import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calculator, Building2, MessageSquare, Menu, X } from "lucide-react";

export function Header() {
  const location = useLocation();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/accounting", label: "Accounting" },
    { href: "/corporate", label: "Corporate" },
    { href: "/consulting", label: "Consulting" },
  ];

  const startOptions = [
    {
      href: "/accounting",
      icon: Calculator,
      title: "Accounting",
      description: "Calculate monthly + yearly cost",
    },
    {
      href: "/corporate",
      icon: Building2,
      title: "Corporate",
      description: "One-time corporate services",
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
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">PND50</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    location.pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/submit" className="hidden md:block">
              <Button variant="outline" size="sm">
                Submit Request
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setIsStartModalOpen(true)}
              className="hidden md:flex"
            >
              Start
            </Button>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background">
            <nav className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-foreground py-2 ${
                    location.pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <Link to="/submit" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Submit Request
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsStartModalOpen(true);
                  }}
                  className="w-full"
                >
                  Start
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Start Modal */}
      <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">What do you need?</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {startOptions.map((option) => (
              <Link
                key={option.href}
                to={option.href}
                onClick={() => setIsStartModalOpen(false)}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-foreground/20 hover:bg-accent/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{option.title}</div>
                  <div className="text-sm text-muted-foreground">
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
