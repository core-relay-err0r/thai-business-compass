import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // Only scroll to top if there's no hash fragment
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, key]);

  return null;
}
