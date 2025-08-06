import { License, LicenseStatus } from "@/domain/entities";
import type { ApiService } from "@/domain/interfaces/api/ApiService";
import type { LicenseService as ILicenseService } from "@/domain/interfaces/license/LicenseService"; // Aliasing for clarity
import { LicensePolicyService } from "./LicensePolicyService";

/**
 * Service implementation for license management and usage tracking.
 * Assumes user context is handled by the backend.
 */
export class LicenseServiceImpl implements ILicenseService {
  private readonly baseEndpoint = "/members/licenses/";

  constructor(
    private apiService: ApiService,
    private policyService: LicensePolicyService,
  ) {}

  /**
   * Get the active licenses for the current user.
   * @returns The active licenses or an empty array if none exist.
   */
  async getActiveLicenses(): Promise<License[]> {
    try {
      // Endpoint assumes backend resolves user context (e.g., via session/token)
      const licenses = await this.apiService.get<License[]>(
        `${this.baseEndpoint}`,
      );

      if (!licenses || licenses.length === 0) return [];

      return licenses;
    } catch (error) {
      console.error("Error fetching active licenses:", error);
      return []; // Return empty array on error
    }
  }

  // getContactLicenses might be deprecated or refactored if user context is always implicit
  // For now, let's assume it might still be needed for admin purposes or specific scenarios
  // If it's purely for the current user, getActiveLicenses should suffice.
  // If it's for another contact (e.g. admin view), it needs contactId
  /**
   * Get all licenses for a specific contact (e.g., for admin purposes).
   * @param contactId The contact identifier (email or ID)
   * @returns Array of licenses
   */
  async getContactLicenses(contactId: string): Promise<License[]> {
    try {
      const response = await this.apiService.get<License[]>(
        `/api/licenses/contact/${contactId}`, // This endpoint would still need contactId
      );
      return response || [];
    } catch (error) {
      console.error("Error fetching contact licenses for", contactId, error);
      return [];
    }
  }

  /**
   * Get a specific license policy by ID.
   * This method is usually called by getActiveLicenses if a policy is not embedded.
   * It's also part of the interface for direct policy fetching if needed.
   */
  async getLicensePolicy(policyId: string) {
    return this.policyService.getLicensePolicy(policyId);
  }

  /**
   * Get all available license policies.
   */
  async getLicensePolicies(includeNonPublic?: boolean) {
    // Assuming policyService handles the includeNonPublic flag
    return this.policyService.getLicensePolicies(includeNonPublic);
  }

  /**
   * Check if the current user can access a specific feature.
   * @param feature The feature to check access for
   * @returns Whether the user can access the feature
   */
  async canAccessFeature(feature: string): Promise<boolean> {
    const activeLicenses = await this.getActiveLicenses();

    if (activeLicenses.length === 0) {
      return false;
    }

    return activeLicenses.some(
      (license) => license.policy?.features[feature] === true,
    );
  }

  /**
   * Check if the current user is within usage limits for a specific feature.
   * @param feature Feature to check limits for.
   * @param licenses Optional list of active licenses to check against. Fetches if not provided.
   * @returns Whether the user is within usage limits.
   */
  isWithinUsageLimit(feature: string, licenses?: License[]): boolean {
    const licensesToCheck = licenses || []; // In a real scenario, you might fetch if not provided
    // but the interface implies it can be synchronous if licenses are passed.
    // For now, we'll rely on passed licenses or an empty array.

    if (licensesToCheck.length === 0) return true; // Or false, depending on desired behavior for no licenses

    // Example: Sum up limits from all active licenses for the feature
    // This is a placeholder. Actual logic depends on how usage/limits are defined.
    // For instance, if a feature limit is per license, or cumulative.
    // For simplicity, let's assume if *any* license allows it and is within its *own* limit (if applicable).
    // The provided `License` entity doesn't have usage tracking fields yet.
    // So, this becomes more of a policy check similar to `canAccessFeature`
    // unless `License` or `LicensePolicy` includes usage counts/limits.

    // For now, let's assume if they can access, they are within limit, which is simplistic.
    // A more robust implementation would involve checking `license.usage[feature].count < license.policy.limits[feature]`

    return licensesToCheck.some(
      (license) =>
        license.status === LicenseStatus.ACTIVE &&
        license.policy?.features[feature] === true, // Placeholder for actual limit check
    );
  }
}
