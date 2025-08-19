import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AttributeType } from '@/domain/entities/attributeType';
import { AttributeTypeState } from '@/contexts/attribute-type.types';
import { useAttributeTypeService } from '@/hooks';
import { useAuth } from '@/hooks/auth';

/**
 * Hook to access attribute types using React Query
 */
export function useAttributeTypes(): AttributeTypeState {
  const attributeTypeService = useAttributeTypeService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<AttributeType[], unknown>({
    queryKey: ['attributeTypes'],
    queryFn: async () => {
      const data = await attributeTypeService.getAllAttributeTypes();
      // Sort attribute types by display_order to preserve existing behavior
      return [...data].sort((a, b) => a.display_order - b.display_order);
    },
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['attributeTypes'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  return {
    attributeTypes: query.data ?? [],
    isLoading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch,
    isLoaded: query.isFetched,
  };
}

/**
 * Convenience hook to get just the attribute types array
 */
export function useAttributeTypesData(): AttributeType[] {
  const { attributeTypes } = useAttributeTypes();
  return attributeTypes;
}

/**
 * Hook to get a specific attribute type by ID
 */
export function useAttributeType(id: string): AttributeType | undefined {
  const { attributeTypes } = useAttributeTypes();
  return attributeTypes.find((type) => type.id === id);
}

/**
 * Convenience hook to check if the attribute types are loading
 */
export function useAttributeTypesLoading(): boolean {
  const { isLoading } = useAttributeTypes();
  return isLoading;
}

/**
 * Convenience hook to check if the attribute types are loaded
 */
export function useAttributeTypesLoaded(): boolean {
  const { isLoaded } = useAttributeTypes();
  return isLoaded;
}

/**
 * Convenience hook to get any attribute types loading error
 */
export function useAttributeTypesError(): string | null {
  const { error } = useAttributeTypes();
  return error;
}
