'use client';

import { PromptType } from '@/domain/entities';
import React from 'react';
import { NumberInput } from '../atoms/NumberInput';
import { TextInput } from '../atoms/TextInput';
import { TextArea } from '../atoms/TextArea';
import { ValidationMessage } from '../atoms/ValidationMessage';

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
          (placeholder && placeholder.length > 50) || // Long placeholder suggests longer input
          String(value).length > 100 || // Current value is long
          (placeholder &&
            (placeholder.toLowerCase().includes('describe') ||
              placeholder.toLowerCase().includes('explain') ||
              placeholder.toLowerCase().includes('detail') ||
              placeholder.toLowerCase().includes('tell us about'))); // Placeholder suggests longer response

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
