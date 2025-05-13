"use client";

import { Attribute } from "@/domain/entities/attribute";
import { useAttributeService } from "@/hooks";
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
 * AttributeState interface defines the shape of our attribute context value.
 */
export interface AttributeState {
  attributes: Attribute[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isLoaded: boolean;
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useAttributes hook which performs a null check.
 */
const AttributeContext = createContext<AttributeState | undefined>(undefined);

interface AttributeProviderProps {
  children: ReactNode;
}

/**
 * AttributeProvider component that makes attribute data available to all child components.
 * It fetches attribute data on mount and provides methods to refetch.
 */
export function AttributeProvider({ children }: AttributeProviderProps) {
  const attributeService = useAttributeService();
  const { isSignedIn } = useAuth();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttributes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await attributeService.getAllAttributes();
      setAttributes(data);
      setIsLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch attributes"
      );
      console.error("Error fetching attributes:", err);
    } finally {
      setIsLoading(false);
    }
  }, [attributeService]);

  // Fetch attribute data when the component mounts
  useEffect(() => {
    console.log("isSignedIn", isSignedIn);
    if (isSignedIn) {
      fetchAttributes();
    } else {
      setAttributes([]);
      setIsLoaded(false);
    }
  }, [isSignedIn, fetchAttributes]);

  // Memoized context value
  const contextValue: AttributeState = {
    attributes,
    isLoading,
    error,
    refetch: fetchAttributes,
    isLoaded,
  };

  return (
    <AttributeContext.Provider value={contextValue}>
      {children}
    </AttributeContext.Provider>
  );
}

/**
 * Custom hook to access the attribute data from the AttributeContext.
 * Throws an error if used outside of an AttributeProvider.
 */
export function useAttributes(): AttributeState {
  const context = useContext(AttributeContext);

  if (context === undefined) {
    throw new Error("useAttributes must be used within an AttributeProvider");
  }

  return context;
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
