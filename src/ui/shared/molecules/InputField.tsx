'use client';

import { PromptType } from '@/domain/entities';
import React from 'react';
import { NumberInput } from '../atoms/NumberInput';
import { TextInput } from '../atoms/TextInput';
import { TextArea } from '../atoms/TextArea';
import { ValidationMessage } from '../atoms/ValidationMessage';

// Constants for textarea decision logic
const PLACEHOLDER_LENGTH_THRESHOLD = 50;
const VALUE_LENGTH_THRESHOLD = 100;
const LONG_ANSWER_KEYWORDS = ['describe', 'explain', 'detail', 'tell us about'];

interface InputFieldProps {
  id: string;
  type: PromptType;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  validationMessage?: string;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  value,
  onChange,
  placeholder,
  isValid = true,
  validationMessage,
  disabled = false,
  min,
  max,
}) => {
  const renderInput = () => {
    switch (type) {
      case PromptType.TEXT: {
        // Use textarea for longer text or hints that suggest longer content
        const useTextArea =
          (placeholder && placeholder.length > PLACEHOLDER_LENGTH_THRESHOLD) || // Long placeholder suggests longer input
          String(value).length > VALUE_LENGTH_THRESHOLD || // Current value is long
          (placeholder &&
            LONG_ANSWER_KEYWORDS.some((keyword) =>
              placeholder.toLowerCase().includes(keyword.toLowerCase())
            )); // Placeholder suggests longer response

        return useTextArea ? (
          <TextArea
            id={id}
            value={String(value)}
            onChange={onChange}
            placeholder={placeholder}
            isValid={isValid}
            disabled={disabled}
            rows={3}
            maxLength={500}
          />
        ) : (
          <TextInput
            id={id}
            value={String(value)}
            onChange={onChange}
            placeholder={placeholder}
            isValid={isValid}
            disabled={disabled}
          />
        );
      }
      case PromptType.NUMBER:
        return (
          <NumberInput
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isValid={isValid}
            disabled={disabled}
            min={typeof min === 'number' ? min : undefined}
            max={typeof max === 'number' ? max : undefined}
          />
        );

      default:
        return (
          <TextInput
            id={id}
            value={String(value)}
            onChange={onChange}
            placeholder={placeholder}
            isValid={isValid}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {renderInput()}
      <ValidationMessage message={validationMessage} isValid={isValid} />
    </div>
  );
};
