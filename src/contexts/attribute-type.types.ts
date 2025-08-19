import { AttributeType } from '@/domain/entities/attributeType';

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
export {};
