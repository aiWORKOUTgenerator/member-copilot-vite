'use client';
import { ReactNode } from 'react';

interface ActionCardProps {
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
  icon?: ReactNode;
  badgeText?: string;
  badgeColor?: string;
  actionCardIsDisabled?: boolean;
}

export function ActionCard({
  title,
  description,
  actionText,
  onClick,
  icon,
  badgeText,
  badgeColor = 'badge-secondary',
  actionCardIsDisabled = false,
}: ActionCardProps) {
  return (
    <div className="bg-base-100 shadow-sm rounded-lg">
      <div className="p-4">
        <h2 className="text-lg font-semibold flex justify-between items-center">
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
            {badgeText && (
              <div className={`badge ${badgeColor} ml-2 whitespace-nowrap`}>
                {badgeText}
              </div>
            )}
          </div>
        </h2>
        <p>{description}</p>
        <div className="justify-end card-actions">
          <button
            className="btn btn-primary"
            onClick={onClick}
            disabled={actionCardIsDisabled}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
