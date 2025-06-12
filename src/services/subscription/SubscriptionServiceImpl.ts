import { StripeSubscription } from "@/domain/entities/StripeSubscription";
import { SubscriptionTier } from "@/domain/entities/subscriptionTier";
import { ApiService } from "@/domain/interfaces/api/ApiService";
import {
  PortalConfiguration,
  SubscriptionService,
} from "@/domain/interfaces/services/SubscriptionService";

// Static data for subscription tiers (will be replaced with API call later)
const MOCK_SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "free",
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_BASIC,
    name: "Free",
    description: "Perfect for individuals getting started",
    features: [
      "5 free workouts per month",
      "Custom AI workouts",
      "5 saved workouts",
    ],
    price: "$0.00",
  },
  {
    id: "premium",
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_PREMIUM,
    name: "Premium",
    description: "Ideal for serious fitness enthusiasts",
    features: [
      "50% off",
      "100 workouts per month",
      "Unlimited saved workouts",
      "Priority support",
    ],
    price: "$10.00 (50% off)",
    isPopular: true,
  },
];

/**
 * SubscriptionService implementation
 * Handles all subscription-related operations
 */
export class SubscriptionServiceImpl implements SubscriptionService {
  readonly serviceName = "SubscriptionService";
  private readonly apiService: ApiService;
  private readonly baseEndpoint = "/members";

  /**
   * Creates a new instance of SubscriptionServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Get all subscription tiers
   * @returns Promise that resolves to an array of SubscriptionTier objects
   */
  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1));
      return MOCK_SUBSCRIPTION_TIERS;
    } catch (error) {
      console.error("Error in getSubscriptionTiers:", error);
      throw new Error("Failed to fetch subscription tiers");
    }
  }

  /**
   * Get the current user's Stripe subscription object
   * @returns Promise that resolves to an object containing the subscription or null
   */
  async getCurrentUserSubscription(): Promise<{
    subscription: StripeSubscription | null;
  }> {
    try {
      console.log("Fetching current user subscription");
      // Assuming the endpoint is /api/members/subscription/
      const response = await this.apiService.get<{
        subscription: StripeSubscription | null;
      }>(`${this.baseEndpoint}/subscription/`);
      console.log("Fetched subscription:", response);
      return response;
    } catch (error) {
      console.error("Error in getCurrentUserSubscription:", error);
      // Handle potential errors, e.g., 404 if no subscription found might be expected
      // Depending on API behavior, might want to return { subscription: null } instead of throwing
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Failed to fetch current user subscription");
      }
    }
  }

  /**
   * Create a Stripe checkout session and return its URL
   * @param stripePriceId The Stripe price ID of the subscription tier to checkout
   * @returns Promise that resolves to an object containing the checkout URL
   */
  async createCheckoutSession(stripePriceId: string): Promise<{ url: string }> {
    console.log("createCheckoutSession for redirect", stripePriceId);
    try {
      // Assuming the backend endpoint now returns { checkoutUrl: "..." }
      return await this.apiService.post<{ url: string }, { price_id: string }>(
        `${this.baseEndpoint}/create-checkout-session/`,
        {
          price_id: stripePriceId,
        }
      );
    } catch (error) {
      console.error(
        `Error in createCheckoutSession for price ${stripePriceId}:`,
        error
      );
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Failed to create checkout session");
      }
    }
  }

  /**
   * Create a Stripe Customer Portal session
   * @param portalConfiguration The specific portal view to request
   * @param returnPath Optional path to return to after portal session
   * @returns Promise that resolves to an object containing the portal URL
   */
  async createCustomerPortalSession(
    portalConfiguration: PortalConfiguration,
    returnPath?: string
  ): Promise<{ url: string }> {
    console.log(
      `createCustomerPortalSession called, config: ${portalConfiguration}, returnPath: ${returnPath}`
    );
    try {
      const payload: {
        portal_configuration: PortalConfiguration;
        return_path?: string;
      } = {
        portal_configuration: portalConfiguration,
      };
      if (returnPath) {
        payload.return_path = returnPath;
      }

      return await this.apiService.post<{ url: string }, typeof payload>(
        `${this.baseEndpoint}/create-portal-session/`,
        payload
      );
    } catch (error) {
      console.error(
        `Error in createCustomerPortalSession (config: ${portalConfiguration}):`,
        error
      );
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Failed to create customer portal session");
      }
    }
  }
}
