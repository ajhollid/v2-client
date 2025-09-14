import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider";

import { Provider } from "@/components/ui/provider.tsx";
import { BrowserRouter as Router } from "react-router-dom";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Provider>
        <Router>
          <App />
        </Router>
      </Provider>
    </AuthProvider>
  </StrictMode>
);
