'use client';

import { PromptType } from '@/domain/entities';
import React from 'react';
import { NumberInput } from '../atoms/NumberInput';
import { TextInput } from '../atoms/TextInput';
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
      case PromptType.TEXT:
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
