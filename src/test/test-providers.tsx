import React from "react";
import { BrowserRouter } from "react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { CombinedProviders } from "../contexts/CombinedProviders";
import { ContactProvider } from "../contexts/ContactContext";

// Custom provider component that includes all necessary providers
export const AllTheProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider publishableKey="pk_test_mock_key_for_testing_only">
      <BrowserRouter>
        <ContactProvider>
          <CombinedProviders>{children}</CombinedProviders>
        </ContactProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
};
