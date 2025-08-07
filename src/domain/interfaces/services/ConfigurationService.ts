import { AppConfiguration } from '@/domain/entities/appConfiguration';

/**
 * Service interface for handling application configuration
 */
export interface ConfigurationService {
  /**
   * Fetch configuration for the current domain
   * @param domain - The current domain with schema and port (e.g., https://golds.fitcopilot.ai:3000)
   * @returns Promise that resolves to the app configuration
   */
  getConfiguration(domain: string): Promise<AppConfiguration>;
}
