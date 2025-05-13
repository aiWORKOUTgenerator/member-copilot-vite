"use client";

import React, { useState } from "react";
import { RadioChoice } from "../atoms/RadioChoice";
import { CheckboxChoice } from "../atoms/CheckboxChoice";
import { ValidationMessage } from "../atoms/ValidationMessage";
import { TextInput } from "../atoms/TextInput";
import { Choice } from "@/domain/entities";

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
}

export const ChoiceGroup: React.FC<ChoiceGroupProps> = ({
  id,
  name,
  choices,
  allowMultiple,
  selectedValues,
  onChange,
  otherChoiceEnabled = false,
  otherChoiceText = "Other",
  isValid = true,
  validationMessage,
  disabled = false,
}) => {
  const [otherValue, setOtherValue] = useState("");
  const isOtherSelected = selectedValues.includes("other");

  const handleSingleChange = (value: string) => {
    onChange([value]);
  };

  const handleMultipleChange = (value: string, isChecked: boolean) => {
    if (value === "other" && !isChecked) {
      setOtherValue("");
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
    <div className="space-y-2">
      <div className="space-y-1">
        {choices.map((choice) => (
          <div key={choice.id}>
            {allowMultiple ? (
              <CheckboxChoice
                id={`${id}-${choice.id}`}
                value={choice.text}
                label={choice.text}
                checked={selectedValues.includes(choice.text)}
                onChange={handleMultipleChange}
                disabled={disabled}
              />
            ) : (
              <RadioChoice
                id={`${id}-${choice.id}`}
                name={name}
                value={choice.text}
                label={choice.text}
                checked={selectedValues.includes(choice.text)}
                onChange={handleSingleChange}
                disabled={disabled}
              />
            )}
          </div>
        ))}

        {otherChoiceEnabled && (
          <div>
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
      </div>

      <ValidationMessage message={validationMessage} isValid={isValid} />
    </div>
  );
};
