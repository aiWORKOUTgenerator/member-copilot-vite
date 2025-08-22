import React from 'react';
import { RadioGroupOfCards, SelectableItem } from './RadioGroupOfCards';
import { ValidationMessage } from '../atoms/ValidationMessage';
import { HeroTitle } from './HeroTitle';
import type { ComponentType } from 'react';

export interface DetailedSelectorProps<T> {
  /** Icon shown next to the question */
  icon: ComponentType<{ className?: string }>;
  /** The list of choices */
  options: Array<{
    id: string;
    title: string;
    description?: string;
    tertiary?: React.ReactNode; // e.g. <LevelDots …/>
  }>;
  /** Current selection: a single T or array of T if multiple */
  selectedValue?: T | T[];
  /** Whether this selector allows multiple picks */
  multiple?: boolean;
  /** Fired when the user picks something */
  onChange: (value: T | T[]) => void;
  /** The question label text */
  question: string;
  /** Optional helper text under the label */
  description?: string;
  /** Disable all inputs */
  disabled?: boolean;
  /** Validation error message */
  error?: string;
  /** How many columns in the grid */
  gridCols?: number;
  /** Color scheme key (matches your themes) */
  colorScheme?: string;
  /** Whether to show required field indicator */
  required?: boolean;
  /** Display variant - controls overall presentation style */
  variant?: 'detailed' | 'simple';
  /** Explicitly control description visibility (overrides variant default) */
  showDescription?: boolean;
  /** Explicitly control tertiary content visibility (overrides variant default) */
  showTertiary?: boolean;
}

/**
 * DetailedSelector - A flexible selector component with simple/detailed variants
 *
 * This component provides a card-based selection interface with support for both
 * detailed and simple presentation modes. It can display descriptions, tertiary
 * content (like progress indicators), and supports both single and multiple selection.
 *
 * @example
 * // Detailed view (default) - shows descriptions and tertiary content
 * <DetailedSelector
 *   icon={Target}
 *   options={focusOptions}
 *   selectedValue={selectedFocus}
 *   onChange={setSelectedFocus}
 *   question="What's your main goal?"
 *   variant="detailed"
 * />
 *
 * @example
 * // Simple view - hides descriptions and tertiary content
 * <DetailedSelector
 *   icon={Target}
 *   options={focusOptions}
 *   selectedValue={selectedFocus}
 *   onChange={setSelectedFocus}
 *   question="What's your main goal?"
 *   variant="simple"
 * />
 *
 * @example
 * // Custom control - show tertiary but not descriptions
 * <DetailedSelector
 *   icon={Target}
 *   options={focusOptions}
 *   selectedValue={selectedFocus}
 *   onChange={setSelectedFocus}
 *   question="What's your main goal?"
 *   variant="simple"
 *   showDescription={false}
 *   showTertiary={true}
 * />
 *
 * @template T - The type of the selected value(s)
 * @param props - Component props
 * @returns A card-based selector component
 */
export function DetailedSelector<T>({
  icon: Icon,
  options,
  selectedValue,
  multiple = false,
  onChange,
  question,
  description,
  disabled = false,
  error,
  gridCols = 3,
  colorScheme = 'primary',
  required = false,
  variant = 'detailed',
  showDescription: explicitShowDescription,
  showTertiary: explicitShowTertiary,
}: DetailedSelectorProps<T>) {
  // Helper function for variant defaults
  const getVariantDefaults = (variant: 'detailed' | 'simple') => ({
    showDescription: variant === 'detailed',
    showTertiary: variant === 'detailed',
  });

  // Apply variant defaults with explicit overrides
  const defaults = getVariantDefaults(variant);
  const showDescription = explicitShowDescription ?? defaults.showDescription;
  const showTertiary = explicitShowTertiary ?? defaults.showTertiary;

  // convert options → items for RadioGroupOfCards
  const items = options.map((opt) => ({
    id: opt.id,
    title: opt.title,
    description: opt.description || '', // Ensure description is always a string
    tertiary: opt.tertiary,
  }));

  // Find the selected item(s) based on selectedValue
  const getSelectedItems = () => {
    if (!selectedValue || selectedValue === '') return undefined;

    if (multiple) {
      // For multiple selection, selectedValue should be an array of IDs
      const selectedIds = selectedValue as string[];
      return items.filter((item) => selectedIds.includes(item.id));
    } else {
      // For single selection, selectedValue should be a single ID
      const selectedId = selectedValue as string;
      return items.find((item) => item.id === selectedId);
    }
  };

  // onChange wrapper to cast string → T
  const handleChange = (selected: SelectableItem | SelectableItem[]) => {
    if (multiple) {
      // For multiple selection, extract IDs from selected items
      const selectedIds = Array.isArray(selected)
        ? selected.map((item) => item.id)
        : [selected.id];
      onChange(selectedIds as T[]);
    } else {
      // For single selection, extract ID from selected item
      const selectedId = Array.isArray(selected)
        ? selected[0]?.id
        : selected.id;
      onChange(selectedId as T);
    }
  };

  return (
    <div className="w-full">
      {/* Label + Icon */}
      <HeroTitle
        title={question}
        subtitle={description}
        icon={Icon}
        align="left"
        variant="default"
        size="md"
        subtitleSize="sm"
        badge={
          required || error != null ? (
            <span className="text-error">*</span>
          ) : undefined
        }
      />

      {/* Choice grid */}
      <div
        className={`bg-base-100 rounded-lg p-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <RadioGroupOfCards
          items={items}
          legend=""
          multiple={multiple}
          gridCols={gridCols}
          colorScheme={
            colorScheme as
              | 'primary'
              | 'secondary'
              | 'accent'
              | 'success'
              | 'warning'
              | 'info'
              | 'error'
          }
          selected={getSelectedItems()}
          onChange={handleChange}
          showDescription={showDescription}
          showTertiary={showTertiary}
        />
      </div>

      {/* Validation */}
      <ValidationMessage message={error} isValid={!error} />
    </div>
  );
}
