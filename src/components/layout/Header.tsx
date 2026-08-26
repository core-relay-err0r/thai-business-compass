import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLink = (path: string) =>
    cn(
      "flex min-h-[44px] items-center border-b-2 border-transparent text-sm font-medium transition-colors hover:border-primary hover:text-primary",
      (location.pathname === path || (path === "/blog" && location.pathname.startsWith("/blog/"))) &&
        "border-primary text-primary",
    );

  const closeMobile = () => setIsMobileMenuOpen(false);
  const links = [
    ["/services", "Services"],
    ["/services#accounting", "Accounting & Tax"],
    ["/services#corporate", "Corporate Compliance"],
    ["/about", "About"],
    ["/contact", "Contact"],
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="PND50 Accounting Thailand home">
          <img src={logo} alt="" className="size-8 sm:size-9" />
          <span className="text-xl font-semibold tracking-tight">PND50</span>
          <span className="hidden border-l border-border pl-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground lg:inline">
            Accounting Thailand
          </span>
        </Link>

        <nav className="hidden h-full items-center gap-7 xl:flex" aria-label="Primary navigation">
          <Link to="/services" className={navLink("/services")}>Services</Link>
          <a href="/services#accounting" className={navLink("__accounting")}>Accounting &amp; Tax</a>
          <a href="/services#corporate" className={navLink("__corporate")}>Corporate Compliance</a>
          <Link to="/about" className={navLink("/about")}>About</Link>
          <Link to="/contact" className={navLink("/contact")}>Contact</Link>
        </nav>

        <Button asChild className="hidden rounded-none xl:inline-flex">
          <Link to="/contact">Contact us <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
        </Button>

        <button
          className="flex size-11 items-center justify-center xl:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          "overflow-hidden border-border bg-background transition-all duration-300 xl:hidden",
          isMobileMenuOpen ? "max-h-[560px] border-t opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container flex flex-col px-4 py-4 sm:px-6" aria-label="Mobile navigation">
          {links.map(([path, label], index) => (
            <Link
              key={path}
              to={path}
              onClick={closeMobile}
              className="flex min-h-[52px] items-center justify-between border-b border-border text-base font-medium"
            >
              <span>{label}</span><span className="text-xs text-muted-foreground">0{index + 1}</span>
            </Link>
          ))}
          <Button asChild className="mt-4 min-h-12 w-full rounded-none">
            <Link to="/contact" onClick={closeMobile}>
              Contact us <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
