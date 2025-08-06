import { SubscriptionService } from '@/domain/interfaces/services/SubscriptionService';
import { SubscriptionServiceImpl } from '@/services/subscription/SubscriptionServiceImpl';
import { useMemo } from 'react';
import { useApiService } from './useApiService';

/**
 * Hook to access the SubscriptionService
 * @returns An instance of SubscriptionService
 */
export function useSubscriptionService(): SubscriptionService {
  const apiService = useApiService();

  const subscriptionService = useMemo(() => {
    console.log('useSubscriptionService', apiService);
    return new SubscriptionServiceImpl(apiService);
  }, [apiService]);

  return subscriptionService;
}
