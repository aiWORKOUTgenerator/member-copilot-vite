"use client";

import React, { useEffect, useState } from "react";

export interface SelectableItem {
  id: string | number;
  title: string;
  description: string;
  tertiary?: string | React.ReactNode;
}

interface RadioGroupOfCardsProps<T extends SelectableItem> {
  items: T[];
  onChange: (selected: T | T[]) => void;
  defaultSelected?: T | T[];
  selected?: T | T[];
  legend?: string;
  multiple?: boolean;
  gridCols?: number;
  colorScheme?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "info"
    | "error";
}

export function RadioGroupOfCards<T extends SelectableItem>({
  items,
  onChange,
  defaultSelected,
  selected: controlledSelected,
  legend = "Select an option",
  multiple = false,
  gridCols = 3,
  colorScheme = "primary",
}: RadioGroupOfCardsProps<T>) {
  // Initialize internal state based on whether it's controlled or uncontrolled
  const [internalSelected, setInternalSelected] = useState<T | T[] | undefined>(
    defaultSelected
  );

  // Use the controlled value if provided, otherwise use internal state
  const selected =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  // Update internal state when controlled value changes
  useEffect(() => {
    if (controlledSelected !== undefined) {
      setInternalSelected(controlledSelected);
    }
  }, [controlledSelected]);

  const handleChange = (item: T) => {
    if (multiple) {
      // For multiple selection, toggle the item in the array
      const currentSelected = (selected as T[]) || [];
      const isItemSelected = currentSelected.some((i) => i.id === item.id);

      const newSelected = isItemSelected
        ? currentSelected.filter((i) => i.id !== item.id)
        : [...currentSelected, item];

      // Only update internal state if not controlled
      if (controlledSelected === undefined) {
        setInternalSelected(newSelected);
      }
      onChange(newSelected);
    } else {
      // For single selection, just set the selected item
      // Only update internal state if not controlled
      if (controlledSelected === undefined) {
        setInternalSelected(item);
      }
      onChange(item);
    }
  };

  const isItemSelected = (item: T): boolean => {
    if (!selected) return false;

    if (multiple) {
      return (selected as T[]).some((i) => i.id === item.id);
    }
    return (selected as T).id === item.id;
  };

  return (
    <fieldset className="w-full">
      {legend && (
        <legend className="font-medium text-base-content mb-4">{legend}</legend>
      )}

      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-${gridCols}`}
      >
        {items.map((item) => {
          const isSelected = isItemSelected(item);

          return (
            <div
              key={item.id}
              className={`card cursor-pointer transition-all hover:shadow ${
                isSelected
                  ? `bg-${colorScheme}-50 border-${colorScheme} border-2`
                  : "bg-base-100 border-base-300 border"
              }`}
              onClick={() => handleChange(item)}
            >
              <div className="card-body p-4 flex flex-col">
                <div className="flex-grow">
                  <h3 className="card-title text-base">{item.title}</h3>
                  <p className="text-sm text-base-content/70">
                    {item.description}
                  </p>
                </div>

                {item.tertiary && (
                  <div className="mt-3 text-sm font-medium">
                    {item.tertiary}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
