import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { StepIndicator } from "../StepIndicator";

const mockSteps = [
  { id: "step1", label: "Goal & Energy", description: "1 of 2" },
  { id: "step2", label: "Duration & Equipment", description: "2 of 2" },
];

describe("StepIndicator", () => {
  it("renders all steps correctly", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" />);
    
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Goal & Energy")).toBeInTheDocument();
    expect(screen.getByText("Duration & Equipment")).toBeInTheDocument();
  });

  it("shows active step with correct styling", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" />);
    
    const step1Circle = screen.getByText("1").closest("div");
    expect(step1Circle).toHaveClass("bg-primary");
  });

  it("shows inactive step with correct styling", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" />);
    
    const step2Circle = screen.getByText("2").closest("div");
    expect(step2Circle).toHaveClass("bg-base-100");
  });

  it("calls onStepClick when step is clicked", () => {
    const mockOnClick = vi.fn();
    render(
      <StepIndicator 
        steps={mockSteps} 
        currentStep="step1" 
        onStepClick={mockOnClick}
      />
    );
    
    fireEvent.click(screen.getByText("2"));
    expect(mockOnClick).toHaveBeenCalledWith("step2");
  });

  it("does not call onStepClick when disabled", () => {
    const mockOnClick = vi.fn();
    render(
      <StepIndicator 
        steps={mockSteps} 
        currentStep="step1" 
        onStepClick={mockOnClick}
        disabled={true}
      />
    );
    
    fireEvent.click(screen.getByText("2"));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("does not call onStepClick when step is disabled", () => {
    const mockOnClick = vi.fn();
    const stepsWithDisabled = [
      { id: "step1", label: "Goal & Energy", description: "1 of 2" },
      { id: "step2", label: "Duration & Equipment", description: "2 of 2", disabled: true },
    ];
    
    render(
      <StepIndicator 
        steps={stepsWithDisabled} 
        currentStep="step1" 
        onStepClick={mockOnClick}
      />
    );
    
    fireEvent.click(screen.getByText("2"));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("handles keyboard navigation", () => {
    const mockOnClick = vi.fn();
    render(
      <StepIndicator 
        steps={mockSteps} 
        currentStep="step1" 
        onStepClick={mockOnClick}
      />
    );
    
    const step2Circle = screen.getByText("2").closest("div");
    fireEvent.keyDown(step2Circle!, { key: "Enter" });
    expect(mockOnClick).toHaveBeenCalledWith("step2");
  });

  it("shows connectors between steps", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" showConnectors={true} />);
    
    // Check that connector elements are present (they have aria-hidden="true")
    const connectors = screen.getAllByText("", { selector: '[aria-hidden="true"]' });
    expect(connectors.length).toBeGreaterThan(0);
  });

  it("hides connectors when showConnectors is false", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" showConnectors={false} />);
    
    // Should not have any connector elements
    const connectors = screen.queryAllByText("", { selector: '[aria-hidden="true"]' });
    expect(connectors.length).toBe(0);
  });

  it("applies correct size classes", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" size="lg" />);
    
    const step1Circle = screen.getByText("1").closest("div");
    expect(step1Circle).toHaveClass("w-16", "h-16", "text-lg");
  });

  it("shows completed steps with success styling", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step2" />);
    
    const step1Circle = screen.getByText("1").closest("div");
    expect(step1Circle).toHaveClass("bg-success");
  });

  it("has proper accessibility attributes", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" onStepClick={vi.fn()} />);
    
    const step1Circle = screen.getByText("1").closest("div");
    expect(step1Circle).toHaveAttribute("role", "button");
    expect(step1Circle).toHaveAttribute("tabIndex", "0");
    expect(step1Circle).toHaveAttribute("aria-current", "step");
    expect(step1Circle).toHaveAttribute("aria-label", "Step 1: Goal & Energy");
  });

  it("applies correct spacing classes", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" spacing="compact" />);
    
    const container = screen.getByTestId("step-indicator-container");
    expect(container).toHaveClass("mb-6"); // compact container spacing
    
    const stepContainer = screen.getByTestId("step-indicator-steps");
    expect(stepContainer).toHaveClass("space-x-4"); // compact step gap
  });

  it("applies default spacing when not specified", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" />);
    
    const container = screen.getByTestId("step-indicator-container");
    expect(container).toHaveClass("mb-8"); // default container spacing
    
    const stepContainer = screen.getByTestId("step-indicator-steps");
    expect(stepContainer).toHaveClass("space-x-6"); // default step gap
  });

  it("applies spacious spacing when specified", () => {
    render(<StepIndicator steps={mockSteps} currentStep="step1" spacing="spacious" />);
    
    const container = screen.getByTestId("step-indicator-container");
    expect(container).toHaveClass("mb-12"); // spacious container spacing
    
    const stepContainer = screen.getByTestId("step-indicator-steps");
    expect(stepContainer).toHaveClass("space-x-8"); // spacious step gap
  });
}); 