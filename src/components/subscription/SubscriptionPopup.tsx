import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  markSubscriptionDismissed,
  shouldSuppressPopup,
} from "@/lib/subscription";
import { SubscriptionForm } from "./SubscriptionForm";

const POPUP_DELAY_MS = 35_000;
const DESKTOP_POPUP_QUERY = "(min-width: 768px)";

export function SubscriptionPopup() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    if (
      !window.matchMedia(DESKTOP_POPUP_QUERY).matches ||
      shouldSuppressPopup(window.localStorage, location.pathname)
    ) {
      return;
    }

    let triggered = false;
    const open = () => {
      if (triggered || shouldSuppressPopup(window.localStorage, location.pathname)) return;
      triggered = true;
      setIsOpen(true);
      cleanup();
    };

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.5) open();
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (
        window.matchMedia("(min-width: 1024px)").matches &&
        event.clientY <= 0 &&
        event.relatedTarget === null
      ) {
        open();
      }
    };

    const timer = window.setTimeout(open, POPUP_DELAY_MS);
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseout", handleMouseOut);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseout", handleMouseOut);
    handleScroll();
    return cleanup;
  }, [location.pathname]);

  if (!isOpen) return null;

  const dismiss = () => {
    markSubscriptionDismissed(window.localStorage);
    setIsOpen(false);
  };

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-label="PND50 practical updates"
      className="fixed bottom-20 left-4 right-16 z-40 hidden max-h-[calc(100vh-6rem)] overflow-y-auto rounded-md border border-slate-700 bg-slate-950 p-5 shadow-2xl md:block md:left-auto md:w-[420px] lg:bottom-6 lg:right-16"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Close subscription prompt"
        title="Close"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="pr-8">
        <SubscriptionForm
          signupLocation="popup"
          presentation="popup"
          tone="dark"
        />
      </div>
    </aside>
  );
}
