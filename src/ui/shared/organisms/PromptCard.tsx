'use client';

import React, { useState, useEffect } from 'react';
import { Prompt, PromptType } from '@/domain/entities';
import { PromptHeader } from '../molecules/PromptHeader';
import { InputField } from '../molecules/InputField';
import { ChoiceGroup } from '../molecules/ChoiceGroup';
import { ViewMode } from '@/contexts/ViewModeContext';

interface PromptCardProps {
  prompt: Prompt;
  value: string | string[] | number;
  onChange: (value: string | string[] | number) => void;
  validationMessage?: string;
  isValid?: boolean;
  viewMode?: ViewMode;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  value,
  onChange,
  validationMessage,
  isValid = true,
  viewMode = 'detailed',
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Convert value to array of selected IDs if choices type
  useEffect(() => {
    if (prompt.type === PromptType.LIST) {
      if (Array.isArray(value)) {
        setSelectedValues(value);
      } else if (value) {
        setSelectedValues([String(value)]);
      } else {
        setSelectedValues([]);
      }
    }
  }, [prompt.type, value]);

  const handleChoiceChange = (newValues: string[]) => {
    setSelectedValues(newValues);
    onChange(prompt.allowMultiple ? newValues : newValues[0] || '');
  };

  const handleInputChange = (newValue: string) => {
    if (prompt.type === PromptType.NUMBER) {
      // Handle empty string case for number inputs
      onChange(newValue === '' ? '' : Number(newValue));
    } else {
      onChange(newValue);
    }
  };

  // Check if prompt requires a value
  const isRequired = prompt.validationRules?.required === true;

  // Extract min and max from validation rules, ensuring they are numbers or undefined
  const minValue =
    typeof prompt.validationRules?.min === 'number'
      ? (prompt.validationRules.min as number)
      : undefined;

  const maxValue =
    typeof prompt.validationRules?.max === 'number'
      ? (prompt.validationRules.max as number)
      : undefined;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 w-full">
      <div className="card-body">
        <PromptHeader
          text={prompt.text}
          hintText={prompt.hintText}
          popupText={prompt.popupText}
          popupLinkText={prompt.popupLinkText}
          isRequired={isRequired}
          htmlFor={`prompt-${prompt.id}`}
        />

        {prompt.type === PromptType.LIST ? (
          <ChoiceGroup
            id={`prompt-${prompt.id}`}
            name={`prompt-${prompt.id}`}
            choices={prompt.choices}
            allowMultiple={prompt.allowMultiple}
            selectedValues={selectedValues}
            onChange={handleChoiceChange}
            otherChoiceEnabled={prompt.otherChoiceEnabled}
            otherChoiceText={prompt.otherChoiceText}
            isValid={isValid}
            validationMessage={validationMessage}
            viewMode={viewMode}
          />
        ) : (
          <InputField
            id={`prompt-${prompt.id}`}
            type={prompt.type}
            value={Array.isArray(value) ? '' : value}
            onChange={handleInputChange}
            isValid={isValid}
            validationMessage={validationMessage}
            min={minValue}
            max={maxValue}
          />
        )}
      </div>
    </div>
  );
};
