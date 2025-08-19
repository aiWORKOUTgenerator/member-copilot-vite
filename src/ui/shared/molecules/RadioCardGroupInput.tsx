'use client';

import { ReactNode, Ref } from 'react';

export interface RadioCardOption {
  id: string;
  value: string;
  title: string;
  description?: string;
  metaRight?: string | ReactNode;
  disabled?: boolean;
}

interface RadioCardGroupInputProps {
  id: string;
  name: string;
  legend: string;
  options: RadioCardOption[];
  value: string | null;
  onChange: (value: string) => void;
  isValid?: boolean;
  validationMessage?: string;
  legendRef?: Ref<HTMLLegendElement>;
}

/**
 * RadioCardGroupInput
 * A radio group rendered as selectable cards, suitable for use within a <form>.
 * Uses native radios for accessibility, keyboard support, and form submission.
 */
export function RadioCardGroupInput({
  id,
  name,
  legend,
  options,
  value,
  onChange,
  isValid = true,
  validationMessage,
  legendRef,
}: RadioCardGroupInputProps) {
  return (
    <fieldset className="w-full" id={id}>
      <legend ref={legendRef} className="text-lg font-semibold mb-4">
        {legend}
      </legend>

      <div className="space-y-3">
        {options.map((option) => {
          const inputId = `${id}-${option.id}`;
          const checked = value === option.value;

          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className="block cursor-pointer"
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                disabled={option.disabled}
                className="peer sr-only"
              />

              <div
                className={
                  `card border transition-colors duration-150 ` +
                  `border-base-300 hover:border-base-400 ` +
                  `peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/20 ` +
                  `bg-base-100`
                }
              >
                <div className="card-body p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="card-title text-base">{option.title}</h3>
                    {option.description && (
                      <p className="text-sm text-base-content/70">
                        {option.description}
                      </p>
                    )}
                  </div>
                  {option.metaRight && (
                    <div className="text-sm font-medium text-base-content/90">
                      {option.metaRight}
                    </div>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {validationMessage && !isValid && (
        <p className="text-error text-sm mt-3" aria-live="polite">
          {validationMessage}
        </p>
      )}
    </fieldset>
  );
}
