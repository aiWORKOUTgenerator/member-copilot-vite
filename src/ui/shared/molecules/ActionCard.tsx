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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-200/20 via-base-100/10 to-base-200/5 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl"></div>

      <div className="relative z-10 p-6">
        <h2 className="text-lg font-bold flex justify-between items-center mb-3">
          <div className="flex items-center">
            {icon && (
              <span className="mr-3 p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md group-hover:scale-110 transition-transform duration-200">
                {icon}
              </span>
            )}
            <span className="text-base-content group-hover:text-primary transition-colors duration-200">
              {title}
            </span>
            {badgeText && (
              <div
                className={`badge ${badgeColor} ml-3 whitespace-nowrap shadow-sm backdrop-blur-sm`}
              >
                {badgeText}
              </div>
            )}
          </div>
        </h2>
        <p className="text-base-content/80 mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex justify-end">
          <button
            className="btn btn-primary bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transform hover:scale-105 transition-all duration-200 border-0"
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
