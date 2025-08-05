import { MeteredUsage } from '../../entities/MeteredUsage';

export interface MeteredUsageService {
  /**
   * Get all metered usage for the current user
   * @returns All metered usage for the current user
   */
  getMeteredUsage(): Promise<MeteredUsage[]>;
}
