'use client';

import React from 'react';
import { Link } from 'react-router';
import { Button } from '../atoms';

interface AuthMethodCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  buttonVariant: 'primary' | 'secondary' | 'accent';
  href: string;
  ariaLabel: string;
}

export const AuthMethodCard: React.FC<AuthMethodCardProps> = ({
  title,
  description,
  buttonLabel,
  buttonVariant,
  href,
  ariaLabel,
}) => {
  return (
    <div className="bg-base-200 shadow-sm rounded-lg">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-base-content/70 mb-2">{description}</p>
        <Link to={href} className="block w-full">
          <Button variant={buttonVariant} fullWidth aria-label={ariaLabel}>
            {buttonLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
};
