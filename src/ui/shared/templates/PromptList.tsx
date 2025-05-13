"use client";

import { Prompt } from "@/domain/entities";
import React, { useState } from "react";
import { PromptCard } from "../organisms/PromptCard";

interface PromptValues {
  [promptId: string]: string | string[] | number;
}

interface PromptListProps {
  prompts: Prompt[];
  onSubmit?: (values: PromptValues) => void;
  initialValues?: PromptValues;
}

export const PromptList: React.FC<PromptListProps> = ({
  prompts,
  onSubmit,
  initialValues = {},
}) => {
  const [values, setValues] = useState<PromptValues>(initialValues);
  const [validationErrors, setValidationErrors] = useState<{
    [promptId: string]: string;
  }>({});

  const handlePromptChange = (
    promptId: string,
    value: string | string[] | number
  ) => {
    setValues((prev) => ({
      ...prev,
      [promptId]: value,
    }));

    // Clear validation error when value changes
    if (validationErrors[promptId]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[promptId];
        return newErrors;
      });
    }
  };

  const validatePrompts = (): boolean => {
    const errors: { [promptId: string]: string } = {};

    prompts.forEach((prompt) => {
      const value = values[prompt.id];

      // Check required
      if (prompt.validationRules?.required === true) {
        if (
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          errors[prompt.id] = "This field is required";
        }
      }

      // Check min/max for numbers
      if (typeof value === "number" && prompt.validationRules) {
        const min = prompt.validationRules.min;
        const max = prompt.validationRules.max;

        if (typeof min === "number" && value < min) {
          errors[prompt.id] = `Minimum value is ${min}`;
        }
        if (typeof max === "number" && value > max) {
          errors[prompt.id] = `Maximum value is ${max}`;
        }
      }

      // Check min/max length for strings
      if (typeof value === "string" && prompt.validationRules) {
        const minLength = prompt.validationRules.minLength;
        const maxLength = prompt.validationRules.maxLength;

        if (typeof minLength === "number" && value.length < minLength) {
          errors[prompt.id] = `Minimum length is ${minLength} characters`;
        }
        if (typeof maxLength === "number" && value.length > maxLength) {
          errors[prompt.id] = `Maximum length is ${maxLength} characters`;
        }
      }

      // Check regex pattern
      if (
        typeof value === "string" &&
        prompt.validationRules?.pattern instanceof RegExp
      ) {
        if (!prompt.validationRules.pattern.test(value)) {
          errors[prompt.id] = "Invalid format";
        }
      }

      // Check min selections for multi-choice
      if (Array.isArray(value) && prompt.validationRules?.minSelections) {
        const minSelections = prompt.validationRules.minSelections;
        if (typeof minSelections === "number" && value.length < minSelections) {
          errors[
            prompt.id
          ] = `Please select at least ${minSelections} option(s)`;
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePrompts() && onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          value={values[prompt.id] || ""}
          onChange={(value) => handlePromptChange(prompt.id, value)}
          validationMessage={validationErrors[prompt.id]}
          isValid={!validationErrors[prompt.id]}
        />
      ))}

      {onSubmit && (
        <div className="flex justify-end mt-6">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      )}
    </form>
  );
};
