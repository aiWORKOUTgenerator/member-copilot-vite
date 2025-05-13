"use client";

import React from "react";

interface ValidationMessageProps {
  message?: string;
  isValid?: boolean;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  isValid = true,
}) => {
  if (isValid || !message) return null;

  return <div className="text-error text-sm mt-1">{message}</div>;
};
