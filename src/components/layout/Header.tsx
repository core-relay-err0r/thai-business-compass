import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowUpRight, Calculator, Building2, MessageSquare, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const CALCULATOR_URL = "https://calculator.pnd50.com";

export function Header() {
  const location = useLocation();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const startOptions = [
    { href: "/services#accounting", icon: Calculator, title: "Accounting & Tax", description: "Recurring monthly and annual compliance" },
    { href: "/services#corporate", icon: Building2, title: "Corporate", description: "One-time company services" },
    { href: "/services#consulting", icon: MessageSquare, title: "Business consulting", description: "Business problem solving" },
  ];

  const navLink = (path: string) => cn(
    "flex min-h-[44px] items-center border-b-2 border-transparent text-sm font-medium transition-colors hover:border-primary hover:text-primary",
    (location.pathname === path || (path === "/blog" && location.pathname.startsWith("/blog/"))) && "border-primary text-primary"
  );

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-center gap-2" aria-label="PND50 home">
            <img src={logo} alt="" className="size-8 sm:size-9" />
            <span className="text-xl font-semibold tracking-tight">PND50</span>
            <span className="hidden border-l border-border pl-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground lg:inline">Thailand business compass</span>
          </Link>

          <nav className="hidden h-full items-center gap-7 md:flex" aria-label="Primary navigation">
            <Link to="/services" className={navLink("/services")}>Services</Link>
            <Link to="/about" className={navLink("/about")}>About</Link>
            <Link to="/blog" className={navLink("/blog")}>Perspectives</Link>
            <Link to="/contact" className={navLink("/contact")}>Contact</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href={CALCULATOR_URL} className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium hover:underline">
              Calculator <ArrowUpRight aria-hidden="true" />
            </a>
            <Button onClick={() => setIsStartModalOpen(true)} className="rounded-none">Start here</Button>
          </div>

          <button
            className="flex size-11 items-center justify-center md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        <div id="mobile-navigation" className={cn("overflow-hidden border-border bg-background transition-all duration-300 md:hidden", isMobileMenuOpen ? "max-h-[620px] border-t opacity-100" : "max-h-0 opacity-0")}>
          <nav className="container flex flex-col px-4 py-4 sm:px-6" aria-label="Mobile navigation">
            {[
              ["/services", "Services"],
              ["/about", "About"],
              ["/blog", "Perspectives"],
              ["/contact", "Contact"],
            ].map(([path, label], index) => (
              <Link key={path} to={path} onClick={closeMobile} className="flex min-h-[52px] items-center justify-between border-b border-border text-base font-medium">
                <span>{label}</span><span className="text-xs text-muted-foreground">0{index + 1}</span>
              </Link>
            ))}
            <a href={CALCULATOR_URL} onClick={closeMobile} className="mt-4 flex min-h-[48px] items-center justify-between border border-foreground px-4 text-sm font-medium">
              Cost calculator <ArrowUpRight aria-hidden="true" />
            </a>
            <div className="grid grid-cols-2 gap-3 pt-3">
              <Link to="/submit" onClick={closeMobile}><Button variant="outline" className="w-full rounded-none">Submit request</Button></Link>
              <Button className="w-full rounded-none" onClick={() => { closeMobile(); setIsStartModalOpen(true); }}>Start here</Button>
            </div>
          </nav>
        </div>
      </header>

      <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
        <DialogContent className="rounded-none sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-medium">What does your business need?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col py-4">
            {startOptions.map((option, index) => (
              <Link key={option.href} to={option.href} onClick={() => setIsStartModalOpen(false)} className="group flex items-center gap-4 border-t border-border py-5 last:border-b">
                <span className="text-xs text-muted-foreground">0{index + 1}</span>
                <div className="flex-1">
                  <div className="font-medium">{option.title}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                <ArrowUpRight aria-hidden="true" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
