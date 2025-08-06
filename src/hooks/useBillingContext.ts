'use client';

import BillingContext from '@/contexts/BillingContext';
import { useContext } from 'react';

// Custom hook to access the billing context
export const useBillingContext = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBillingContext must be used within a BillingProvider');
  }
  return context;
};
