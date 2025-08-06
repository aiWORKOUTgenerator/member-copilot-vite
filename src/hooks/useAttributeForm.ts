import { useContext } from 'react';
import {
  AttributeFormContext,
  AttributeFormContextType,
} from '@/contexts/attribute-form.types';

/**
 * Hook to access the attribute form context
 */
export function useAttributeForm(): AttributeFormContextType {
  const context = useContext(AttributeFormContext);

  if (context === undefined) {
    throw new Error(
      'useAttributeForm must be used within an AttributeFormProvider'
    );
  }

  return context;
}
