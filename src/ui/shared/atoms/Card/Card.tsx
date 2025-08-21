'use client';

import React, { ReactNode } from 'react';
import { cardVariants } from './designSystem';

export interface CardProps {
  /** Visual variant of the card */
  variant?: 'default' | 'selectable' | 'path';
  /** Color scheme for the card */
  colorScheme?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'info';
  /** Whether the card is selected (for selectable variant) */
  isSelected?: boolean;
  /** Click handler for the card */
  onClick?: () => void;
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Whether to show shadow */
  shadow?: boolean;
}

/**
 * Card - A foundational card component for consistent card styling across the application
 *
 * This component provides a unified card interface with different variants for various use cases.
 * It handles consistent styling, hover effects, selection states, and accessibility.
 *
 * @example
 * // Default card
 * <Card>
 *   <div>Card content</div>
 * </Card>
 *
 * @example
 * // Selectable card
 * <Card
 *   variant="selectable"
 *   colorScheme="primary"
 *   isSelected={true}
 *   onClick={handleSelect}
 * >
 *   <div>Selectable content</div>
 * </Card>
 *
 * @example
 * // Path card
 * <Card
 *   variant="path"
 *   colorScheme="primary"
 *   onClick={handlePathSelect}
 * >
 *   <div>Path content</div>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  colorScheme = 'primary',
  isSelected = false,
  onClick,
  children,
  className = '',
  disabled = false,
  hover = true,
  shadow = true,
}) => {
  // Get the appropriate variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'selectable':
        return isSelected
          ? cardVariants.selectable.selected(colorScheme)
          : cardVariants.selectable.unselected;
      case 'path':
        return cardVariants.path[colorScheme];
      default:
        return cardVariants.default;
    }
  };

  // Get interaction classes
  const getInteractionClasses = () => {
    if (disabled) return 'cursor-not-allowed opacity-50';
    if (!onClick) return '';

    const baseClasses = 'cursor-pointer transition-all duration-200';
    const hoverClasses = hover ? 'hover:shadow-md hover:scale-[1.02]' : '';
    return `${baseClasses} ${hoverClasses}`;
  };

  // Get shadow classes
  const getShadowClasses = () => {
    if (!shadow) return '';
    return 'shadow-sm';
  };

  // Combine all classes
  const cardClasses = [
    'card',
    getVariantClasses(),
    getInteractionClasses(),
    getShadowClasses(),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle click events
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Determine if card is interactive
  const isInteractive = !disabled && !!onClick;

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={variant === 'selectable' ? isSelected : undefined}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};
