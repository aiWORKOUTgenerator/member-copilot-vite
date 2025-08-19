import { AppConfiguration } from '@/domain/entities/appConfiguration';

/**
 * Configuration state interface
 */
export interface ConfigurationState {
  /** The app configuration data */
  configuration: AppConfiguration | null;
  /** Whether configuration is currently being loaded */
  isLoading: boolean;
  /** Whether configuration has been loaded successfully at least once */
  isLoaded: boolean;
  /** Error message if configuration loading failed */
  error: string | null;
  /** Function to refetch configuration */
  refetch: () => Promise<void>;
}

/**
 * Configuration context
 */
export {};
