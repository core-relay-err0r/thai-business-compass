export const SUBSCRIPTION_INTERESTS = [
  "bookkeeping",
  "tax_filing",
  "vat",
  "withholding_tax",
  "payroll",
  "company_registration",
  "corporate_changes",
  "general_thailand_compliance",
] as const;

export type SubscriptionInterest = (typeof SUBSCRIPTION_INTERESTS)[number];
export type SubscriptionLanguage = "en" | "ru";
export type SignupLocation =
  | "home_services"
  | "service_accounting"
  | "service_corporate"
  | "article_end"
  | "pre_footer"
  | "popup";
export type SubscriptionEventName =
  | "subscription_view"
  | "subscription_submit"
  | "subscription_success"
  | "subscription_error";

export type SubscriptionAttribution = {
  source_page: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
};

export const SUBSCRIPTION_STORAGE_KEYS = {
  subscribed: "pnd50.subscription.subscribed.v1",
  dismissedAt: "pnd50.subscription.dismissed-at.v1",
} as const;

export const POPUP_DISMISSAL_MS = 14 * 24 * 60 * 60 * 1_000;

const ARTICLE_INTEREST_RULES: Array<[RegExp, SubscriptionInterest]> = [
  [/(withholding|pnd-?1|pnd-?3|pnd-?53)/, "withholding_tax"],
  [/(vat|pp-?30)/, "vat"],
  [/(payroll|social-security)/, "payroll"],
  [/(bookkeep|accounting-bookkeeping|monthly-workflow)/, "bookkeeping"],
  [/(corporate-change|director-change|shareholder-change|structural-change)/, "corporate_changes"],
  [/(company-registration|company-setup|foreign-ownership|company-first|market-entry)/, "company_registration"],
  [/(pnd-?50|pnd-?51|corporate-income-tax|tax-filing|tax-accounting-calendar|annual-audit|financial-statements)/, "tax_filing"],
];

export function inferSubscriptionInterest(page: string): SubscriptionInterest {
  const normalized = page.toLowerCase();
  for (const [pattern, interest] of ARTICLE_INTEREST_RULES) {
    if (pattern.test(normalized)) return interest;
  }

  if (normalized.includes("/services") && normalized.includes("#corporate")) {
    return "company_registration";
  }
  if (normalized.includes("/services") && normalized.includes("#accounting")) {
    return "bookkeeping";
  }
  return "general_thailand_compliance";
}

export function resolveSubscriptionLanguage(
  pathname: string,
  documentLanguage = "en",
): SubscriptionLanguage {
  return pathname === "/ru" || pathname.startsWith("/ru/") || documentLanguage.toLowerCase().startsWith("ru")
    ? "ru"
    : "en";
}

export function captureSubscriptionAttribution(
  location: Pick<Location, "pathname" | "search" | "hash">,
  referrer: string,
): SubscriptionAttribution {
  const params = new URLSearchParams(location.search);
  const clean = (value: string | null, maxLength = 200) =>
    value?.trim() ? value.trim().slice(0, maxLength) : null;

  return {
    source_page: `${location.pathname}${location.search}${location.hash}`.slice(0, 1_000),
    utm_source: clean(params.get("utm_source")),
    utm_medium: clean(params.get("utm_medium")),
    utm_campaign: clean(params.get("utm_campaign")),
    referrer: clean(referrer, 1_000),
  };
}

export function isPopupSuppressedPath(pathname: string): boolean {
  return ["/contact", "/submit", "/privacy", "/tos", "/unsubscribe"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function shouldSuppressPopup(storage: Storage, pathname: string, now = Date.now()): boolean {
  if (isPopupSuppressedPath(pathname)) return true;

  try {
    if (storage.getItem(SUBSCRIPTION_STORAGE_KEYS.subscribed) === "true") return true;
    const dismissedAt = Number(storage.getItem(SUBSCRIPTION_STORAGE_KEYS.dismissedAt));
    return Number.isFinite(dismissedAt) && dismissedAt > 0 && now - dismissedAt < POPUP_DISMISSAL_MS;
  } catch {
    return false;
  }
}

export function markSubscriptionDismissed(storage: Storage, now = Date.now()): void {
  try {
    storage.setItem(SUBSCRIPTION_STORAGE_KEYS.dismissedAt, String(now));
  } catch {
    // Subscription still works when storage is unavailable.
  }
}

export function markSubscriptionSuccessful(storage: Storage): void {
  try {
    storage.setItem(SUBSCRIPTION_STORAGE_KEYS.subscribed, "true");
    storage.removeItem(SUBSCRIPTION_STORAGE_KEYS.dismissedAt);
  } catch {
    // Subscription still works when storage is unavailable.
  }
}

export const subscriptionCopy = {
  en: {
    inline: {
      headline: "Important Thailand company deadlines — before they become problems",
      description:
        "Practical updates on tax filings, accounting, payroll, corporate requirements and common compliance risks for businesses in Thailand.",
      cta: "Get practical updates",
    },
    popup: {
      headline: "Running a company in Thailand?",
      description: "Get important filing deadlines, compliance changes and practical reminders.",
      cta: "Keep me informed",
    },
    microcopy: "Important updates only. No spam. Unsubscribe anytime.",
    consent: "By subscribing, you agree to receive PND50 email updates.",
    success: "You’re subscribed. We’ll send only updates that may materially affect companies in Thailand.",
    error: "We couldn’t save your subscription. Please try again.",
    emailLabel: "Email address",
  },
  ru: {
    inline: {
      headline: "Важные дедлайны для компаний в Таиланде — до того, как они станут проблемой",
      description:
        "Практические обновления по налоговой отчётности, бухгалтерии, зарплатам, корпоративным требованиям и распространённым рискам.",
      cta: "Получать важные обновления",
    },
    popup: {
      headline: "Ведёте компанию в Таиланде?",
      description: "Получайте важные сроки подачи отчётности, изменения требований и практические напоминания.",
      cta: "Держать меня в курсе",
    },
    microcopy: "Только важные обновления. Без спама. Отписаться можно в любой момент.",
    consent: "Подписываясь, вы соглашаетесь получать обновления PND50 по email.",
    success: "Вы подписаны. Мы будем присылать только обновления, которые действительно могут повлиять на работу компании в Таиланде.",
    error: "Не удалось сохранить подписку. Попробуйте ещё раз.",
    emailLabel: "Email",
  },
} as const;

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackSubscriptionEvent(
  name: SubscriptionEventName,
  detail: {
    interest: SubscriptionInterest;
    language: SubscriptionLanguage;
    signup_location: SignupLocation;
    source_page: string;
  },
): void {
  if (typeof window === "undefined") return;

  const event = { event: name, ...detail };
  window.clarity?.("event", name);
  window.dataLayer?.push(event);
  window.dispatchEvent(new CustomEvent("pnd50:analytics", { detail: event }));
}
