"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useBillingContext } from "@/hooks/useBillingContext";
import PricingComponent from "@/ui/shared/organisms/PricingComponent";
import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const { tiers, selectedTier, isLoadingTiers, createCheckoutSession } =
    useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const { setSuccessMessage, setErrorMessage } = useBillingContext();
  const analytics = useAnalytics();

  // Track billing page views
  useEffect(() => {
    analytics.track("Billing Page Viewed", {
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  const handleSubscriptionChange = async (stripePriceId: string) => {
    if (isProcessing) return;

    // Find the selected tier for analytics
    const selectedPlan = tiers.find(
      (tier) => tier.stripePriceId === stripePriceId,
    );

    // Track upgrade start
    analytics.track("Subscription Upgrade Started", {
      planId: selectedPlan?.id,
      planName: selectedPlan?.name,
      planPrice: selectedPlan?.price,
      stripePriceId,
      tracked_at: new Date().toISOString(),
    });

    setIsProcessing(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      console.log(`Attempting to create checkout session for ${stripePriceId}`);
      const { url } = await createCheckoutSession(stripePriceId);
      console.log(`Received checkout URL: ${url}`);

      if (url) {
        // Track successful checkout session creation
        analytics.track("Checkout Session Created", {
          planId: selectedPlan?.id,
          planName: selectedPlan?.name,
          stripePriceId,
          tracked_at: new Date().toISOString(),
        });

        // Redirect the user to the Stripe Checkout page
        window.location.href = url;
      } else {
        throw new Error("Checkout URL not received from the server.");
      }
    } catch (error) {
      console.error("Failed to change subscription:", error);

      // Track upgrade failure
      analytics.track("Subscription Upgrade Failed", {
        planId: selectedPlan?.id,
        planName: selectedPlan?.name,
        stripePriceId,
        error: error instanceof Error ? error.message : "Unknown error",
        tracked_at: new Date().toISOString(),
      });

      // Display error message to user
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Failed to process subscription change. Please try again later.",
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
    <PricingComponent
      tiers={tiers}
      selectedTier={selectedTier}
      isProcessing={isProcessing}
      onSelectTier={handleSubscriptionChange}
    />
  );
}
