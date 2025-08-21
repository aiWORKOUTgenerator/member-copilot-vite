'use client';

import React, { useEffect, useState } from 'react';

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
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'info'
    | 'error';
  /** Control description visibility in cards */
  showDescription?: boolean;
  /** Control tertiary content visibility in cards */
  showTertiary?: boolean;
}

/**
 * RadioGroupOfCards - A card-based selection component with visibility control
 *
 * This component renders a grid of selectable cards with support for controlling
 * the visibility of descriptions and tertiary content. It handles both controlled
 * and uncontrolled state, and supports single and multiple selection modes.
 *
 * @example
 * // Basic usage with all content visible
 * <RadioGroupOfCards
 *   items={options}
 *   onChange={handleSelection}
 *   legend="Choose an option"
 * />
 *
 * @example
 * // Hide descriptions, show tertiary content
 * <RadioGroupOfCards
 *   items={options}
 *   onChange={handleSelection}
 *   showDescription={false}
 *   showTertiary={true}
 * />
 *
 * @example
 * // Multiple selection with custom styling
 * <RadioGroupOfCards
 *   items={options}
 *   onChange={handleSelection}
 *   multiple={true}
 *   gridCols={2}
 *   colorScheme="accent"
 * />
 *
 * @template T - The type extending SelectableItem
 * @param props - Component props
 * @returns A grid of selectable cards
 */
export function RadioGroupOfCards<T extends SelectableItem>({
  items,
  onChange,
  defaultSelected,
  selected: controlledSelected,
  legend = 'Select an option',
  multiple = false,
  gridCols = 3,
  colorScheme = 'primary',
  showDescription = true,
  showTertiary = true,
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
        <legend className="text-2xl font-bold text-base-content mb-6 bg-base-300/70 rounded-box p-6 text-center">
          {legend}
        </legend>
      )}

      {/* Card Container for Visual Separation */}
      <div className="card bg-base-200/50 shadow-sm">
        <div className="card-body p-6">
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-${gridCols}`}
          >
            {items.map((item) => {
              const isSelected = isItemSelected(item);

              return (
                <div
                  key={item.id}
                  className={`card cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                    isSelected
                      ? `bg-gradient-to-br from-${colorScheme}/30 to-${colorScheme}/20 border-${colorScheme} border-2 shadow-sm`
                      : 'bg-gradient-to-br from-base-200/20 to-base-200/10 border-base-300 border hover:border-base-400'
                  }`}
                  onClick={() => handleChange(item)}
                >
                  <div className="card-body p-4 flex flex-col">
                    <div className="flex-grow">
                      <h3 className="card-title text-base">{item.title}</h3>
                      {showDescription && item.description && (
                        <p className="text-sm text-base-content/70">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {showTertiary && item.tertiary && (
                      <div className="mt-3 text-sm font-medium">
                        {item.tertiary}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
