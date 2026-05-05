import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupBotId } from "./lib/botid";

setupBotId();

createRoot(document.getElementById("root")!).render(<App />);
