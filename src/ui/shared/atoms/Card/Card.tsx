'use client';

import React, { ReactNode } from 'react';
import { cardVariants, ColorScheme } from './designSystem';

export interface CardProps {
  variant?: 'default' | 'selectable' | 'path';
  colorScheme?: ColorScheme;
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  hover?: boolean;
  shadow?: boolean;
}

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
  // Determine if the card is interactive
  const isInteractive =
    !disabled && (onClick || variant === 'selectable' || variant === 'path');

  // Generate card classes based on variant and state
  const getCardClasses = (): string => {
    const baseClasses = [];

    // Add variant-specific classes
    if (variant === 'default') {
      baseClasses.push(cardVariants.default);
    } else if (variant === 'selectable') {
      const selectableClasses = isSelected
        ? cardVariants.selectable.selected(colorScheme)
        : cardVariants.selectable.unselected;
      baseClasses.push(selectableClasses);
    } else if (variant === 'path') {
      const pathClasses = cardVariants.path[colorScheme];
      baseClasses.push(pathClasses);

      // Add ring effect for selected path cards (matching PathCard behavior)
      if (isSelected) {
        baseClasses.push('ring-2 ring-primary');
      }
    }

    // Add interactive classes (path variant handles its own cursor and effects)
    if (isInteractive && variant !== 'path') {
      baseClasses.push('cursor-pointer');
      if (hover) {
        baseClasses.push('hover:shadow-md');
      }
    }

    // Add shadow classes (only for non-path variants since path handles its own shadows)
    if (shadow && variant !== 'path') {
      baseClasses.push('shadow-sm');
    }

    // Add disabled classes
    if (disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed');
    }

    // Add custom classes
    if (className) {
      baseClasses.push(className);
    }

    return baseClasses.join(' ');
  };

  const cardClasses = getCardClasses();

  // Handle click events
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!disabled && isInteractive) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={variant === 'selectable' ? isSelected : undefined}
      aria-disabled={disabled}
      data-interactive={isInteractive ? 'true' : undefined}
    >
      {children}
    </div>
  );
};
