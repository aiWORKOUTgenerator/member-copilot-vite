'use client';

import { Button, ButtonVariant } from '../atoms';
import { useAuth } from '@/hooks/auth';
import React from 'react';
import { SignOutIcon } from '../atoms/IconSet';

interface SignOutButtonProps {
  variant?: ButtonVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  redirectPath?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * A reusable sign out button that handles sign out functionality
 * and provides visual feedback during the process
 */
export const SignOutButton: React.FC<SignOutButtonProps> = ({
  variant = 'danger',
  size = 'md',
  className = '',
  redirectPath = '/',
  showIcon = true,
  children,
}) => {
  const { isSigningOut, signOut } = useAuth();

  const handleSignOut = () => {
    signOut(redirectPath);
  };

  return (
    <Button
      variant={variant as ButtonVariant}
      size={size}
      className={`${className}`}
      onClick={handleSignOut}
      disabled={isSigningOut}
      aria-label="Sign out"
    >
      <div className="flex items-center">
        {showIcon && <SignOutIcon size={size} className="mr-2" />}
        {children || 'Sign out'}
        {isSigningOut && (
          <span className="loading loading-spinner loading-xs ml-2"></span>
        )}
      </div>
    </Button>
  );
};
