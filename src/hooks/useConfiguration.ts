import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AppConfiguration,
  AppColors,
  AppConfig,
  ColorScheme,
} from '@/domain/entities/appConfiguration';
import { ConfigurationState } from '@/contexts/configuration.types';
import { useConfigurationService } from '@/hooks/useConfigurationService';

/**
 * Hook to access app configuration using React Query
 */
export function useConfiguration(): ConfigurationState {
  const configurationService = useConfigurationService();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['configuration'],
    queryFn: async () => {
      const domain = window.location.hostname;
      return configurationService.getConfiguration(domain);
    },
    staleTime: 60_000,
  });

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  useEffect(() => {
    // Optional: clear on navigation domain change if that can happen
    return () => {
      // keep cache by default
    };
  }, [queryClient]);

  return {
    configuration: query.data ?? null,
    isLoading: query.isFetching,
    isLoaded: query.isFetched,
    error: query.error instanceof Error ? query.error.message : null,
    refetch,
  };
}

/**
 * Convenience hook to get just the configuration object
 */
export function useConfigurationData(): AppConfiguration | null {
  const { configuration } = useConfiguration();
  return configuration;
}

/**
 * Convenience hook to check if configuration is loading
 */
export function useConfigurationLoading(): boolean {
  const { isLoading } = useConfiguration();
  return isLoading;
}

/**
 * Convenience hook to check if configuration has been loaded
 */
export function useConfigurationLoaded(): boolean {
  const { isLoaded } = useConfiguration();
  return isLoaded;
}

/**
 * Convenience hook to get configuration loading error
 */
export function useConfigurationError(): string | null {
  const { error } = useConfiguration();
  return error;
}

/**
 * Hook to get the app configuration settings
 */
export function useAppConfig(): AppConfig | null {
  const configuration = useConfigurationData();
  return configuration?.appConfig || null;
}

/**
 * Hook to get the app color configuration
 */
export function useAppColors(): AppColors | null {
  const configuration = useConfigurationData();
  return configuration?.appColors || null;
}

/**
 * Hook to get the current color scheme based on theme mode
 */
export function useCurrentColorScheme(): ColorScheme | null {
  const configuration = useConfigurationData();
  return configuration?.getCurrentColorScheme() || null;
}

/**
 * Hook to check if the app is in dark mode
 */
export function useIsDarkMode(): boolean {
  const configuration = useConfigurationData();
  return configuration?.isDarkMode() || false;
}

/**
 * Hook to get the primary brand color for the current theme
 */
export function usePrimaryColor(): string {
  const configuration = useConfigurationData();
  return configuration?.getPrimaryColor() || '#FFDD00';
}

/**
 * Hook to get the tenant name
 */
export function useTenant(): string {
  const configuration = useConfigurationData();
  return configuration?.tenant || '';
}

/**
 * Hook to get the API domain
 */
export function useApiDomain(): string {
  const configuration = useConfigurationData();
  return configuration?.apiDomain || '';
}
