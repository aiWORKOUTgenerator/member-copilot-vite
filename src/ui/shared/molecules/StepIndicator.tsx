"use client";

import React from "react";
import { SPACING_TOKENS, type StepIndicatorSpacing } from "../tokens";

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
  spacing?: StepIndicatorSpacing;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  disabled = false,
  showConnectors = true,
  size = "md",
  spacing = "default",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          circle: "w-8 h-8 text-xs",
          label: "text-xs",
          description: "text-xs",
          connector: "w-6 h-0.5",
        };
      case "lg":
        return {
          circle: "w-16 h-16 text-lg",
          label: "text-base",
          description: "text-sm",
          connector: "w-12 h-1",
        };
      default: // md
        return {
          circle: "w-12 h-12 text-sm",
          label: "text-sm",
          description: "text-xs",
          connector: "w-8 h-0.5",
        };
    }
  };

  const getVariantClasses = (isActive: boolean, isCompleted: boolean, hasErrors: boolean) => {
    const baseClasses = "rounded-full flex items-center justify-center font-semibold border-2 transition-all";
    
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

  const sizeClasses = getSizeClasses();
  
  // Get spacing configuration from design tokens
  const spacingConfig = {
    container: SPACING_TOKENS.stepIndicator.container[spacing],
    stepGap: SPACING_TOKENS.stepIndicator.stepGap[spacing],
    labelSpacing: SPACING_TOKENS.stepIndicator.labelSpacing[spacing],
  };

  return (
    <div className={`flex justify-center ${spacingConfig.container}`} data-testid="step-indicator-container">
      <div className={`flex items-center ${spacingConfig.stepGap}`} data-testid="step-indicator-steps">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
          const isClickable = onStepClick && !disabled && !step.disabled;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className={`${sizeClasses.circle} ${getVariantClasses(isActive, isCompleted, step.hasErrors || false)} ${
                    isClickable ? "cursor-pointer hover:scale-105" : ""
                  }`}
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
                    className={`absolute top-1/2 left-full ${sizeClasses.connector} bg-base-300 transform -translate-y-1/2`}
                    aria-hidden="true"
                  />
                )}
              </div>
              
              <div className={`${spacingConfig.labelSpacing} text-center`}>
                <div className={`${sizeClasses.label} font-medium text-base-content`}>
                  {step.label}
                </div>
                {step.description && step.description !== `${index + 1} of ${steps.length}` && (
                  <div className={`${sizeClasses.description} text-base-content/70`}>
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