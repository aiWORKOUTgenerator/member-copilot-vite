import { AttributeService } from '@/domain/interfaces/services/AttributeService';
import { AttributeServiceImpl } from '@/services/attribute/AttributeServiceImpl';
import { useMemo } from 'react';
import { useApiService } from './useApiService';

/**
 * Hook to access the AttributeService functionality
 * @returns An instance of the AttributeService with attribute-related methods
 */
export function useAttributeService(): AttributeService {
  // Get the API service
  const apiService = useApiService();

  // Create a memoized instance of the service that persists across renders
  const attributeService = useMemo(() => {
    return new AttributeServiceImpl(apiService);
  }, [apiService]);

  return attributeService;
}
