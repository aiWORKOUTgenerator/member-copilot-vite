import { ClerkProvider } from '@clerk/clerk-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { AnalyticsProvider } from './contexts/AnalyticsContext.tsx';
import { ConfigurationProvider } from './contexts/ConfigurationContext.tsx';
import { ServiceProvider } from './contexts/ServiceContext.tsx';
import { VerificationProvider } from './contexts/VerificationContext.tsx';
import { ConfigurationGuard } from './ui/shared/organisms/ConfigurationGuard.tsx';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigurationProvider>
        <ConfigurationGuard>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <ServiceProvider>
              <VerificationProvider>
                <AnalyticsProvider>
                  <App />
                </AnalyticsProvider>
              </VerificationProvider>
            </ServiceProvider>
          </ClerkProvider>
        </ConfigurationGuard>
      </ConfigurationProvider>
    </BrowserRouter>
  </StrictMode>
);
