'use client';
import React from 'react';

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
    <div className="flex items-start space-x-3">
      <label htmlFor={id} className="flex items-start cursor-pointer">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="radio radio-primary "
          disabled={disabled}
        />
        <span className="ml-3 text-sm break-words leading-normal">{label}</span>
      </label>
    </div>
  );
};
