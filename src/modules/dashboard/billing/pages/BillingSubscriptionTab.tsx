"use client";

import PricingComponent from "@/ui/shared/organisms/PricingComponent";
import { useBillingContext } from "@/hooks/useBillingContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState } from "react";

export default function SubscriptionPage() {
  const { tiers, selectedTier, isLoadingTiers, createCheckoutSession } =
    useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const { setSuccessMessage, setErrorMessage } = useBillingContext();

  const handleSubscriptionChange = async (stripePriceId: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      console.log(`Attempting to create checkout session for ${stripePriceId}`);
      const { url } = await createCheckoutSession(stripePriceId);
      console.log(`Received checkout URL: ${url}`);

      if (url) {
        // Redirect the user to the Stripe Checkout page
        window.location.href = url;
      } else {
        throw new Error("Checkout URL not received from the server.");
      }
    } catch (error) {
      console.error("Failed to change subscription:", error);
      // Display error message to user
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Failed to process subscription change. Please try again later."
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
