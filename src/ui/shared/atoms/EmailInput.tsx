"use client";

import React from "react";

interface EmailInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "email@example.com",
  isValid = true,
  disabled = false,
}) => {
  return (
    <input
      id={id}
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`input input-bordered w-full ${!isValid ? "input-error" : ""}`}
      disabled={disabled}
    />
  );
};
