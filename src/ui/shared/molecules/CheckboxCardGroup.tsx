'use client';

import React from 'react';
import { RadioGroupOfCards } from './RadioGroupOfCards';
import { Choice } from '@/domain/entities';
import { ViewMode } from '@/contexts/ViewModeContext';

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
  selectedBadgeContent?: string | React.ReactNode;
  viewMode?: ViewMode;
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
  colorScheme = 'primary',
  selectedBadgeContent = 'Selected',
  viewMode = 'detailed',
}) => {
  // Transform choices into SelectableItem format for RadioGroupOfCards
  const items = choices.map((choice) => ({
    id: choice.id,
    title: choice.text.split(/[-:]/)[0].trim(),
    description:
      viewMode === 'detailed' && /[-:]/.test(choice.text)
        ? choice.text.split(/[-:]/).slice(1).join(':').trim()
        : '',
    tertiary: selectedValues.includes(choice.text) ? (
      <div className="badge badge-primary badge-sm">{selectedBadgeContent}</div>
    ) : undefined,
  }));

  // Find currently selected items - always an array for multiple selection
  // Need to match against original choice.text since selectedValues contains full text
  const selectedItems: typeof items = items.filter((item) => {
    const originalChoice = choices.find((c) => c.id === item.id);
    return originalChoice && selectedValues.includes(originalChoice.text);
  });

  const handleChange = (selected: (typeof items)[0] | typeof items) => {
    if (Array.isArray(selected)) {
      // Multiple selection - extract original choice.text from selected items
      const newValues = selected.map((s) => {
        const originalChoice = choices.find((c) => c.id === s.id);
        return originalChoice ? originalChoice.text : s.title;
      });
      onChange(newValues);
    } else {
      // Single item selected - toggle it in the array
      const originalChoice = choices.find((c) => c.id === selected.id);
      const originalText = originalChoice
        ? originalChoice.text
        : selected.title;
      const newValues = selectedValues.includes(originalText)
        ? selectedValues.filter((v) => v !== originalText)
        : [...selectedValues, originalText];
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
        showDescription={viewMode === 'detailed'}
        showTertiary={true}
      />
    </div>
  );
};
