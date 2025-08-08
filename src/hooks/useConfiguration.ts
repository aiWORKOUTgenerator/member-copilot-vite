import { useContext } from 'react';
import {
  AppConfiguration,
  AppColors,
  AppConfig,
  ColorScheme,
} from '@/domain/entities/appConfiguration';
import {
  ConfigurationContext,
  ConfigurationState,
} from '@/contexts/configuration.types';

/**
 * Custom hook to access the configuration data from the ConfigurationContext.
 * Throws an error if used outside of a ConfigurationProvider.
 */
export function useConfiguration(): ConfigurationState {
  const context = useContext(ConfigurationContext);

  if (context === undefined) {
    throw new Error(
      'useConfiguration must be used within a ConfigurationProvider'
    );
  }

  return context;
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
