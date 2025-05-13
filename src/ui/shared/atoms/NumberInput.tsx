"use client";

import React from "react";

interface NumberInputProps {
  id: string;
  value: number | string;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "",
  isValid = true,
  disabled = false,
  min,
  max,
}) => {
  return (
    <input
      id={id}
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`input input-bordered w-full ${!isValid ? "input-error" : ""}`}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
};
