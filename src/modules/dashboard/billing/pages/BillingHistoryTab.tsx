'use client';

import { PortalConfiguration } from '@/domain/interfaces/services/SubscriptionService';
import { useState } from 'react';
import { useBillingContext } from '@/hooks/useBillingContext';
import { useSubscription } from '@/hooks/useSubscription';

export default function BillingHistoryPage() {
  const { createCustomerPortalSession } = useSubscription();
  const [isProcessingPortal, setIsProcessingPortal] = useState(false);
  const { setErrorMessage } = useBillingContext();

  // Handler for redirecting to Stripe Billing Portal
  const handleRedirectToPortal = async (
    portalConfiguration: PortalConfiguration,
    returnPath?: string
  ) => {
    if (isProcessingPortal) return;

    setIsProcessingPortal(true);
    setErrorMessage(''); // Clear previous errors

    try {
      console.log(`Requesting customer portal session: ${portalConfiguration}`);
      const { url } = await createCustomerPortalSession(
        portalConfiguration,
        returnPath
      );
      console.log(`Received portal URL: ${url}`);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Portal URL not received from the server.');
      }
      // No need to set processing to false here, as we are navigating away
    } catch (error) {
      console.error('Failed to redirect to customer portal:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          'Failed to open the billing portal. Please try again later.'
        );
      }
      setIsProcessingPortal(false); // Set to false only on error
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-box space-y-4">
      <h2 className="text-xl font-bold mb-4">Billing History</h2>
      <p className="text-base-content/70">
        View your past invoices and download them for your records.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => handleRedirectToPortal('view_invoice_history')}
        disabled={isProcessingPortal}
      >
        {isProcessingPortal ? (
          <span className="loading loading-spinner"></span>
        ) : null}
        View Billing History
      </button>
    </div>
  );
}
