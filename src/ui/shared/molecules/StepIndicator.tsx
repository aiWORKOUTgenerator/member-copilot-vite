"use client";

import React from "react";

export interface Step {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  hasErrors?: boolean; // New prop for validation state
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
  disabled?: boolean;
  showConnectors?: boolean;
  size?: "sm" | "md" | "lg";
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  disabled = false,
  showConnectors = true,
  size = "md",
}) => {
  const getVariantClasses = (
    isActive: boolean,
    isCompleted: boolean,
    hasErrors: boolean,
  ) => {
    const baseClasses =
      "rounded-full flex items-center justify-center font-semibold border-2 transition-all";

    if (hasErrors) {
      return `${baseClasses} bg-error text-error-content border-error`;
    }

    if (isActive) {
      return `${baseClasses} bg-primary text-primary-content border-primary`;
    }

    if (isCompleted) {
      return `${baseClasses} bg-success text-success-content border-success`;
    }

    return `${baseClasses} bg-base-100 text-base-content/70 border-base-300`;
  };

  return (
    <div
      className="flex justify-center p-4"
      data-testid="step-indicator-container"
    >
      <div
        className={`flex items-center ${
          size === "sm"
            ? "gap-[var(--spacing-step-gap-sm)]"
            : size === "lg"
              ? "gap-[var(--spacing-step-gap-lg)]"
              : "gap-[var(--spacing-step-gap-md)]"
        }`}
        data-testid="step-indicator-steps"
      >
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted =
            steps.findIndex((s) => s.id === currentStep) > index;
          const isClickable = onStepClick && !disabled && !step.disabled;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className={`${
                    size === "sm"
                      ? "w-[var(--size-step-sm)] h-[var(--size-step-sm)] text-[var(--text-step-sm)]"
                      : size === "lg"
                        ? "w-[var(--size-step-lg)] h-[var(--size-step-lg)] text-[var(--text-step-lg)]"
                        : "w-[var(--size-step-md)] h-[var(--size-step-md)] text-[var(--text-step-md)]"
                  } ${getVariantClasses(
                    isActive,
                    isCompleted,
                    step.hasErrors || false,
                  )} ${isClickable ? "cursor-pointer hover:scale-105" : ""}`}
                  onClick={() => isClickable && onStepClick(step.id)}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                  aria-current={isActive ? "step" : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onStepClick(step.id);
                    }
                  }}
                >
                  {index + 1}
                </div>

                {/* Connector line to next step */}
                {showConnectors && index < steps.length - 1 && (
                  <div
                    className={`absolute top-1/2 left-full ${
                      size === "sm"
                        ? "w-[var(--width-connector-sm)]"
                        : size === "lg"
                          ? "w-[var(--width-connector-lg)]"
                          : "w-[var(--width-connector-md)]"
                    } h-0.5 bg-base-300 transform -translate-y-1/2`}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div
                className={`${
                  size === "sm"
                    ? "mt-[var(--spacing-label-sm)]"
                    : size === "lg"
                      ? "mt-[var(--spacing-label-lg)]"
                      : "mt-[var(--spacing-label-md)]"
                } text-center`}
              >
                <div
                  className={`${
                    size === "sm"
                      ? "text-xs"
                      : size === "lg"
                        ? "text-base"
                        : "text-sm"
                  } font-medium text-base-content`}
                >
                  {step.label}
                </div>
                {step.description &&
                  step.description !== `${index + 1} of ${steps.length}` && (
                    <div
                      className={`${
                        size === "sm"
                          ? "text-xs"
                          : size === "lg"
                            ? "text-sm"
                            : "text-xs"
                      } text-base-content/70`}
                    >
                      {step.description}
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
