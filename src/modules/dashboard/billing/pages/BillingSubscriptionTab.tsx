'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { useAnalyticsWithTenant } from '@/hooks/useAnalytics';
import { useBillingContext } from '@/hooks/useBillingContext';
import PricingComponent from '@/ui/shared/organisms/PricingComponent';
import { ContentCard } from '@/ui';
import { useEffect, useState } from 'react';

export default function SubscriptionPage() {
  const { tiers, selectedTier, isLoadingTiers, createCheckoutSession } =
    useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const { setSuccessMessage, setErrorMessage } = useBillingContext();
  const analytics = useAnalyticsWithTenant();

  // Track billing page views and pricing tiers
  useEffect(() => {
    analytics.track('billing_subscription_page_viewed', {
      currentPlan: selectedTier?.name || null,
      currentPlanPrice: selectedTier?.price || null,
      availablePlans: tiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        isPopular: tier.isPopular,
      })),
      eventTimestamp: Date.now(),
    });
  }, [analytics, selectedTier, tiers]);

  const handleSubscriptionChange = async (stripePriceId: string) => {
    if (isProcessing) return;

    // Find the selected tier for analytics
    const selectedPlan = tiers.find(
      (tier) => tier.stripePriceId === stripePriceId
    );

    // Track upgrade start
    analytics.track('billing_subscription_upgrade_started', {
      fromPlan: selectedTier?.name || null,
      fromPlanPrice: selectedTier?.price || null,
      toPlan: selectedPlan?.name,
      toPlanPrice: selectedPlan?.price,
      planId: selectedPlan?.id,
      stripePriceId,
      eventTimestamp: Date.now(),
    });

    setIsProcessing(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      console.log(`Attempting to create checkout session for ${stripePriceId}`);
      const { url } = await createCheckoutSession(stripePriceId);
      console.log(`Received checkout URL: ${url}`);

      if (url) {
        // Track successful checkout session creation
        analytics.track('billing_checkout_session_created', {
          fromPlan: selectedTier?.name || null,
          toPlan: selectedPlan?.name,
          planId: selectedPlan?.id,
          stripePriceId,
          eventTimestamp: Date.now(),
        });

        // Redirect the user to the Stripe Checkout page
        window.location.href = url;
      } else {
        throw new Error('Checkout URL not received from the server.');
      }
    } catch (error) {
      console.error('Failed to change subscription:', error);

      // Track upgrade failure
      analytics.track('billing_subscription_upgrade_failed', {
        fromPlan: selectedTier?.name || null,
        toPlan: selectedPlan?.name,
        planId: selectedPlan?.id,
        stripePriceId,
        error: error instanceof Error ? error.message : 'Unknown error',
        eventTimestamp: Date.now(),
      });

      // Display error message to user
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          'Failed to process subscription change. Please try again later.'
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingTiers) {
    return (
      <div className="flex justify-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <ContentCard>
      <PricingComponent
        tiers={tiers}
        selectedTier={selectedTier}
        isProcessing={isProcessing}
        onSelectTier={handleSubscriptionChange}
      />
    </ContentCard>
  );
}
