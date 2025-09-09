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
  | 'info'
  | 'error';

export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

// Base card styling with glass morphism
const baseCardClasses =
  'relative overflow-hidden rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group';

// Default card variant with glass morphism
const defaultCardClasses =
  'bg-gradient-to-br from-base-200/20 via-base-100/10 to-base-200/5';

// Selectable card variants with glass morphism
const selectableCardClasses = {
  unselected:
    'bg-gradient-to-br from-base-200/20 via-base-100/10 to-base-200/5 border-white/10 hover:border-white/20',
  selected: (colorScheme: ColorScheme) =>
    `bg-gradient-to-br from-${colorScheme}/30 via-${colorScheme}/20 to-${colorScheme}/10 border-${colorScheme}/30 shadow-${colorScheme}/20`,
};

// Path card variants with glass morphism
const pathCardClasses = {
  primary:
    'cursor-pointer bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-primary/30 hover:border-primary/40',
  secondary:
    'cursor-pointer bg-gradient-to-br from-secondary/20 via-secondary/10 to-secondary/5 border-secondary/30 hover:border-secondary/40',
  accent:
    'cursor-pointer bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 border-accent/30 hover:border-accent/40',
  success:
    'cursor-pointer bg-gradient-to-br from-success/20 via-success/10 to-success/5 border-success/30 hover:border-success/40',
  warning:
    'cursor-pointer bg-gradient-to-br from-warning/20 via-warning/10 to-warning/5 border-warning/30 hover:border-warning/40',
  info: 'cursor-pointer bg-gradient-to-br from-info/20 via-info/10 to-info/5 border-info/30 hover:border-info/40',
  error:
    'cursor-pointer bg-gradient-to-br from-error/20 via-error/10 to-error/5 border-error/30 hover:border-error/40',
};

// Size variants for text and spacing
export const cardSizeVariants = {
  sm: {
    title: 'text-sm font-semibold',
    description: 'text-xs',
    padding: 'p-3',
  },
  md: {
    title: 'text-base font-semibold',
    description: 'text-sm',
    padding: 'p-4',
  },
  lg: {
    title: 'text-lg font-bold',
    description: 'text-base',
    padding: 'p-5',
  },
  xl: {
    title: 'text-xl font-bold',
    description: 'text-base',
    padding: 'p-6',
  },
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
    error: `${baseCardClasses} ${pathCardClasses.error}`,
  },
};

// Color scheme utilities for consistent theming
export const colorSchemeUtilities = {
  primary: {
    text: 'text-primary',
    bg: 'bg-primary',
    border: 'border-primary',
    gradient: 'from-primary to-primary-focus',
    icon: 'bg-gradient-to-br from-primary to-primary-focus',
    badge: 'badge-primary',
    bulletBg: 'bg-primary',
    actionBg: 'bg-primary/20',
  },
  secondary: {
    text: 'text-secondary',
    bg: 'bg-secondary',
    border: 'border-secondary',
    gradient: 'from-secondary to-secondary-focus',
    icon: 'bg-gradient-to-br from-secondary to-secondary-focus',
    badge: 'badge-secondary',
    bulletBg: 'bg-secondary',
    actionBg: 'bg-secondary/20',
  },
  accent: {
    text: 'text-accent',
    bg: 'bg-accent',
    border: 'border-accent',
    gradient: 'from-accent to-accent-focus',
    icon: 'bg-gradient-to-br from-accent to-accent-focus',
    badge: 'badge-accent',
    bulletBg: 'bg-accent',
    actionBg: 'bg-accent/20',
  },
  success: {
    text: 'text-success',
    bg: 'bg-success',
    border: 'border-success',
    gradient: 'from-success to-success-focus',
    icon: 'bg-gradient-to-br from-success to-success-focus',
    badge: 'badge-success',
    bulletBg: 'bg-success',
    actionBg: 'bg-success/20',
  },
  warning: {
    text: 'text-warning',
    bg: 'bg-warning',
    border: 'border-warning',
    gradient: 'from-warning to-warning-focus',
    icon: 'bg-gradient-to-br from-warning to-warning-focus',
    badge: 'badge-warning',
    bulletBg: 'bg-warning',
    actionBg: 'bg-warning/20',
  },
  info: {
    text: 'text-info',
    bg: 'bg-info',
    border: 'border-info',
    gradient: 'from-info to-info-focus',
    icon: 'bg-gradient-to-br from-info to-info-focus',
    badge: 'badge-info',
    bulletBg: 'bg-info',
    actionBg: 'bg-info/20',
  },
  error: {
    text: 'text-error',
    bg: 'bg-error',
    border: 'border-error',
    gradient: 'from-error to-error-focus',
    icon: 'bg-gradient-to-br from-error to-error-focus',
    badge: 'badge-error',
    bulletBg: 'bg-error',
    actionBg: 'bg-error/20',
  },
};
