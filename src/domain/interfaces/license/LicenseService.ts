import { License, LicensePolicy } from "../../entities";

/**
 * Service interface for license management and access control
 */
export interface LicenseService {
  /**
   * Get all active licenses for the current user
   * @returns All active licenses for the current user
   */
  getActiveLicenses(): Promise<License[]>;

  /**
   * Get a specific license policy by ID
   * @param policyId License policy ID
   * @returns The license policy if found
   */
  getLicensePolicy(policyId: string): Promise<LicensePolicy | null>;

  /**
   * Get all available license policies
   * @param includeNonPublic Whether to include non-public policies
   * @returns Available license policies
   */
  getLicensePolicies(includeNonPublic?: boolean): Promise<LicensePolicy[]>;

  /**
   * Check if the current user can access a specific feature
   * Based on all active licenses the user has
   * @param feature Feature to check access for
   * @returns Whether the user can access the feature
   */
  canAccessFeature(feature: string): Promise<boolean>;

  /**
   * Check if the current user is within usage limits for a specific feature
   * @param feature Feature to check limits for
   * @param licenses The active licenses to check against (optional, if not provided, service might fetch them)
   * @returns Whether the user is within usage limits
   */
  isWithinUsageLimit(feature: string, licenses?: License[]): boolean;
}
