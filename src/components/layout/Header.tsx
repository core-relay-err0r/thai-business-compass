import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Calculator, Building2, MessageSquare, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const serviceLinks = [{
    href: "/services#corporate",
    label: "Corporate",
    description: "One-time corporate services",
    icon: Building2
  }, {
    href: "/services#accounting",
    label: "Accounting",
    description: "Calculate monthly + yearly cost",
    icon: Calculator
  }, {
    href: "/services#consulting",
    label: "Consulting",
    description: "Business problem solving",
    icon: MessageSquare
  }];
  const startOptions = [{
    href: "/services#corporate",
    icon: Building2,
    title: "Corporate",
    description: "One-time corporate services"
  }, {
    href: "/services#accounting",
    icon: Calculator,
    title: "Accounting",
    description: "Calculate monthly + yearly cost"
  }, {
    href: "/services#consulting",
    icon: MessageSquare,
    title: "Consulting",
    description: "Business problem solving"
  }];
  const isServiceActive = location.pathname === "/services" || location.pathname.startsWith("/services");
  const handleServiceClick = (href: string, e: React.MouseEvent) => {
    const hash = href.split("#")[1];
    if (hash && location.pathname === "/services") {
      e.preventDefault();
      const element = document.getElementById(hash);
      element?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };
  return <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
              <img src={logo} alt="PND50 Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-lg sm:text-xl font-bold tracking-tight">PND50</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">

              <Link to="/about" className={`text-sm font-medium transition-colors hover:text-foreground ${location.pathname === "/about" ? "text-foreground" : "text-muted-foreground"}`}>About Us
            </Link>

              <Link to="/blog" className={`text-sm font-medium transition-colors hover:text-foreground ${location.pathname === "/blog" || location.pathname.startsWith("/blog/") ? "text-foreground" : "text-muted-foreground"}`}>
                Blog
              </Link>

              <Link to="/contact" className={`text-sm font-medium transition-colors hover:text-foreground ${location.pathname === "/contact" ? "text-foreground" : "text-muted-foreground"}`}>
                Contact
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn("text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent h-auto p-0", isServiceActive ? "text-foreground" : "text-muted-foreground")}>
                      <Link to="/services" className="hover:text-foreground transition-colors" onClick={e => e.stopPropagation()}>
                        Our Services
                      </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[280px] gap-1 p-2">
                        {serviceLinks.map(link => <li key={link.href}>
                            <NavigationMenuLink asChild>
                              <Link to={link.href} onClick={e => handleServiceClick(link.href, e)} className={cn("flex items-start gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent hover:translate-x-1 focus:bg-accent", location.hash === `#${link.href.split("#")[1]}` && location.pathname === "/services" && "bg-accent")}>
                                <link.icon className="h-5 w-5 mt-0.5 shrink-0" />
                                <div>
                                  <div className="text-sm font-medium leading-none">{link.label}</div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                    {link.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>)}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          <button className="md:hidden p-2.5 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden border-t border-border/40 bg-background overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="container py-4 flex flex-col gap-1">
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium transition-colors hover:text-foreground py-3 px-2 rounded-lg hover:bg-accent min-h-[44px] flex items-center ${location.pathname === "/about" ? "text-foreground bg-accent" : "text-muted-foreground"}`}>
              About
            </Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium transition-colors hover:text-foreground py-3 px-2 rounded-lg hover:bg-accent min-h-[44px] flex items-center ${location.pathname === "/blog" || location.pathname.startsWith("/blog/") ? "text-foreground bg-accent" : "text-muted-foreground"}`}>
              Blog
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium transition-colors hover:text-foreground py-3 px-2 rounded-lg hover:bg-accent min-h-[44px] flex items-center ${location.pathname === "/contact" ? "text-foreground bg-accent" : "text-muted-foreground"}`}>
              Contact
            </Link>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-3 pb-2 px-2">
              Our Services
            </div>
            {serviceLinks.map(link => <Link key={link.href} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-medium transition-colors hover:text-foreground py-3 px-4 rounded-lg hover:bg-accent min-h-[44px] flex items-center ${location.hash === `#${link.href.split("#")[1]}` && location.pathname === "/services" ? "text-foreground bg-accent" : "text-muted-foreground"}`}>
                <link.icon className="h-4 w-4 mr-3" />
                {link.label}
              </Link>)}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border/40">
              <Link to="/submit" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="default" className="w-full min-h-[44px]">
                  Submit Request
                </Button>
              </Link>
              <Button size="default" onClick={() => {
              setIsMobileMenuOpen(false);
              setIsStartModalOpen(true);
            }} className="w-full min-h-[44px]">
                Start
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Start Modal */}
      <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">What do you need?</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {startOptions.map(option => <Link key={option.href} to={option.href} onClick={() => setIsStartModalOpen(false)} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-foreground/20 hover:bg-accent/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{option.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </Link>)}
          </div>
        </DialogContent>
      </Dialog>
    </>;
}