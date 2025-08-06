// Define the structure for a Stripe Plan object nested within SubscriptionItem
export interface StripePlan {
  id: string;
  object: 'plan';
  active: boolean;
  amount: number | null;
  amount_decimal: string | null;
  billing_scheme: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  discounts: unknown[] | null; // Consider defining a specific Discount type if needed
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  livemode: boolean;
  metadata: Record<string, string>;
  nickname: string | null;
  product: string; // Product ID
  tiers_mode: 'graduated' | 'volume' | null;
  transform_usage: {
    divide_by: number;
    round: 'up' | 'down';
  } | null;
  trial_period_days: number | null;
  usage_type: 'licensed' | 'metered';
}

// Define the structure for a Stripe Price object nested within SubscriptionItem
export interface StripePrice {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  custom_unit_amount: {
    maximum: number | null;
    minimum: number | null;
    preset: number | null;
  } | null;
  livemode: boolean;
  lookup_key: string | null;
  metadata: Record<string, string>;
  nickname: string | null;
  product: string; // Product ID
  recurring: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
    trial_period_days: number | null;
    usage_type: 'licensed' | 'metered';
  } | null;
  tax_behavior: 'unspecified' | 'exclusive' | 'inclusive';
  tiers_mode: 'graduated' | 'volume' | null;
  transform_quantity: {
    divide_by: number;
    round: 'up' | 'down';
  } | null;
  type: 'one_time' | 'recurring';
  unit_amount: number | null;
  unit_amount_decimal: string | null;
}

// Define the structure for a Stripe Subscription Item
export interface StripeSubscriptionItem {
  id: string;
  object: 'subscription_item';
  created: number;
  current_period_end: number; // Renamed from stripe example for clarity
  current_period_start: number; // Renamed from stripe example for clarity
  metadata: Record<string, string>;
  plan: StripePlan;
  price: StripePrice;
  quantity: number;
  subscription: string; // Subscription ID
  tax_rates: unknown[] | null; // Consider defining a specific TaxRate type if needed
}

// Define the main Stripe Subscription structure
export interface StripeSubscription {
  id: string;
  object: 'subscription';
  application: string | null;
  application_fee_percent: number | null;
  automatic_tax: {
    enabled: boolean;
    liability: unknown | null; // Define specific type if known
  };
  billing_cycle_anchor: number;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  cancellation_details: {
    comment: string | null;
    feedback: string | null; // Define specific values if known (e.g., "customer_service", "low_quality")
    reason: string | null; // Define specific reasons if known (e.g., "too_expensive")
  };
  collection_method: 'charge_automatically' | 'send_invoice';
  created: number;
  currency: string;
  customer: string; // Customer ID
  days_until_due: number | null;
  default_payment_method: string | null; // PaymentMethod ID
  default_source: string | null; // Source ID
  default_tax_rates: unknown[] | null; // Consider defining a specific TaxRate type
  description: string | null;
  discounts: unknown[] | null; // Define specific Discount type if needed
  ended_at: number | null;
  invoice_settings: {
    issuer: {
      type: 'self' | 'customer';
    };
  };
  items: {
    object: 'list';
    data: StripeSubscriptionItem[];
    has_more: boolean;
    total_count: number;
    url: string;
  };
  latest_invoice: string | null; // Invoice ID
  livemode: boolean;
  metadata: Record<string, string>;
  next_pending_invoice_item_invoice: number | null;
  on_behalf_of: string | null; // Account ID
  pause_collection: {
    behavior: 'keep_as_draft' | 'mark_uncollectible' | 'void';
    resumes_at: number | null;
  } | null;
  payment_settings: {
    payment_method_options: unknown | null; // Define specific type if known
    payment_method_types: ('card' | 'ach_debit' | string)[] | null; // Add other known types
    save_default_payment_method: 'on' | 'off';
  };
  pending_invoice_item_interval: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
  } | null;
  pending_setup_intent: string | null; // SetupIntent ID
  pending_update: {
    expires_at: number;
    subscription_items: StripeSubscriptionItem[];
    trial_end: number | null;
    trial_from_plan: boolean | null;
  } | null;
  schedule: string | null; // Schedule ID
  start_date: number;
  status:
    | 'active'
    | 'past_due'
    | 'unpaid'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'paused';
  test_clock: string | null; // TestClock ID
  transfer_data: {
    amount_percent: number | null;
    destination: string; // Account ID
  } | null;
  trial_end: number | null;
  trial_settings: {
    end_behavior: {
      missing_payment_method: 'create_invoice' | 'pause' | 'cancel';
    };
  };
  trial_start: number | null;
}
