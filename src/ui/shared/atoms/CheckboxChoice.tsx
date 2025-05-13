"use client";

import React from "react";

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
    <div className="form-control">
      <label className="label cursor-pointer justify-start gap-3">
        <input
          id={id}
          type="checkbox"
          value={value}
          checked={checked}
          onChange={(e) => onChange(value, e.target.checked)}
          className="checkbox checkbox-primary"
          disabled={disabled}
        />
        <span className="label-text">{label}</span>
      </label>
    </div>
  );
};
