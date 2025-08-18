import { StripeSubscription } from '@/domain/entities/StripeSubscription';
import { PortalConfiguration } from '@/domain/interfaces/services/SubscriptionService';

export interface SubscriptionTier {
  id: string;
  stripePriceId: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  isPopular?: boolean;
}

export interface SubscriptionContextType {
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

export {};
