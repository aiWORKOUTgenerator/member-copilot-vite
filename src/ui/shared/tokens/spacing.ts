/**
 * Design Tokens - Spacing
 *
 * Centralized spacing definitions for the design system.
 * These tokens ensure consistent spacing across all UI components.
 */

export const SPACING_TOKENS = {
  section: {
    xs: "mb-4",
    sm: "mb-6",
    md: "mb-8",
    lg: "mb-12",
    xl: "mb-16",
  },
  component: {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  },
  stepIndicator: {
    container: {
      compact: "mb-6",
      default: "mb-8",
      spacious: "mb-12",
    },
    stepGap: {
      compact: "space-x-4",
      default: "space-x-6",
      spacious: "space-x-8",
    },
    labelSpacing: {
      compact: "mt-1",
      default: "mt-2",
      spacious: "mt-3",
    },
  },
} as const;

export type SpacingSize = "xs" | "sm" | "md" | "lg" | "xl";
export type StepIndicatorSpacing = "compact" | "default" | "spacious";
