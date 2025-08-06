'use client';
import { createContext } from 'react';

// Create a context for sharing billing state with child pages
export interface BillingContextType {
  successMessage: string;
  errorMessage: string;
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
  dismissError: () => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export default BillingContext;
