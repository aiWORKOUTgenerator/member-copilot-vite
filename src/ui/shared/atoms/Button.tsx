'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'ghost'
  | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  outline?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  isLoading = false,
  outline = false,
  disabled,
  ...props
}) => {
  // DaisyUI classes
  const baseClasses = 'btn';

  // Variant classes
  const variantClass =
    variant !== 'ghost' && variant !== 'link'
      ? `btn-${variant}`
      : variant === 'ghost'
        ? 'btn-ghost'
        : 'btn-link';

  // Size classes
  const sizeClass = size !== 'md' ? `btn-${size}` : '';

  // Width classes
  const widthClass = fullWidth ? 'w-full' : '';

  // Outline class
  const outlineClass = outline ? 'btn-outline' : '';

  // Loading state
  const loadingClass = isLoading ? 'loading' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClass}
        ${sizeClass}
        ${widthClass}
        ${outlineClass}
        ${loadingClass}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
};
