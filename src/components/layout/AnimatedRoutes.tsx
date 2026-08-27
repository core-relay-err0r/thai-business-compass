import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const CostEstimator = lazy(() => import("@/pages/CostEstimator"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const Submit = lazy(() => import("@/pages/Submit"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Unsubscribe = lazy(() => import("@/pages/Unsubscribe"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteFallback() {
  return (
    <div className="container flex min-h-[55vh] items-center px-4 sm:px-6" role="status" aria-live="polite">
      <p className="text-sm text-muted-foreground">Loading page…</p>
    </div>
  );
}

export function AnimatedRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/corporate" element={<Navigate to="/services#corporate" replace />} />
        <Route path="/corporate-services" element={<Navigate to="/services#corporate" replace />} />
        <Route path="/accounting" element={<Navigate to="/services#accounting" replace />} />
        <Route path="/cost-calculator" element={<Navigate to="/tools/cost-estimator" replace />} />
        <Route path="/tools/cost-estimator" element={<CostEstimator />} />
        <Route path="/consulting" element={<Navigate to="/services#consulting" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<Terms />} />
        <Route path="/terms" element={<Navigate to="/tos" replace />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
