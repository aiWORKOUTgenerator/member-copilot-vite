import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Attribute } from '@/domain/entities/attribute';
import { AttributeState } from '@/contexts/attribute.types';
import { useAttributeService } from '@/hooks';
import { useAuth } from '@/hooks/auth';

/**
 * Hook to access attributes using React Query
 */
export function useAttributes(): AttributeState {
  const attributeService = useAttributeService();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Attribute[], unknown>({
    queryKey: ['attributes'],
    queryFn: () => attributeService.getAllAttributes(),
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (isSignedIn === false) {
      queryClient.removeQueries({ queryKey: ['attributes'] });
    }
  }, [isSignedIn, queryClient]);

  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  return {
    attributes: query.data ?? [],
    isLoading: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch,
    isLoaded: query.isFetched,
  };
}

/**
 * Convenience hook to get just the attributes array
 */
export function useAttributesData(): Attribute[] {
  const { attributes } = useAttributes();
  return attributes;
}

/**
 * Hook to get a specific attribute by ID
 */
export function useAttribute(id: string): Attribute | undefined {
  const { attributes } = useAttributes();
  return attributes.find((attr) => attr.id === id);
}

/**
 * Convenience hook to check if the attributes are loading
 */
export function useAttributesLoading(): boolean {
  const { isLoading } = useAttributes();
  return isLoading;
}

/**
 * Convenience hook to check if the attributes are loaded
 */
export function useAttributesLoaded(): boolean {
  const { isLoaded } = useAttributes();
  return isLoaded;
}

/**
 * Convenience hook to get any attributes loading error
 */
export function useAttributesError(): string | null {
  const { error } = useAttributes();
  return error;
}
