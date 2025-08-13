'use client';

import React, { useState } from 'react';
import { RadioChoice } from '../atoms/RadioChoice';
import { CheckboxChoice } from '../atoms/CheckboxChoice';
import { ValidationMessage } from '../atoms/ValidationMessage';
import { TextInput } from '../atoms/TextInput';
import { CheckboxCardGroup } from './CheckboxCardGroup';
import { Choice } from '@/domain/entities';
import { ViewMode } from '@/contexts/ViewModeContext';

interface ChoiceGroupProps {
  id: string;
  name: string;
  choices: Choice[];
  allowMultiple: boolean;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  otherChoiceEnabled?: boolean;
  otherChoiceText?: string;
  isValid?: boolean;
  validationMessage?: string;
  disabled?: boolean;
  colorScheme?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'info'
    | 'error';
  viewMode?: ViewMode;
}

export const ChoiceGroup: React.FC<ChoiceGroupProps> = ({
  id,
  name,
  choices,
  allowMultiple,
  selectedValues,
  onChange,
  otherChoiceEnabled = false,
  otherChoiceText = 'Other',
  isValid = true,
  validationMessage,
  disabled = false,
  colorScheme = 'primary',
  viewMode = 'detailed',
}) => {
  const [otherValue, setOtherValue] = useState('');
  const isOtherSelected = selectedValues.includes('other');

  const handleSingleChange = (value: string) => {
    onChange([value]);
  };

  const handleMultipleChange = (value: string, isChecked: boolean) => {
    if (value === 'other' && !isChecked) {
      setOtherValue('');
    }

    const newValues = isChecked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);

    onChange(newValues);
  };

  const handleOtherInputChange = (value: string) => {
    setOtherValue(value);
  };

  return (
    <div className="space-y-4">
      {/* Modern card-based selection for main choices */}
      {allowMultiple ? (
        <CheckboxCardGroup
          choices={choices}
          selectedValues={selectedValues.filter((v) => v !== 'other')}
          onChange={(values) => {
            // Preserve 'other' selection if it exists
            const newValues = isOtherSelected ? [...values, 'other'] : values;
            onChange(newValues);
          }}
          disabled={disabled}
          gridCols={3}
          colorScheme={colorScheme}
          viewMode={viewMode}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {choices.map((choice) => (
            <div
              key={choice.id}
              className={`card cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                selectedValues.includes(choice.text)
                  ? `bg-${colorScheme} text-${colorScheme}-content border-${colorScheme} border-2 shadow-sm`
                  : 'bg-base-100 border-base-300 border hover:border-base-400'
              }`}
              onClick={() => handleSingleChange(choice.text)}
            >
              <div className="card-body p-4">
                <h3 className="card-title text-base">{choice.text}</h3>
                {/* Choice entity doesn't have description field - only shows title in both views */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other choice option - keep existing implementation for now */}
      {otherChoiceEnabled && (
        <div className="space-y-2">
          {allowMultiple ? (
            <CheckboxChoice
              id={`${id}-other`}
              value="other"
              label={otherChoiceText}
              checked={isOtherSelected}
              onChange={handleMultipleChange}
              disabled={disabled}
            />
          ) : (
            <RadioChoice
              id={`${id}-other`}
              name={name}
              value="other"
              label={otherChoiceText}
              checked={isOtherSelected}
              onChange={handleSingleChange}
              disabled={disabled}
            />
          )}

          {isOtherSelected && (
            <div className="ml-8 mt-2">
              <TextInput
                id={`${id}-other-input`}
                value={otherValue}
                onChange={handleOtherInputChange}
                placeholder="Please specify"
                isValid={isValid}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      )}

      <ValidationMessage message={validationMessage} isValid={isValid} />
    </div>
  );
};
