"use client";

import React, { useState } from "react";

export interface CouponCodeProps {
  code: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "accent" | "success";
  showCopyButton?: boolean;
  className?: string;
}

export const CouponCode: React.FC<CouponCodeProps> = ({
  code,
  size = "md",
  variant = "primary",
  showCopyButton = true,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-2",
    lg: "text-lg px-4 py-3",
  };

  // Variant classes for background
  const variantClasses = {
    primary: "bg-primary/10 border-primary text-primary",
    secondary: "bg-secondary/10 border-secondary text-secondary",
    accent: "bg-accent/10 border-accent text-accent",
    success: "bg-success/10 border-success text-success",
  };

  const buttonSizeClasses = {
    sm: "btn-xs",
    md: "btn-sm",
    lg: "btn-md",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <code
        className={`
          font-mono font-bold rounded border-2 border-dashed
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
        `}
      >
        {code}
      </code>

      {showCopyButton && (
        <button
          onClick={handleCopy}
          className={`btn ${copied ? "btn-success" : "btn-ghost"} ${
            buttonSizeClasses[size]
          }`}
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};
