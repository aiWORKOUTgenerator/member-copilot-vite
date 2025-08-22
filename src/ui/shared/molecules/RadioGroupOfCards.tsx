'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@/ui/shared/atoms/Card';

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
 * RadioGroupOfCards - A card-based selection component
 *
 * This component renders a group of selectable cards with support for both
 * single and multiple selection modes. It provides a visually appealing
 * interface for choosing between different options.
 *
 * @example
 * // Single selection
 * <RadioGroupOfCards
 *   items={[
 *     { id: '1', title: 'Option 1', description: 'Description 1' },
 *     { id: '2', title: 'Option 2', description: 'Description 2' }
 *   ]}
 *   onChange={(selected) => console.log(selected)}
 *   legend="Choose an option"
 * />
 *
 * @example
 * // Multiple selection
 * <RadioGroupOfCards
 *   items={items}
 *   onChange={(selected) => console.log(selected)}
 *   multiple={true}
 *   legend="Choose multiple options"
 * />
 *
 * @template T - The type of the selectable items
 * @param props - Component props
 * @returns A card-based selection component
 */
export function RadioGroupOfCards<T extends SelectableItem>({
  items,
  onChange,
  defaultSelected,
  selected: controlledSelected,
  legend,
  multiple = false,
  gridCols = 3,
  colorScheme = 'primary',
  showDescription = true,
  showTertiary = true,
}: RadioGroupOfCardsProps<T>) {
  // Internal state for uncontrolled component
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
                <Card
                  key={item.id}
                  variant="path"
                  colorScheme={colorScheme}
                  isSelected={isSelected}
                  onClick={() => handleChange(item)}
                  className="hover:scale-[1.02]"
                >
                  <CardBody padding="sm" className="flex flex-col">
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
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
