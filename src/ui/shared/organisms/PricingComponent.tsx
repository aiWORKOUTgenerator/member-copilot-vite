"use client";

import { SubscriptionTier } from "@/domain/entities/subscriptionTier";

interface PricingComponentProps {
  tiers: SubscriptionTier[];
  selectedTier: SubscriptionTier | null;
  isProcessing: boolean;
  onSelectTier: (tierId: string) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingComponent({
  tiers,
  selectedTier,
  isProcessing,
  onSelectTier,
}: PricingComponentProps) {
  // Helper function to format tier for display
  const formatTierForDisplay = (tier: SubscriptionTier) => {
    return {
      name: tier.name,
      id: tier.id,
      stripePriceId: tier.stripePriceId,
      price: tier.price,
      description: tier.description,
      features: tier.features,
      featured: tier.isPopular || false,
      cta: selectedTier?.id === tier.id ? "Current Plan" : "Switch Plan",
    };
  };

  // Format our subscription tiers to match the component's expected format
  const formattedTiers = tiers.map(formatTierForDisplay);

  return (
    <div className="py-2 sm:py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-4 sm:gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {formattedTiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? "bg-primary ring-primary" : "ring-base-300",
                "rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 ring-1",
              )}
            >
              <h3
                id={tier.id}
                className={classNames(
                  tier.featured ? "text-primary-content" : "text-base-content",
                  "text-base sm:text-lg font-semibold",
                )}
              >
                {tier.name}
              </h3>
              <p
                className={classNames(
                  tier.featured
                    ? "text-primary-content/80"
                    : "text-base-content/70",
                  "mt-2 sm:mt-4 text-xs sm:text-sm",
                )}
              >
                {tier.description}
              </p>
              <p className="mt-4 sm:mt-6 flex items-baseline gap-x-1">
                <span
                  className={classNames(
                    tier.featured
                      ? "text-primary-content"
                      : "text-base-content",
                    "text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight",
                  )}
                >
                  {tier.price}
                </span>
                <span
                  className={classNames(
                    tier.featured
                      ? "text-primary-content/80"
                      : "text-base-content/70",
                    "text-xs sm:text-sm font-semibold",
                  )}
                >
                  /month
                </span>
              </p>
              <button
                onClick={() => onSelectTier(tier.stripePriceId)}
                disabled={selectedTier?.id === tier.id || isProcessing}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? "btn btn-secondary text-secondary-content"
                    : "btn btn-primary",
                  "mt-4 sm:mt-6 w-full text-sm sm:text-base",
                  selectedTier?.id === tier.id || isProcessing
                    ? "btn-disabled"
                    : "",
                )}
              >
                {selectedTier?.id === tier.id
                  ? "Current Plan"
                  : isProcessing
                    ? "Processing..."
                    : tier.cta}
              </button>
              <ul
                role="list"
                className={classNames(
                  tier.featured
                    ? "text-primary-content/80"
                    : "text-base-content/70",
                  "mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-xs sm:text-sm",
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-2 sm:gap-x-3">
                    <svg
                      className={classNames(
                        tier.featured ? "text-primary-content" : "text-primary",
                        "h-4 w-4 sm:h-5 sm:w-6 flex-none",
                      )}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
