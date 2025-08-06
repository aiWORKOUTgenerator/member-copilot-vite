'use client';

import React from 'react';

interface CheckboxChoiceProps {
  id: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string, isChecked: boolean) => void;
  disabled?: boolean;
}

export const CheckboxChoice: React.FC<CheckboxChoiceProps> = ({
  id,
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
          type="checkbox"
          value={value}
          checked={checked}
          onChange={(e) => onChange(value, e.target.checked)}
          className="checkbox checkbox-primary "
          disabled={disabled}
        />
        <span className="ml-3 text-sm break-words leading-normal">{label}</span>
      </label>
    </div>
  );
};
