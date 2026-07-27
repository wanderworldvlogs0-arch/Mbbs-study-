import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA install just won't be offered — the app itself still works.
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
