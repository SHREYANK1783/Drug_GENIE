import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { initGA } from "./utils/analytics";
import { registerServiceWorker, setupInstallPrompt } from "./utils/pwa";
import "./index.css";

// Initialize Google Analytics
initGA();

// Register Service Worker for PWA
registerServiceWorker();

// Setup PWA install prompt
setupInstallPrompt();
          
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
