import { ReactNode } from "react";
import { Header } from "./Header";
import { FloatingStartButton } from "./FloatingStartButton";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <FloatingStartButton />
    </div>
  );
}
