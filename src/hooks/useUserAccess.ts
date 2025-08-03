import { useContext } from "react";
import { UserAccessContext } from "@/contexts/user-access.types";
import { MeteredFeature } from "@/domain/entities/meteredFeatures";

export const useUserAccessContext = () => useContext(UserAccessContext);

/**
 * Hook to access user's licenses, feature entitlements, and metered usage.
 */
export function useUserAccess() {
  const context = useUserAccessContext();

  // The context itself already provides all necessary functions and data.
  // We can re-export them directly or add specific derived selectors here if needed in the future.
  return {
    /**
     * Currently active licenses for the user.
     */
    activeLicenses: context.activeLicenses,

    /**
     * Available license policies.
     */
    licensePolicies: context.licensePolicies,

    /**
     * Metered usage data for the user.
     */
    meteredUsage: context.meteredUsage,

    /**
     * Whether user access data (licenses, policies, usage) is currently loading.
     */
    isLoading: context.isLoading,

    /**
     * Whether user access data (licenses, policies, usage) is currently loaded.
     */
    isLoaded: context.isLoaded,

    /**
     * Checks if the current user can access a specific feature based on their active licenses.
     * @param feature The feature identifier string.
     * @returns True if the user has access, false otherwise.
     */
    canAccessFeature: context.canAccessFeature,

    /**
     * Checks if the aggregated value for a given meter has reached or exceeded a specified limit.
     * @param meterId The ID of the meter to check (e.g., MeteredFeature.WORKOUTS_GENERATED).
     * @returns True if the limit is reached/exceeded or if data is loading; false otherwise.
     */
    isMeterLimitReached: context.isMeterLimitReached,

    /**
     * Gets the total aggregated usage value for a specific meter ID.
     * @param meterId The ID of the meter.
     * @returns The sum of aggregated_value for all entries of that meter.
     */
    getTotalAggregatedValueForMeter: context.getTotalAggregatedValueForMeter,

    /**
     * Gets the first metered usage object for a specific meter ID.
     * Useful if you expect only one summary per meter or need the latest/any entry.
     * @param meterId The ID of the meter.
     * @returns The metered usage object if found, otherwise undefined.
     */
    getUsageForMeter: context.getUsageForMeter,

    /**
     * Gets the highest usage limit for a specific meter ID across all active licenses.
     * @param meterId The ID of the meter.
     * @returns The highest limit value found, or 0 if no limit exists (unlimited).
     */
    getHighestLimitForMeter: context.getHighestLimitForMeter,

    /**
     * Refreshes all user access data (licenses, policies, and metered usage).
     */
    refreshAccessData: context.refreshAccessData,
  };
}

// Re-export the MeteredFeature enum for easy access
export { MeteredFeature };
