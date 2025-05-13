"use client";

import React from "react";
import { useUserAccess } from "@/hooks/useUserAccess";

interface AccessAwareComponentProps {
  /**
   * The content to render once access data is loaded
   */
  children: React.ReactNode;

  /**
   * Whether to show a skeleton loader while data is loading
   */
  showSkeleton?: boolean;

  /**
   * Height class for the skeleton loader (e.g., "h-10")
   */
  skeletonHeight?: string;

  /**
   * Width class for the skeleton loader (e.g., "w-full")
   */
  skeletonWidth?: string;

  /**
   * Additional classes to apply to the skeleton
   */
  skeletonClassName?: string;

  /**
   * Content to show when data is loading and showSkeleton is false
   */
  fallback?: React.ReactNode;
}

/**
 * A component that only renders its children when user access data is fully loaded.
 * Optionally shows a skeleton loader or fallback content during loading.
 */
const AccessAwareComponent: React.FC<AccessAwareComponentProps> = ({
  children,
  showSkeleton = true,
  skeletonClassName = "",
  fallback = null,
}) => {
  const { isLoading } = useUserAccess();

  if (isLoading) {
    if (showSkeleton) {
      return <div className={`skeleton ${skeletonClassName}`}></div>;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AccessAwareComponent;
