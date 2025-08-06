import { useContext } from "react";
import { AttributeType } from "@/domain/entities/attributeType";
import {
  AttributeTypeContext,
  AttributeTypeState,
} from "@/contexts/attribute-type.types";

/**
 * Custom hook to access the attribute type data from the AttributeTypeContext.
 * Throws an error if used outside of an AttributeTypeProvider.
 */
export function useAttributeTypes(): AttributeTypeState {
  const context = useContext(AttributeTypeContext);

  if (context === undefined) {
    throw new Error(
      "useAttributeTypes must be used within an AttributeTypeProvider",
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
