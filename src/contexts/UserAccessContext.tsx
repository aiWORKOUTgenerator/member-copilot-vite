"use client";

import { License, LicensePolicy } from "@/domain";
import { MeteredFeature } from "@/domain/entities/meteredFeatures";
import { MeteredUsage } from "@/domain/entities/MeteredUsage";
import { useAuth } from "@/hooks/auth";
import { useLicenseService } from "@/hooks/useLicenseService";
import { useMeteredUsageService } from "@/hooks/useMeteredUsageService";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface UserAccessContextType {
  activeLicenses: License[];
  licensePolicies: LicensePolicy[];
  meteredUsage: MeteredUsage[];
  isLoading: boolean; // Combined loading state
  canAccessFeature: (feature: string) => boolean;
  isMeterLimitReached: (meterId: MeteredFeature) => boolean;
  getTotalAggregatedValueForMeter: (meterId: MeteredFeature) => number;
  getUsageForMeter: (meterId: MeteredFeature) => MeteredUsage | undefined;
  getHighestLimitForMeter: (meterId: MeteredFeature) => number;
  refreshAccessData: () => Promise<void>; // Combined refresh
  isLoaded: boolean;
}

const defaultContextValue: UserAccessContextType = {
  activeLicenses: [],
  licensePolicies: [],
  meteredUsage: [],
  isLoading: true,
  canAccessFeature: () => false,
  isMeterLimitReached: () => true, // Default to true (restricted) while loading or if no data
  getTotalAggregatedValueForMeter: () => 0,
  getUsageForMeter: () => undefined,
  getHighestLimitForMeter: () => 0,
  refreshAccessData: async () => {},
  isLoaded: false,
};

const UserAccessContext =
  createContext<UserAccessContextType>(defaultContextValue);

export const useUserAccessContext = () => useContext(UserAccessContext);

interface UserAccessProviderProps {
  children: ReactNode;
}

export const UserAccessProvider: React.FC<UserAccessProviderProps> = ({
  children,
}) => {
  const [activeLicenses, setActiveLicenses] = useState<License[]>([]);
  const [licensePolicies, setLicensePolicies] = useState<LicensePolicy[]>([]);
  const [meteredUsage, setMeteredUsage] = useState<MeteredUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const licenseService = useLicenseService();
  const meteredUsageService = useMeteredUsageService();
  const { isSignedIn } = useAuth();

  const loadAccessData = useCallback(async () => {
    if (!isSignedIn) {
      setActiveLicenses([]);
      setLicensePolicies([]);
      setMeteredUsage([]);
      setIsLoading(false);
      setIsLoaded(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch license and metered usage data in parallel
      const [licenses, policies, usage] = await Promise.all([
        licenseService.getActiveLicenses(),
        licenseService.getLicensePolicies(),
        meteredUsageService.getMeteredUsage(),
      ]);
      setActiveLicenses(licenses);
      setLicensePolicies(policies);
      setMeteredUsage(usage);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading user access data:", error);
      setActiveLicenses([]);
      setLicensePolicies([]);
      setMeteredUsage([]);
    } finally {
      setIsLoading(false);
    }
  }, [licenseService, meteredUsageService, isSignedIn]);

  useEffect(() => {
    loadAccessData();
  }, [loadAccessData, isSignedIn]);

  const canAccessFeature = useCallback(
    (feature: string): boolean => {
      if (isLoading || activeLicenses.length === 0) return false;
      return activeLicenses.some(
        (license) => license.policy?.features[feature] === true
      );
    },
    [activeLicenses, isLoading]
  );

  const getTotalAggregatedValueForMeter = useCallback(
    (meterId: MeteredFeature): number => {
      return meteredUsage
        .filter((usage) => usage.meter === meterId)
        .reduce((total, item) => total + item.aggregated_value, 0);
    },
    [meteredUsage]
  );

  const getHighestLimitForMeter = useCallback(
    (meterId: MeteredFeature): number => {
      if (isLoading || activeLicenses.length === 0) return 0;

      // Find the highest limit for this meter across all active licenses
      return activeLicenses.reduce((highestLimit, license) => {
        const licenseLimit = license.policy?.usage_limits[meterId] || 0;
        return licenseLimit > highestLimit ? licenseLimit : highestLimit;
      }, 0); // Start with 0 as the base limit
    },
    [activeLicenses, isLoading]
  );

  const isMeterLimitReached = useCallback(
    (meterId: MeteredFeature): boolean => {
      if (isLoading) return true; // Assume limit is reached while loading

      const policyLimit = getHighestLimitForMeter(meterId);

      // If no limit is found in any policy, assume unlimited (return false)
      if (policyLimit === 0) return false;

      const totalValue = getTotalAggregatedValueForMeter(meterId);
      return totalValue >= policyLimit;
    },
    [isLoading, getTotalAggregatedValueForMeter, getHighestLimitForMeter]
  );

  const getUsageForMeter = useCallback(
    (meterId: MeteredFeature): MeteredUsage | undefined => {
      return meteredUsage.find((usage) => usage.meter === meterId);
    },
    [meteredUsage]
  );

  const refreshAccessData = useCallback(async (): Promise<void> => {
    await loadAccessData();
  }, [loadAccessData]);

  const value: UserAccessContextType = {
    activeLicenses,
    licensePolicies,
    meteredUsage,
    isLoading,
    canAccessFeature,
    isMeterLimitReached,
    getTotalAggregatedValueForMeter,
    getUsageForMeter,
    getHighestLimitForMeter,
    refreshAccessData,
    isLoaded,
  };

  return (
    <UserAccessContext.Provider value={value}>
      {children}
    </UserAccessContext.Provider>
  );
};
