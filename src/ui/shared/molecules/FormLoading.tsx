"use client";

import React from "react";

interface FormLoadingProps {
  message?: string;
}

export const FormLoading: React.FC<FormLoadingProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-base-content/70">{message}</p>
    </div>
  );
};
