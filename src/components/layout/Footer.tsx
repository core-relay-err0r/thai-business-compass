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
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
      {/* Background Watermark - Hidden on mobile */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden">
        <span className="hidden md:block text-[10rem] lg:text-[15rem] xl:text-[20rem] font-bold text-slate-800/30 tracking-tight -mr-5 lg:-mr-10">
          PND50
        </span>
      </div>
      
      {/* Main Footer */}
      <div className="container py-10 sm:py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-lg sm:text-xl font-bold text-white">PND50</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4 sm:mb-6 leading-relaxed">
              PND50 is a Bangkok-based accounting firm providing corporate tax, bookkeeping, payroll, and business advisory services for foreign-owned companies in Thailand.
            </p>
            <div className="space-y-2 text-sm">
              <a 
                href="mailto:info@pnd50.com" 
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors min-h-[44px] sm:min-h-0"
              >
                <Mail className="h-4 w-4" />
                info@pnd50.com
              </a>
              <a 
                href="tel:+66843563805" 
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors min-h-[44px] sm:min-h-0"
              >
                <Phone className="h-4 w-4" />
                +66 84 356 3805
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Services
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Column */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
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
        <div className="container py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
              © {currentYear} PND50. All rights reserved.
            </p>
            <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6">
              <Link
                to="/privacy"
                className="text-xs sm:text-sm text-slate-500 hover:text-slate-300 transition-colors min-h-[44px] sm:min-h-0 flex items-center"
              >
                Privacy Policy
              </Link>
              <Link
                to="/tos"
                className="text-xs sm:text-sm text-slate-500 hover:text-slate-300 transition-colors min-h-[44px] sm:min-h-0 flex items-center"
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
