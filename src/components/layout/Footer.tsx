import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const servicesLinks = [
    { label: "Corporate Services", href: "/services#corporate" },
    { label: "Accounting", href: "/services#accounting" },
    { label: "Consulting", href: "/services#consulting" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-white">PND50</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Professional accounting and business consulting for foreign companies operating in Thailand since 2015.
            </p>
            <div className="space-y-2 text-sm">
              <a 
                href="mailto:info@pnd50.com" 
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                info@pnd50.com
              </a>
              <a 
                href="tel:+66843563805" 
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                +66 84 356 3805
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Location
            </h4>
            <p className="text-sm font-medium text-white mb-2">Bangkok, Thailand</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Suite 3065, 30th Floor<br />
              Bhiraj Tower at EmQuartier<br />
              689 Sukhumvit Rd, Watthana
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} PND50. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
