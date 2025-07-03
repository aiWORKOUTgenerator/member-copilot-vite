/**
 * Centralized exports for workout customization utilities
 * 
 * This index file provides a single import point for all customization
 * helpers, components, and utilities.
 */

// Core helper functions and utilities
export * from './customizationHelpers';

// React components
export * from './customizationComponents';

// Selection formatting utilities
export * from './selectionFormatter';

// Validation utilities  
export * from './validation';

// Re-export commonly used types for convenience
export type {
  SelectionSummaryOptions,
  MultiSelectOptions,
  ValidationResult,
  BadgeConfig,
  TimeDisplayOptions,
  PercentageOptions
} from './customizationHelpers'; 