"use client";

import React from "react";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

interface IconProps {
  size?: IconSize;
  className?: string;
}

// Size mappings for the icons based on DaisyUI standards
const sizeMap: Record<IconSize, string> = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
};

export const ErrorIcon: React.FC<IconProps> = ({
  size = "md",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`stroke-current ${sizeMap[size]} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const SuccessIcon: React.FC<IconProps> = ({
  size = "md",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`stroke-current ${sizeMap[size]} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({
  size = "md",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className={`stroke-current ${sizeMap[size]} ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export const WarningIcon: React.FC<IconProps> = ({
  size = "md",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`stroke-current ${sizeMap[size]} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);
