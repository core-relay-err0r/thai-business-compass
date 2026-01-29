import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Calculator, Building2, MessageSquare, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const serviceLinks = [
    { href: "/services#corporate", label: "Corporate", description: "One-time corporate services", icon: Building2 },
    { href: "/services#accounting", label: "Accounting", description: "Calculate monthly + yearly cost", icon: Calculator },
    { href: "/services#consulting", label: "Consulting", description: "Business problem solving", icon: MessageSquare },
  ];

  const startOptions = [
    {
      href: "/services#corporate",
      icon: Building2,
      title: "Corporate",
      description: "One-time corporate services",
    },
    {
      href: "/services#accounting",
      icon: Calculator,
      title: "Accounting",
      description: "Calculate monthly + yearly cost",
    },
    {
      href: "/services#consulting",
      icon: MessageSquare,
      title: "Consulting",
      description: "Business problem solving",
    },
  ];

  const isServiceActive = location.pathname === "/services" || location.pathname.startsWith("/services");

  const handleServiceClick = (href: string, e: React.MouseEvent) => {
    const hash = href.split("#")[1];
    if (hash && location.pathname === "/services") {
      e.preventDefault();
      const element = document.getElementById(hash);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">PND50</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  location.pathname === "/"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Home
              </Link>

              <Link
                to="/about"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  location.pathname === "/about"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                About
              </Link>

              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  location.pathname === "/contact"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Contact
              </Link>

            </nav>
          </div>

          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "text-sm font-medium bg-transparent hover:bg-transparent hover:text-foreground data-[state=open]:bg-transparent h-auto p-0 transition-colors",
                      isServiceActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Our Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-2">
                      {serviceLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={link.href}
                              onClick={(e) => handleServiceClick(link.href, e)}
                              className={cn(
                                "flex items-start gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:translate-x-1 focus:bg-primary/10 focus:text-primary",
                                location.hash === `#${link.href.split("#")[1]}` && location.pathname === "/services" && "bg-primary/10 text-primary"
                              )}
                            >
                              <link.icon className="h-5 w-5 mt-0.5 shrink-0" />
                              <div>
                                <div className="text-sm font-medium leading-none">{link.label}</div>
                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                  {link.description}
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

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

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background">
            <nav className="container py-4 flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-foreground py-2 ${
                  location.pathname === "/"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-foreground py-2 ${
                  location.pathname === "/about"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-foreground py-2 ${
                  location.pathname === "/contact"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Contact
              </Link>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">
                Our Services
              </div>
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-foreground py-2 pl-3 ${
                    location.hash === `#${link.href.split("#")[1]}` && location.pathname === "/services"
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
