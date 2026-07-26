import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";

export default function NotFound() {
  const location = useLocation();

  return (
    <Layout>
      <SEOHead
        title="Page not found | PND50"
        description="The requested page could not be found. Return to PND50 for Thai accounting, tax, and corporate compliance services."
        path={location.pathname}
        noIndex
      />
      <main className="border-b border-border">
        <div className="container px-4 sm:px-6">
          <div className="grid min-h-[70vh] border-x border-border lg:grid-cols-[0.65fr_1.35fr]">
            <div className="flex flex-col justify-between border-b border-border p-6 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Error 404</p>
              <p className="mt-16 break-all text-sm text-muted-foreground lg:mt-0">{location.pathname}</p>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-16">
              <p className="font-serif text-7xl font-medium tracking-[-0.06em] text-primary sm:text-9xl">404</p>
              <h1 className="mt-6 text-balance font-serif text-3xl font-medium tracking-tight sm:text-5xl">This page is not in our records.</h1>
              <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">The address may have changed, or the page may no longer be available. Return to the homepage to continue.</p>
              <Link to="/" className="mt-8 w-fit"><Button size="lg"><ArrowLeft className="mr-2 h-4 w-4" />Return home</Button></Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
