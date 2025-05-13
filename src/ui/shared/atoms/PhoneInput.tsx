"use client";
import React from "react";

interface PhoneInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "+1 (555) 123-4567",
  isValid = true,
  disabled = false,
}) => {
  return (
    <input
      id={id}
      type="tel"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`input input-bordered w-full ${!isValid ? "input-error" : ""}`}
      disabled={disabled}
    />
  );
};
