"use client";

import { StripeSubscription } from "@/domain/entities/StripeSubscription";
import { PortalConfiguration } from "@/domain/interfaces/services/SubscriptionService";
import { useAuth } from "@/hooks/auth";
import { useSubscriptionService } from "@/hooks/useSubscriptionService";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { SubscriptionContext, SubscriptionTier } from "./subscription.types";

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const subscriptionService = useSubscriptionService();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(
    null,
  );
  const [isLoadingTiers, setIsLoadingTiers] = useState<boolean>(true);
  const [currentUserSubscription, setCurrentUserSubscription] =
    useState<StripeSubscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] =
    useState<boolean>(true);
  const { isSignedIn } = useAuth();

  const fetchSubscriptionData = useCallback(async () => {
    if (!isSignedIn) {
      setTiers([]);
      setSelectedTier(null);
      setCurrentUserSubscription(null);
      setIsLoadingTiers(false);
      setIsLoadingSubscription(false);
      return;
    }

    setIsLoadingTiers(true);
    setIsLoadingSubscription(true);

    try {
      const subscriptionTiers =
        await subscriptionService.getSubscriptionTiers();
      const { subscription } =
        await subscriptionService.getCurrentUserSubscription();

      setTiers(subscriptionTiers);
      setCurrentUserSubscription(subscription);

      if (subscriptionTiers.length > 0) {
        const tier = subscriptionTiers.find(
          (tier) => tier.stripePriceId === subscription?.items.data[0].price.id,
        );
        if (tier) {
          setSelectedTier(tier);
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription data:", error);
      setTiers([]);
      setSelectedTier(null);
      setCurrentUserSubscription(null);
    } finally {
      setIsLoadingTiers(false);
      setIsLoadingSubscription(false);
    }
  }, [subscriptionService, isSignedIn]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData, isSignedIn]);

  const createCheckoutSession = async (stripePriceId: string) => {
    return await subscriptionService.createCheckoutSession(stripePriceId);
  };

  const createCustomerPortalSession = async (
    portalConfiguration: PortalConfiguration,
    returnPath?: string,
  ) => {
    return await subscriptionService.createCustomerPortalSession(
      portalConfiguration,
      returnPath,
    );
  };

  return (
    <SubscriptionContext.Provider
      value={{
        tiers,
        selectedTier,
        isLoadingTiers,
        isLoadingSubscription,
        currentUserSubscription,
        createCheckoutSession,
        createCustomerPortalSession,
        refreshSubscriptionData: fetchSubscriptionData,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
