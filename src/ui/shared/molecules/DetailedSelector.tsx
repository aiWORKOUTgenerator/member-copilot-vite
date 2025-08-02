import React from "react";
import { RadioGroupOfCards, SelectableItem } from "./RadioGroupOfCards";
import { ValidationMessage } from "../atoms/ValidationMessage";
import type { ComponentType } from "react";

export interface DetailedSelectorProps<T> {
  /** Icon shown next to the question */
  icon: ComponentType<{ className?: string }>;
  /** The list of choices */
  options: Array<{
    id: string;
    title: string;
    description?: string;
    tertiary?: React.ReactNode;  // e.g. <LevelDots …/>
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
}

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
  colorScheme = "primary",
  required = false,
}: DetailedSelectorProps<T>) {
  // convert options → items for RadioGroupOfCards
  const items = options.map(opt => ({
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
      return items.filter(item => selectedIds.includes(item.id));
    } else {
      // For single selection, selectedValue should be a single ID
      const selectedId = selectedValue as string;
      return items.find(item => item.id === selectedId);
    }
  };

  // onChange wrapper to cast string → T
  const handleChange = (selected: SelectableItem | SelectableItem[]) => {
    if (multiple) {
      // For multiple selection, extract IDs from selected items
      const selectedIds = Array.isArray(selected) 
        ? selected.map(item => item.id)
        : [selected.id];
      onChange(selectedIds as T[]);
    } else {
      // For single selection, extract ID from selected item
      const selectedId = Array.isArray(selected) ? selected[0]?.id : selected.id;
      onChange(selectedId as T);
    }
  };

  return (
    <div className="w-full">
      {/* Label + Icon */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-base-content mb-2 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{question}</span>
          {/** Show required indicator if required or if there's an error */}
          {(required || error != null) && <span className="text-error">*</span>}
        </label>
        {description && (
          <p className="text-xs text-base-content/70 mb-3">{description}</p>
        )}
      </div>

      {/* Choice grid */}
      <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
        <RadioGroupOfCards
          items={items}
          legend=""
          multiple={multiple}
          gridCols={gridCols}
          colorScheme={colorScheme as "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "error"}
          selected={getSelectedItems()}
          onChange={handleChange}
        />
      </div>

      {/* Validation */}
      <ValidationMessage message={error} isValid={!error} />
    </div>
  );
} 