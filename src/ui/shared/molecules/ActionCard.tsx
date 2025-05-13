"use client";
import { ReactNode } from "react";

interface ActionCardProps {
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
  icon?: ReactNode;
  badgeText?: string;
  badgeColor?: string;
}

export function ActionCard({
  title,
  description,
  actionText,
  onClick,
  icon,
  badgeText,
  badgeColor = "badge-secondary",
}: ActionCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title flex justify-between items-center">
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
            {badgeText && (
              <div className={`badge ${badgeColor} ml-2`}>{badgeText}</div>
            )}
          </div>
        </h2>
        <p>{description}</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary" onClick={onClick}>
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
