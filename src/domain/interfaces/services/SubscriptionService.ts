import { StripeSubscription } from "@/domain/entities/StripeSubscription";
import { SubscriptionTier } from "@/domain/entities/subscriptionTier";

// Define portal configuration types
export type PortalConfiguration =
  | "manage_payment_methods"
  | "view_invoice_history"
  | "cancel_subscription"; // Add more as needed

export interface SubscriptionService {
  getSubscriptionTiers(): Promise<SubscriptionTier[]>;
  getCurrentUserSubscription(): Promise<{
    subscription: StripeSubscription | null;
  }>;
  createCheckoutSession(stripePriceId: string): Promise<{ url: string }>;
  createCustomerPortalSession(
    portalConfiguration: PortalConfiguration,
    returnPath?: string,
  ): Promise<{ url: string }>;
}
