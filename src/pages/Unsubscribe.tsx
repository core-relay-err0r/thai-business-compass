import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Loader2, MailX } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { resolveSubscriptionLanguage } from "@/lib/subscription";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const copy = {
  en: {
    title: "Email preferences",
    description: "Use this page to stop practical PND50 updates sent to this subscription.",
    action: "Unsubscribe",
    success: "You’re unsubscribed. We will not send further practical updates to this subscription.",
    invalid: "This unsubscribe link is incomplete or invalid.",
    error: "We couldn’t update your subscription. Please try again.",
    privacy: "Read our Privacy Policy",
  },
  ru: {
    title: "Настройки email-рассылки",
    description: "На этой странице можно отказаться от практических обновлений PND50.",
    action: "Отписаться",
    success: "Вы отписаны. Мы больше не будем отправлять практические обновления по этой подписке.",
    invalid: "Ссылка для отписки неполная или недействительна.",
    error: "Не удалось обновить подписку. Попробуйте ещё раз.",
    privacy: "Открыть Политику конфиденциальности",
  },
} as const;

export default function Unsubscribe() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const token = searchParams.get("token")?.trim() ?? "";
  const isValidToken = UUID_PATTERN.test(token);
  const language = useMemo(
    () =>
      resolveSubscriptionLanguage(
        location.pathname,
        typeof document === "undefined" ? "en" : document.documentElement.lang,
      ),
    [location.pathname],
  );
  const text = copy[language];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidToken || status === "submitting") return;
    setStatus("submitting");

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error(`unsubscribe_${response.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout showFooterSubscription={false}>
      <SEOHead
        title="Email preferences | PND50"
        description="Manage your PND50 practical-update subscription."
        path="/unsubscribe"
        noIndex
      />
      <main className="border-b border-border py-16 sm:py-24">
        <div className="container px-4 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <MailX className="mb-6 h-9 w-9 text-primary" aria-hidden="true" />
            <h1 className="font-serif text-4xl font-medium sm:text-5xl">{text.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{text.description}</p>

            <div className="mt-10 border-y border-border py-7">
              {status === "success" ? (
                <div className="flex items-start gap-3" role="status">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="leading-relaxed">{text.success}</p>
                </div>
              ) : !isValidToken ? (
                <p className="text-sm text-red-700" role="alert">{text.invalid}</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {text.action}
                  </button>
                  {status === "error" && <p className="mt-3 text-sm text-red-700" role="alert">{text.error}</p>}
                </form>
              )}
            </div>

            <Link to="/privacy" className="mt-6 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">
              {text.privacy}
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
