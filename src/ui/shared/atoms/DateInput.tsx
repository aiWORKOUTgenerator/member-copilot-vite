'use client';

import React from 'react';

interface DateInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  isValid?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  id,
  value,
  onChange,
  isValid = true,
  disabled = false,
  min,
  max,
}) => {
  return (
    <div className="cally">
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input input-bordered w-full ${
          !isValid ? 'input-error' : ''
        }`}
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  );
};
