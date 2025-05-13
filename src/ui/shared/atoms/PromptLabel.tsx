"use client";
import React from "react";

interface PromptLabelProps {
  text: string;
  isRequired?: boolean;
  htmlFor?: string;
}

export const PromptLabel: React.FC<PromptLabelProps> = ({
  text,
  isRequired = false,
  htmlFor,
}) => {
  return (
    <label htmlFor={htmlFor} className="label font-medium text-base">
      <span className="label-text">
        {text}
        {isRequired && <span className="text-error ml-1">*</span>}
      </span>
    </label>
  );
};
