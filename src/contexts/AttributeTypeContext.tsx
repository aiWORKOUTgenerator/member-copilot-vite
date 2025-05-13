"use client";

import { AttributeType } from "@/domain/entities/attributeType";
import { useAttributeTypeService } from "@/hooks";
import { useAuth } from "@/hooks/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * AttributeTypeState interface defines the shape of our attribute type context value.
 */
export interface AttributeTypeState {
  attributeTypes: AttributeType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isLoaded: boolean;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useAttributeTypes hook which performs a null check.
 */
const AttributeTypeContext = createContext<AttributeTypeState | undefined>(
  undefined
);

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
      setAttributeTypes(data);
      setIsLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch attribute types"
      );
      console.error("Error fetching attribute types:", err);
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

/**
 * Custom hook to access the attribute type data from the AttributeTypeContext.
 * Throws an error if used outside of an AttributeTypeProvider.
 */
export function useAttributeTypes(): AttributeTypeState {
  const context = useContext(AttributeTypeContext);

  if (context === undefined) {
    throw new Error(
      "useAttributeTypes must be used within an AttributeTypeProvider"
    );
  }

  return context;
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
