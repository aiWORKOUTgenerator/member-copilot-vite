"use client";
import React from "react";

interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "",
  isValid = true,
  disabled = false,
}) => {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`input input-bordered w-full ${!isValid ? "input-error" : ""}`}
      disabled={disabled}
    />
  );
};
