"use client";

import React from "react";

// Common icon sizes
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

// Props for the Icon component
export interface IconProps {
  // Icon component from Heroicons
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  // Icon size
  size?: IconSize | number;
  // Additional class names
  className?: string;
  // Solid or outline style (defaults to outline) - for documentation purposes
  // The actual solid/outline version is determined by which import you use from Heroicons
  solid?: boolean;
  // Optional aria-label for accessibility
  ariaLabel?: string;
}

/**
 * A flexible Icon component that wraps Heroicons.
 *
 * Usage with Heroicons:
 * <Icon icon={HomeIcon} size="md" />
 * <Icon icon={HomeIcon} size="md" solid />
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = "md",
  className = "",
  ariaLabel,
}) => {
  // Map size names to pixel values
  const sizeMap: Record<IconSize, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };

  // Determine width and height
  const dimensions = typeof size === "string" ? sizeMap[size] : size;

  if (!IconComponent) {
    return null;
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dimensions,
        height: dimensions,
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <IconComponent
        aria-hidden="true"
        width={dimensions}
        height={dimensions}
        className={`w-${dimensions} h-${dimensions}`}
      />
    </span>
  );
};
