import { cn } from "@/lib/utils";
import { SignupLocation, SubscriptionInterest } from "@/lib/subscription";
import { SubscriptionForm } from "./SubscriptionForm";

type SubscriptionSectionProps = {
  signupLocation: SignupLocation;
  interest?: SubscriptionInterest;
  tone?: "light" | "dark";
  embedded?: boolean;
  className?: string;
};

export function SubscriptionSection({
  signupLocation,
  interest,
  tone = "light",
  embedded = false,
  className,
}: SubscriptionSectionProps) {
  const content = (
    <SubscriptionForm
      signupLocation={signupLocation}
      interest={interest}
      tone={tone}
    />
  );

  if (embedded) {
    return (
      <section
        className={cn(
          "border-y py-8 sm:py-10",
          tone === "dark" ? "border-white/10 bg-slate-950 px-5 sm:px-7" : "border-border",
          className,
        )}
      >
        {content}
      </section>
    );
  }

  return (
    <section
      className={cn(
        "border-y py-12 sm:py-16",
        tone === "dark" ? "border-slate-800 bg-slate-950" : "border-border bg-muted/25",
        className,
      )}
    >
      <div className="container px-4 sm:px-6">{content}</div>
    </section>
  );
}
