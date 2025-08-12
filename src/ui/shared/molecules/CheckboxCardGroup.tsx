'use client';

import React from 'react';
import { RadioGroupOfCards } from './RadioGroupOfCards';
import { Choice } from '@/domain/entities';

interface CheckboxCardGroupProps {
  choices: Choice[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  gridCols?: number;
  colorScheme?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'info'
    | 'error';
}

/**
 * CheckboxCardGroup - A card-based multiple selection component
 *
 * This component provides a modern card-based interface for multiple choice selections,
 * leveraging the existing RadioGroupOfCards component with multiple selection support.
 * Each selected item shows a visual badge to indicate selection state.
 */
export const CheckboxCardGroup: React.FC<CheckboxCardGroupProps> = ({
  choices,
  selectedValues,
  onChange,
  disabled = false,
  gridCols = 3,
  colorScheme = 'accent',
}) => {
  // Transform choices into SelectableItem format for RadioGroupOfCards
  const items = choices.map((choice) => ({
    id: choice.id,
    title: choice.text,
    description: '', // Choice entity doesn't have description
    tertiary: selectedValues.includes(choice.text) ? (
      <div className="badge badge-primary badge-sm">Selected</div>
    ) : undefined,
  }));

  // Find currently selected items - always an array for multiple selection
  const selectedItems: typeof items = items.filter((item) =>
    selectedValues.includes(item.title)
  );

  const handleChange = (selected: (typeof items)[0] | typeof items) => {
    if (Array.isArray(selected)) {
      // Multiple selection - extract titles from selected items
      const newValues = selected.map((s) => s.title);
      onChange(newValues);
    } else {
      // Single item selected - toggle it in the array
      const itemTitle = selected.title;
      const newValues = selectedValues.includes(itemTitle)
        ? selectedValues.filter((v) => v !== itemTitle)
        : [...selectedValues, itemTitle];
      onChange(newValues);
    }
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <RadioGroupOfCards
        items={items}
        selected={selectedItems}
        onChange={handleChange}
        multiple={true}
        legend=""
        gridCols={gridCols}
        colorScheme={colorScheme}
        showDescription={false}
        showTertiary={true}
      />
    </div>
  );
};
