"use client";
import React from "react";

interface RadioChoiceProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const RadioChoice: React.FC<RadioChoiceProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer justify-start gap-3">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="radio radio-primary"
          disabled={disabled}
        />
        <span className="label-text">{label}</span>
      </label>
    </div>
  );
};
