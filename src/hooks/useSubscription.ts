import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StripeSubscription } from '@/domain/entities/StripeSubscription';
import { SubscriptionTier } from '@/domain/entities/subscriptionTier';
import { PortalConfiguration } from '@/domain/interfaces/services/SubscriptionService';
import { useSubscriptionService } from '@/hooks/useSubscriptionService';
import { useAuth } from '@/hooks/auth';

export interface UseSubscriptionResult {
  tiers: SubscriptionTier[];
  selectedTier: SubscriptionTier | null;
  isLoadingTiers: boolean;
  isLoadingSubscription: boolean;
  currentUserSubscription: StripeSubscription | null;
  createCheckoutSession: (stripePriceId: string) => Promise<{ url: string }>;
  createCustomerPortalSession: (
    portalConfiguration: PortalConfiguration,
    returnPath?: string
  ) => Promise<{ url: string }>;
  refreshSubscriptionData: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionResult => {
  const subscriptionService = useSubscriptionService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const tiersQuery = useQuery<SubscriptionTier[], unknown>({
    queryKey: ['subscription', 'tiers'],
    queryFn: () => subscriptionService.getSubscriptionTiers(),
    enabled: isSignedIn === true,
    staleTime: 60_000,
  });

  const subscriptionQuery = useQuery<
    { subscription: StripeSubscription | null },
    unknown
  >({
    queryKey: ['subscription', 'current'],
    queryFn: () => subscriptionService.getCurrentUserSubscription(),
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['subscription'] });
    }
  }, [isSignedIn, queryClient]);

  const selectedTier: SubscriptionTier | null = useMemo(() => {
    const tiers = tiersQuery.data ?? [];
    const current = subscriptionQuery.data?.subscription ?? null;
    if (!current || tiers.length === 0) return null;
    const priceId = current.items.data[0]?.price.id;
    return tiers.find((tier) => tier.stripePriceId === priceId) ?? null;
  }, [tiersQuery.data, subscriptionQuery.data]);

  const createCheckoutSession = async (
    stripePriceId: string
  ): Promise<{ url: string }> => {
    return subscriptionService.createCheckoutSession(stripePriceId);
  };

  const createCustomerPortalSession = async (
    portalConfiguration: PortalConfiguration,
    returnPath?: string
  ): Promise<{ url: string }> => {
    return subscriptionService.createCustomerPortalSession(
      portalConfiguration,
      returnPath
    );
  };

  const refreshSubscriptionData = async (): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['subscription', 'tiers'] }),
      queryClient.invalidateQueries({ queryKey: ['subscription', 'current'] }),
    ]);
  };

  return {
    tiers: tiersQuery.data ?? [],
    selectedTier,
    isLoadingTiers: tiersQuery.isFetching,
    isLoadingSubscription: subscriptionQuery.isFetching,
    currentUserSubscription: subscriptionQuery.data?.subscription ?? null,
    createCheckoutSession,
    createCustomerPortalSession,
    refreshSubscriptionData,
  };
};
