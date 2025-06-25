"use client";

import React from "react";

export interface ProgressBarProps {
  progress: number; // 0-100
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "info";
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = "primary",
  size = "md",
  showLabel = false,
  className = "",
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress));

  // Size classes
  const sizeClasses = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  // Variant classes
  const variantClasses = {
    primary: "progress-primary",
    secondary: "progress-secondary",
    accent: "progress-accent",
    success: "progress-success",
    warning: "progress-warning",
    error: "progress-error",
    info: "progress-info",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-base-content/70">
            {Math.round(normalizedProgress)}%
          </span>
        </div>
      )}
      <progress
        className={`progress ${variantClasses[variant]} ${sizeClasses[size]} w-full`}
        value={normalizedProgress}
        max="100"
      />
    </div>
  );
};
