import { ClerkProvider } from '@clerk/clerk-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { AnalyticsProvider } from './contexts/AnalyticsContext.tsx';
import { ServiceProvider } from './contexts/ServiceContext.tsx';
import { VerificationProvider } from './contexts/VerificationContext.tsx';
import { ConfigurationGuard } from './ui/shared/organisms/ConfigurationGuard.tsx';
import { TitleProvider } from './contexts/TitleContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const qc = new QueryClient();

// Load dynamic theme CSS
const currentDomain = window.location.hostname;
const apiUrl = import.meta.env.VITE_CONFIG_API_URL;

if (apiUrl) {
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = `${apiUrl}/theme.css?domain=${currentDomain}`;
  cssLink.id = 'dynamic-theme-css';

  // Check if already loaded to avoid duplicates
  if (!document.getElementById('dynamic-theme-css')) {
    document.head.appendChild(cssLink);
  }
}

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <ConfigurationGuard>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <ServiceProvider>
              <VerificationProvider>
                <TitleProvider>
                  <AnalyticsProvider>
                    <App />
                  </AnalyticsProvider>
                </TitleProvider>
              </VerificationProvider>
            </ServiceProvider>
          </ClerkProvider>
        </ConfigurationGuard>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
