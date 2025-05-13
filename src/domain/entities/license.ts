/**
 * License system entities
 */

import { MeteredFeature } from "./meteredFeatures";

/**
 * License policy represents a template defining access and limits
 */
export interface LicensePolicy {
  uuid: string;
  name: string;
  features: Record<string, boolean>; // e.g. {"generator": true, "ai_assistant": false}
  usage_limits: Record<MeteredFeature, number>; // e.g. {MeteredFeature.WORKOUTS_GENERATED: 5}
  stripe_price_id: string | null;
  is_public: boolean;
}

/**
 * License status enum
 */
export enum LicenseStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
}

/**
 * License source type enum
 */
export enum LicenseSourceType {
  STRIPE = "stripe",
  MANUAL = "manual",
  IMPORT = "import",
}

/**
 * License assigned to a Contact, defines real-time access and usage control
 */
export interface License {
  uuid: string;
  contact_id: string;
  license_policy_id: string;
  status: LicenseStatus;
  source_type: LicenseSourceType;
  source_reference: string; // e.g. subscription ID, membership ID
  valid_from: Date;
  valid_to: Date;
  policy?: LicensePolicy; // Optional resolved policy
}
