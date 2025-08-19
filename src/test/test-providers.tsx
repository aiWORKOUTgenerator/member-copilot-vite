import React from 'react';
import { BrowserRouter } from 'react-router';
import { ClerkProvider } from '@clerk/clerk-react';

// Custom provider component that includes all necessary providers
export const AllTheProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider publishableKey="pk_test_mock_key_for_testing_only">
      <BrowserRouter>{children}</BrowserRouter>
    </ClerkProvider>
  );
};
