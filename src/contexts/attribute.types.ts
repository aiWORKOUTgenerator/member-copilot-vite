import { Attribute } from "@/domain/entities/attribute";
import { createContext } from "react";

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
export const AttributeContext = createContext<AttributeState | undefined>(
  undefined,
);
