/**
 * Card Design System
 *
 * This file contains all the styling constants for the Card component.
 * It ensures consistent design language across all card variants and makes
 * it easy to update card styling in one place.
 */

export type ColorScheme =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info';

// Base card styling
const baseCardClasses = 'border-2 transition-all duration-200';

// Default card variant
const defaultCardClasses = 'bg-base-100 border-base-300';

// Selectable card variants
const selectableCardClasses = {
  unselected:
    'bg-gradient-to-br from-base-200/20 to-base-200/10 border-base-300 hover:border-base-400',
  selected: (colorScheme: ColorScheme) =>
    `bg-gradient-to-br from-${colorScheme}/30 to-${colorScheme}/20 border-${colorScheme} shadow-sm`,
};

// Path card variants - matching the existing PathCard design
const pathCardClasses = {
  primary:
    'bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 hover:border-primary/40',
  secondary:
    'bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30 hover:border-secondary/40',
  accent:
    'bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30 hover:border-accent/40',
  success:
    'bg-gradient-to-br from-success/20 to-success/10 border-success/30 hover:border-success/40',
  warning:
    'bg-gradient-to-br from-warning/20 to-warning/10 border-warning/30 hover:border-warning/40',
  info: 'bg-gradient-to-br from-info/20 to-info/10 border-info/30 hover:border-info/40',
};

// Export the complete design system
export const cardVariants = {
  default: `${baseCardClasses} ${defaultCardClasses}`,
  selectable: {
    unselected: `${baseCardClasses} ${selectableCardClasses.unselected}`,
    selected: (colorScheme: ColorScheme) =>
      `${baseCardClasses} ${selectableCardClasses.selected(colorScheme)}`,
  },
  path: {
    primary: `${baseCardClasses} ${pathCardClasses.primary}`,
    secondary: `${baseCardClasses} ${pathCardClasses.secondary}`,
    accent: `${baseCardClasses} ${pathCardClasses.accent}`,
    success: `${baseCardClasses} ${pathCardClasses.success}`,
    warning: `${baseCardClasses} ${pathCardClasses.warning}`,
    info: `${baseCardClasses} ${pathCardClasses.info}`,
  },
};

// Color scheme utilities for consistent theming
export const colorSchemeUtilities = {
  primary: {
    text: 'text-primary',
    bg: 'bg-primary',
    border: 'border-primary',
    gradient: 'from-primary to-primary-focus',
  },
  secondary: {
    text: 'text-secondary',
    bg: 'bg-secondary',
    border: 'border-secondary',
    gradient: 'from-secondary to-secondary-focus',
  },
  accent: {
    text: 'text-accent',
    bg: 'bg-accent',
    border: 'border-accent',
    gradient: 'from-accent to-accent-focus',
  },
  success: {
    text: 'text-success',
    bg: 'bg-success',
    border: 'border-success',
    gradient: 'from-success to-success-focus',
  },
  warning: {
    text: 'text-warning',
    bg: 'bg-warning',
    border: 'border-warning',
    gradient: 'from-warning to-warning-focus',
  },
  info: {
    text: 'text-info',
    bg: 'bg-info',
    border: 'border-info',
    gradient: 'from-info to-info-focus',
  },
};
