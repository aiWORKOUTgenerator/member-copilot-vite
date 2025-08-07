import { ClerkProvider } from '@clerk/clerk-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { AnalyticsProvider } from './contexts/AnalyticsContext.tsx';
import { ServiceProvider } from './contexts/ServiceContext.tsx';
import { VerificationProvider } from './contexts/VerificationContext.tsx';

// Load dynamic theme CSS
const currentDomain = window.location.hostname;
const apiUrl = import.meta.env.VITE_PRIMARY_URL;

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
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ServiceProvider>
          <VerificationProvider>
            <AnalyticsProvider>
              <App />
            </AnalyticsProvider>
          </VerificationProvider>
        </ServiceProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
