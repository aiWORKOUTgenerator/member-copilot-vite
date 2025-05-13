import { LicensePolicy } from "@/domain/entities";
import type { ApiService } from "@/domain/interfaces/api/ApiService";

/**
 * Service responsible for license policy management
 */
export class LicensePolicyService {
  private readonly baseEndpoint = "/members/license-policies";

  constructor(private apiService: ApiService) {}

  /**
   * Get all available license policies
   * @param includeNonPublic Whether to include non-public policies
   * @returns Array of license policies
   */
  async getLicensePolicies(includeNonPublic = false): Promise<LicensePolicy[]> {
    try {
      const query = includeNonPublic ? "?includeNonPublic=true" : "";
      const response = await this.apiService.get<LicensePolicy[]>(
        `${this.baseEndpoint}${query}`
      );
      return response || [];
    } catch (error) {
      console.error("Error fetching license policies:", error);
      return [];
    }
  }

  /**
   * Get a specific license policy by ID
   * @param policyId The policy ID
   * @returns The license policy or null if not found
   */
  async getLicensePolicy(policyId: string): Promise<LicensePolicy | null> {
    try {
      const response = await this.apiService.get<LicensePolicy>(
        `${this.baseEndpoint}/${policyId}`
      );
      return response;
    } catch (error) {
      console.error(`Error fetching license policy ${policyId}:`, error);
      return null;
    }
  }
}
