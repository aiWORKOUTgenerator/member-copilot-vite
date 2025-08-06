import { MeteredUsage } from '@/domain/entities/MeteredUsage';
import type { ApiService } from '@/domain/interfaces/api/ApiService';
import type { MeteredUsageService as IMeteredUsageService } from '@/domain/interfaces/meteredUsage/MeteredUsageService';

export class MeteredUsageServiceImpl implements IMeteredUsageService {
  // Update to use relative path without trailing slash
  private readonly baseEndpoint = '/members/meter-event-summaries/';

  constructor(private apiService: ApiService) {}

  async getMeteredUsage(): Promise<MeteredUsage[]> {
    try {
      const usageData = await this.apiService.get<MeteredUsage[]>(
        `${this.baseEndpoint}`
      );
      return usageData || [];
    } catch (error) {
      console.error('Error fetching metered usage:', error);
      return []; // Return empty array on error
    }
  }
}
