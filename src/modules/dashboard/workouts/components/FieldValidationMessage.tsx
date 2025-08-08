import React from 'react';
import { ValidationMessage } from '@/ui/shared/atoms/ValidationMessage';
import { WorkoutCustomizationProps } from './types';

interface FieldValidationMessageProps {
  /** The field key to validate */
  field: keyof WorkoutCustomizationProps['options'];
  /** Function to get validation error for a field */
  getFieldValidationError: (
    fieldKey: keyof WorkoutCustomizationProps['options']
  ) => string | undefined;
  /** Optional custom className for the container */
  className?: string;
}

/**
 * Reusable component for displaying field validation messages
 * Eliminates code duplication across multiple fields in WorkoutCustomization
 */
export const FieldValidationMessage: React.FC<FieldValidationMessageProps> = ({
  field,
  getFieldValidationError,
  className = 'mb-4',
}) => {
  const errorMessage = getFieldValidationError(field);
  const isValid = !errorMessage;

  return (
    <div className={className}>
      <ValidationMessage message={errorMessage} isValid={isValid} />
    </div>
  );
};
