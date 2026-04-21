import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App.tsx";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NetworkWatcher, OfflineBanner } from "./components/NetworkStatus";
import "./styles/index.css";
import "./styles/responsive-dark-mode.css";
import "./styles/auth-shell.css";
import "./styles/dashboard.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <NetworkWatcher />
        <OfflineBanner />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </ErrorBoundary>,
);
