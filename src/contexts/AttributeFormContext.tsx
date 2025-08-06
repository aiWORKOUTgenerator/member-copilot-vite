'use client';

import { ReactNode, useState, useCallback } from 'react';
import { Contact } from '@/domain/entities/contact';
import { Prompt } from '@/domain';
import {
  AttributeFormContext,
  AttributeFormContextType,
  AttributeFormValues,
} from './attribute-form.types';

// Props for the provider component
interface AttributeFormProviderProps {
  children: ReactNode;
}

/**
 * Provider component for managing attribute form state
 */
export function AttributeFormProvider({
  children,
}: AttributeFormProviderProps) {
  // State for form values and validation
  const [formValues, setFormValues] = useState<AttributeFormValues>({});
  const [initialValues, setInitialValues] = useState<AttributeFormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update a single form value
  const updateFormValue = useCallback(
    (key: string, value: string | number | string[] | null) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [key]: value,
      }));

      // Clear any error for this field when it's updated
      if (errors[key]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Initialize form values from a contact or empty values
  const initFormValues = useCallback(
    (contact?: Contact | null, prompts?: Prompt[]) => {
      const initialData: AttributeFormValues = {};

      console.log('prompts', prompts);

      // If prompts are available, create entries for each prompt
      if (prompts) {
        prompts.forEach((prompt) => {
          if (prompt.id) {
            console.log('prompt', prompt);
            // Default to empty/null value
            let value: string | number | string[] | null = null;

            // If contact exists, try to find matching attribute value by variableName
            if (contact?.attributes && prompt.variableName) {
              console.log('contact', contact);
              Object.entries(contact.attributes).forEach(([key, attrValue]) => {
                console.log('key', key);
                console.log('attrValue', attrValue);
                console.log('prompt.variableName', prompt.variableName);
                if (key === prompt.variableName) {
                  value = attrValue as string | number | string[] | null;
                }
              });
            }

            // Add entry to initialData for this prompt
            initialData[prompt.id] = value;
          }
        });
      }

      setInitialValues(initialData);
      setFormValues(initialData);
      setErrors({});
    },
    []
  );

  // Check if form has been modified from initial values
  const isFormDirty = Object.keys(formValues).some(
    (key) => formValues[key] !== initialValues[key]
  );

  // Form is valid if there are no errors
  const isValid = Object.keys(errors).length === 0;

  const contextValue: AttributeFormContextType = {
    formValues,
    updateFormValue,
    resetForm,
    initFormValues,
    isFormDirty,
    isValid,
    errors,
  };

  return (
    <AttributeFormContext.Provider value={contextValue}>
      {children}
    </AttributeFormContext.Provider>
  );
}
