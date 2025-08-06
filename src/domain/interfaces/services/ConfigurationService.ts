import { AppConfiguration } from '@/domain/entities/appConfiguration';

/**
 * Service interface for handling application configuration
 */
export interface ConfigurationService {
  /**
   * Fetch configuration for the current domain
   * @param domain - The current domain (e.g., golds.fitcopilot.ai)
   * @returns Promise that resolves to the app configuration
   */
  getConfiguration(domain: string): Promise<AppConfiguration>;
}
