import { License, LicensePolicy } from '@/domain';
import { MeteredFeature } from '@/domain/entities/meteredFeatures';
import { MeteredUsage } from '@/domain/entities/MeteredUsage';
import { createContext } from 'react';

export interface UserAccessContextType {
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

export const UserAccessContext =
  createContext<UserAccessContextType>(defaultContextValue);
