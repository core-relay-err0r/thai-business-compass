import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupBotId } from "./lib/botid";

setupBotId();

// Build-time HTML gives non-JavaScript crawlers complete route content.
// The SPA removes that crawl shell immediately when JavaScript is available.
document.getElementById("prerender-content")?.remove();

createRoot(document.getElementById("root")!).render(<App />);
