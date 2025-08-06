import { useContext } from 'react';
import { Attribute } from '@/domain/entities/attribute';
import { AttributeContext, AttributeState } from '@/contexts/attribute.types';

/**
 * Custom hook to access the attribute data from the AttributeContext.
 * Throws an error if used outside of an AttributeProvider.
 */
export function useAttributes(): AttributeState {
  const context = useContext(AttributeContext);

  if (context === undefined) {
    throw new Error('useAttributes must be used within an AttributeProvider');
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
