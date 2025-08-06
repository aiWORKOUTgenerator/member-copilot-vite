'use client';

import { AttributeType } from '@/domain/entities/attributeType';
import { useAttributeTypeService } from '@/hooks';
import { useAuth } from '@/hooks/auth';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  AttributeTypeContext,
  AttributeTypeState,
} from './attribute-type.types';

interface AttributeTypeProviderProps {
  children: ReactNode;
}

/**
 * AttributeTypeProvider component that makes attribute type data available to all child components.
 * It fetches attribute type data on mount and provides methods to refetch.
 */
export function AttributeTypeProvider({
  children,
}: AttributeTypeProviderProps) {
  const attributeTypeService = useAttributeTypeService();
  const { isSignedIn } = useAuth();
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttributeTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await attributeTypeService.getAllAttributeTypes();
      // Sort attribute types by display_order
      data.sort((a, b) => a.display_order - b.display_order);
      setAttributeTypes(data);
      setIsLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch attribute types'
      );
      console.error('Error fetching attribute types:', err);
    } finally {
      setIsLoading(false);
    }
  }, [attributeTypeService]);

  // Fetch attribute type data when the component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchAttributeTypes();
    } else {
      setAttributeTypes([]);
      setIsLoaded(false);
    }
  }, [isSignedIn, fetchAttributeTypes]);

  // Memoized context value
  const contextValue: AttributeTypeState = {
    attributeTypes,
    isLoading,
    error,
    refetch: fetchAttributeTypes,
    isLoaded,
  };

  return (
    <AttributeTypeContext.Provider value={contextValue}>
      {children}
    </AttributeTypeContext.Provider>
  );
}
