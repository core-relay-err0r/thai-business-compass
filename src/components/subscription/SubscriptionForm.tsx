import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  captureSubscriptionAttribution,
  inferSubscriptionInterest,
  markSubscriptionSuccessful,
  resolveSubscriptionLanguage,
  SignupLocation,
  SubscriptionInterest,
  SubscriptionLanguage,
  subscriptionCopy,
  trackSubscriptionEvent,
} from "@/lib/subscription";

type SubscriptionFormProps = {
  signupLocation: SignupLocation;
  interest?: SubscriptionInterest;
  language?: SubscriptionLanguage;
  presentation?: "inline" | "popup";
  tone?: "light" | "dark";
  onSuccess?: () => void;
};

export function SubscriptionForm({
  signupLocation,
  interest: explicitInterest,
  language: explicitLanguage,
  presentation = "inline",
  tone = "light",
  onSuccess,
}: SubscriptionFormProps) {
  const location = useLocation();
  const headingId = useId();
  const statusId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const formStartedAt = useRef(Date.now());
  const viewTracked = useRef(false);
  const [email, setEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const sourcePage = `${location.pathname}${location.search}${location.hash}`;
  const interest = explicitInterest ?? inferSubscriptionInterest(sourcePage);
  const language =
    explicitLanguage ??
    resolveSubscriptionLanguage(
      location.pathname,
      typeof document === "undefined" ? "en" : document.documentElement.lang,
    );
  const copy = subscriptionCopy[language][presentation];
  const sharedCopy = subscriptionCopy[language];
  const analyticsDetail = useMemo(
    () => ({ interest, language, signup_location: signupLocation, source_page: sourcePage }),
    [interest, language, signupLocation, sourcePage],
  );

  useEffect(() => {
    const element = rootRef.current;
    if (!element || viewTracked.current) return;

    const trackView = () => {
      if (viewTracked.current) return;
      viewTracked.current = true;
      trackSubscriptionEvent("subscription_view", analyticsDetail);
    };

    if (!("IntersectionObserver" in window)) {
      trackView();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackView();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [analyticsDetail]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    trackSubscriptionEvent("subscription_submit", analyticsDetail);

    const attribution = captureSubscriptionAttribution(location, document.referrer);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          interest,
          language,
          signup_location: signupLocation,
          form_started_at: formStartedAt.current,
          company_website: companyWebsite,
          ...attribution,
        }),
      });

      if (!response.ok) throw new Error(`subscription_${response.status}`);

      markSubscriptionSuccessful(window.localStorage);
      setStatus("success");
      trackSubscriptionEvent("subscription_success", analyticsDetail);
      onSuccess?.();
    } catch {
      setStatus("error");
      trackSubscriptionEvent("subscription_error", analyticsDetail);
    }
  };

  const isDark = tone === "dark";
  const isPopup = presentation === "popup";

  return (
    <div
      ref={rootRef}
      className={cn(
        "grid items-start gap-6",
        !isPopup && "lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)] lg:gap-12",
      )}
      aria-labelledby={headingId}
      data-subscription-location={signupLocation}
      data-subscription-interest={interest}
    >
      <div className={cn("max-w-2xl", isPopup && "max-w-none")}>
        {!isPopup && (
          <p className={cn("mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]", isDark ? "text-cyan-300" : "text-primary")}>
            Practical Thailand updates
          </p>
        )}
        <h2
          id={headingId}
          className={cn(
            "text-balance font-serif font-medium leading-tight",
            isPopup ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl",
            isDark ? "text-white" : "text-foreground",
          )}
        >
          {copy.headline}
        </h2>
        <p className={cn("mt-3 text-sm leading-relaxed sm:text-base", isDark ? "text-slate-300" : "text-muted-foreground")}>
          {copy.description}
        </p>
      </div>

      <div>
        {status === "success" ? (
          <div
            id={statusId}
            role="status"
            className={cn(
              "flex min-h-[88px] items-start gap-3 border-l-2 p-4",
              isDark ? "border-cyan-300 bg-white/5 text-white" : "border-primary bg-primary/5 text-foreground",
            )}
          >
            <CheckCircle2 className={cn("mt-0.5 h-5 w-5 shrink-0", isDark ? "text-cyan-300" : "text-primary")} aria-hidden="true" />
            <p className="text-sm leading-relaxed sm:text-base">{sharedCopy.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate={false} aria-describedby={statusId}>
            <div className={cn("flex gap-3", isPopup ? "flex-col" : "flex-col sm:flex-row")}>
              <label htmlFor={`${headingId}-email`} className="sr-only">
                {sharedCopy.emailLabel}
              </label>
              <div className="relative min-w-0 flex-1">
                <Mail
                  className={cn("pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2", isDark ? "text-slate-400" : "text-muted-foreground")}
                  aria-hidden="true"
                />
                <input
                  id={`${headingId}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  maxLength={320}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  className={cn(
                    "h-12 w-full rounded-md border bg-transparent pl-10 pr-3 text-base outline-none transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isDark
                      ? "border-white/25 text-white placeholder:text-slate-500 focus:ring-offset-slate-950"
                      : "border-input text-foreground placeholder:text-muted-foreground focus:ring-offset-background",
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {copy.cta}
              </button>
            </div>

            <div className="hidden" aria-hidden="true">
              <label htmlFor={`${headingId}-company-website`}>Company website</label>
              <input
                id={`${headingId}-company-website`}
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                value={companyWebsite}
                onChange={(event) => setCompanyWebsite(event.target.value)}
              />
            </div>

            <p className={cn("mt-3 text-xs leading-relaxed", isDark ? "text-slate-400" : "text-muted-foreground")}>
              {sharedCopy.microcopy} {sharedCopy.consent}{" "}
              <Link
                to="/privacy"
                className={cn("underline underline-offset-2", isDark ? "hover:text-white" : "hover:text-foreground")}
              >
                Privacy Policy
              </Link>
            </p>
            <p
              id={statusId}
              className={cn("mt-2 min-h-5 text-sm", status === "error" ? "text-red-600" : "sr-only")}
              role={status === "error" ? "alert" : undefined}
              aria-live="polite"
            >
              {status === "error" ? sharedCopy.error : ""}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
