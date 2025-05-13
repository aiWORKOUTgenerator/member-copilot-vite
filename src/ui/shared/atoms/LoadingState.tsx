"use client";

import React from "react";

interface LoadingStateProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

/**
 * A loading state component that displays animated dots
 */
export default function LoadingState({
  className = "",
  size = "xl",
}: LoadingStateProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <span className={`loading loading-dots loading-${size}`}></span>
    </div>
  );
}
