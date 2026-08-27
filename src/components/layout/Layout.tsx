import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SubscriptionPopup } from "@/components/subscription/SubscriptionPopup";
import { SubscriptionSection } from "@/components/subscription/SubscriptionSection";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showFooterSubscription?: boolean;
}

export function Layout({ children, showFooterSubscription = true }: LayoutProps) {
  const location = useLocation();
  const isLegalOrPreferencePage = ["/privacy", "/tos", "/unsubscribe"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {showFooterSubscription && !isLegalOrPreferencePage && (
        <SubscriptionSection signupLocation="pre_footer" />
      )}
      <SubscriptionPopup />
      <Footer />
    </div>
  );
}
