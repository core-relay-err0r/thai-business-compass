import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Submit from "@/pages/Submit";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/services"
          element={
            <PageTransition>
              <Services />
            </PageTransition>
          }
        />
        {/* Redirect old routes to unified services page */}
        <Route path="/corporate" element={<Navigate to="/services#corporate" replace />} />
        <Route path="/accounting" element={<Navigate to="/services#accounting" replace />} />
        <Route path="/consulting" element={<Navigate to="/services#consulting" replace />} />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/submit"
          element={
            <PageTransition>
              <Submit />
            </PageTransition>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageTransition>
              <Privacy />
            </PageTransition>
          }
        />
        <Route
          path="/tos"
          element={
            <PageTransition>
              <Terms />
            </PageTransition>
          }
        />
        <Route
          path="/blog"
          element={
            <PageTransition>
              <Blog />
            </PageTransition>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <PageTransition>
              <BlogPost />
            </PageTransition>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
