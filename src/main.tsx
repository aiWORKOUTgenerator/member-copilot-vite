import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { AnalyticsProvider } from "./contexts/AnalyticsContext.tsx";
import { CombinedProviders } from "./contexts/CombinedProviders.tsx";
import { ContactProvider } from "./contexts/ContactContext.tsx";
import { ServiceProvider } from "./contexts/ServiceContext.tsx";
import { UserAccessProvider } from "./contexts/UserAccessContext.tsx";
import { VerificationProvider } from "./contexts/VerificationContext.tsx";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ServiceProvider>
          <VerificationProvider>
            <ContactProvider>
              <UserAccessProvider>
                <CombinedProviders>
                  <AnalyticsProvider>
                    <App />
                  </AnalyticsProvider>
                </CombinedProviders>
              </UserAccessProvider>
            </ContactProvider>
          </VerificationProvider>
        </ServiceProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
