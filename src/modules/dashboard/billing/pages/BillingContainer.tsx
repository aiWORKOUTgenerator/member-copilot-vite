'use client';

import BillingContext, { BillingContextType } from '@/contexts/BillingContext';
import { StripeProvider } from '@/contexts/StripeContext';
import TabBar, { TabOption } from '@/ui/shared/molecules/TabBar';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export default function BillingLayout() {
  const pathname = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Map pathname to tab ID
  const getSelectedTabFromPathname = (path: string): string => {
    // Check exact path matches first
    if (path === '/dashboard/billing') return 'subscription';
    if (path === '/dashboard/billing/payment') return 'payment';
    if (path === '/dashboard/billing/history') return 'history';
    if (path === '/dashboard/billing/usage') return 'usage';

    // For more complex paths with additional segments
    if (path.startsWith('/dashboard/billing/payment')) return 'payment';
    if (path.startsWith('/dashboard/billing/history')) return 'history';
    if (path.startsWith('/dashboard/billing/usage')) return 'usage';

    // Default to subscription tab
    return 'subscription';
  };

  // Define the navigation tabs
  const tabs: TabOption[] = [
    {
      id: 'subscription',
      label: 'Subscription',
    },
    {
      id: 'payment',
      label: 'Payment Method',
    },
    {
      id: 'history',
      label: 'History',
    },
    {
      id: 'usage',
      label: 'Usage',
    },
  ];

  // Handle tab change by navigating to the corresponding route
  const handleTabChange = (tabId: string) => {
    switch (tabId) {
      case 'subscription':
        navigate('/dashboard/billing');
        break;
      case 'payment':
        navigate('/dashboard/billing/payment');
        break;
      case 'history':
        navigate('/dashboard/billing/history');
        break;
      case 'usage':
        navigate('/dashboard/billing/usage');
        break;
      default:
        navigate('/dashboard/billing');
    }
  };

  // Handle error message dismissal
  const dismissError = () => {
    setErrorMessage('');
  };

  // Create context value
  const contextValue: BillingContextType = {
    successMessage,
    errorMessage,
    setSuccessMessage,
    setErrorMessage,
    dismissError,
  };

  // Handle case where pathname could be null
  const currentPath = pathname.pathname || '/dashboard/billing';
  const selectedTab = getSelectedTabFromPathname(currentPath);

  return (
    <BillingContext.Provider value={contextValue}>
      <StripeProvider>
        <div className="p-2 sm:p-6">
          {/* Success message alert */}
          {successMessage && (
            <div className="alert alert-success mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error message alert */}
          {errorMessage && (
            <div className="alert alert-error mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <span>{errorMessage}</span>
              </div>
              <button className="btn btn-sm" onClick={dismissError}>
                Dismiss
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <TabBar
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            tabs={tabs}
            className="mb-2 sm:mb-6"
            backgroundClassName="bg-base-200"
          />

          <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-2 sm:p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </StripeProvider>
    </BillingContext.Provider>
  );
}
