"use client";

import { Attribute } from "@/domain/entities/attribute";
import { useAttributeService } from "@/hooks";
import { useAuth } from "@/hooks/auth";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { AttributeContext, AttributeState } from "./attribute.types";

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
