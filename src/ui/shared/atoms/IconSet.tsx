'use client';

import React from 'react';
import { Icon, IconProps, IconSize } from './Icon';
import {
  ArrowRightIcon as HeroArrowRightIcon,
  ArrowDownIcon as HeroArrowDownIcon,
  CheckIcon as HeroCheckIcon,
  XMarkIcon as HeroCloseIcon,
  Bars3Icon as HeroMenuIcon,
  UserIcon as HeroUserIcon,
  InformationCircleIcon as HeroInfoIcon,
  ExclamationCircleIcon as HeroErrorIcon,
  CheckCircleIcon as HeroSuccessIcon,
  HomeIcon as HeroHomeIcon,
  Squares2X2Icon as HeroDashboardIcon,
  DocumentIcon as HeroFileIcon,
  ArrowLeftOnRectangleIcon as HeroSignOutIcon,
} from '@heroicons/react/24/outline';

/**
 * Collection of reusable icon components using Heroicons
 *
 * Usage:
 * <ArrowRightIcon size="md" className="text-primary" />
 */

export const ArrowRightIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroArrowRightIcon} {...props} />
);

export const ArrowDownIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroArrowDownIcon} {...props} />
);

export const CheckIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroCheckIcon} {...props} />
);

export const CloseIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroCloseIcon} {...props} />
);

export const MenuIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroMenuIcon} {...props} />
);

export const UserIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroUserIcon} {...props} />
);

export const InfoIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroInfoIcon} {...props} />
);

export const ErrorIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroErrorIcon} {...props} />
);

export const SuccessIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon
    icon={HeroSuccessIcon}
    {...props}
    className={`text-success ${props.className || ''}`}
  />
);

export const HomeIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroHomeIcon} {...props} />
);

export const DashboardIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroDashboardIcon} {...props} />
);

export const FileIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroFileIcon} {...props} />
);

// Google icon is a special case, so we'll keep it as is for now
// The heroicons library doesn't have a Google icon
export const GoogleIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => {
  // Map size names to pixel values
  const sizeMap: Record<IconSize, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };

  // Determine width and height
  const dimensions =
    typeof props.size === 'string' && props.size in sizeMap
      ? sizeMap[props.size as IconSize]
      : props.size || 24;

  return (
    <span
      className={props.className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensions,
        height: dimensions,
      }}
      role="img"
      aria-label={props.ariaLabel || 'Google'}
    >
      <svg viewBox="0 0 24 24" width={dimensions} height={dimensions}>
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    </span>
  );
};

export const SignOutIcon: React.FC<Omit<IconProps, 'icon'>> = (props) => (
  <Icon icon={HeroSignOutIcon} {...props} />
);
