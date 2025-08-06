import { createContext } from 'react';
import { Contact } from '@/domain/entities/contact';
import { Prompt } from '@/domain';

// Interface for attribute form values
export interface AttributeFormValues {
  [key: string]: string | number | null | string[];
}

// Interface for the context state and functions
export interface AttributeFormContextType {
  formValues: AttributeFormValues;
  updateFormValue: (
    key: string,
    value: string | number | string[] | null
  ) => void;
  resetForm: () => void;
  initFormValues: (contact?: Contact | null, prompts?: Prompt[]) => void;
  isFormDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

// Create the context with undefined default value
export const AttributeFormContext = createContext<
  AttributeFormContextType | undefined
>(undefined);
