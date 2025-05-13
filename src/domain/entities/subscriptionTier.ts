export interface SubscriptionTier {
  id: string;
  stripePriceId: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  isPopular?: boolean;
}
