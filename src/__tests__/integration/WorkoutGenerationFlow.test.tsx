import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router";
import GeneratePage from "@/modules/dashboard/workouts/GeneratePage";

// Mock the useGeneratedWorkouts hook directly
vi.mock("@/hooks/useGeneratedWorkouts", () => ({
  useGeneratedWorkouts: () => ({
    workouts: [],
    isLoading: false,
    error: null,
    createWorkout: vi.fn(),
    refetch: vi.fn(),
  }),
}));

// Mock analytics to avoid tracking in tests
vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    track: vi.fn(),
  }),
}));

describe("Workout Generation Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render workout generation page", () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Check that the main page elements are rendered
    expect(screen.getByText("Generate a New Workout")).toBeInTheDocument();
    expect(screen.getAllByText("Quick Workout Setup")).toHaveLength(2); // Button and heading
    expect(screen.getByText("Detailed Workout Setup")).toBeInTheDocument();
    expect(screen.getByText("Focus & Energy")).toBeInTheDocument();
    expect(screen.getByText("Duration & Equipment")).toBeInTheDocument();
  });

  it("should render step indicator", () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Check that step indicator is present (multiple instances expected)
    const stepIndicatorContainers = screen.getAllByTestId(
      "step-indicator-container"
    );
    expect(stepIndicatorContainers.length).toBeGreaterThan(0);

    const stepIndicatorSteps = screen.getAllByTestId("step-indicator-steps");
    expect(stepIndicatorSteps.length).toBeGreaterThan(0);
  });

  it("should render workout goal options", () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Check that workout goal options are rendered (multiple instances expected)
    const energizingBoostElements = screen.getAllByText("Energizing Boost");
    expect(energizingBoostElements.length).toBeGreaterThan(0);

    const improvePostureElements = screen.getAllByText("Improve Posture");
    expect(improvePostureElements.length).toBeGreaterThan(0);

    const stressReductionElements = screen.getAllByText("Stress Reduction");
    expect(stressReductionElements.length).toBeGreaterThan(0);

    const quickSweatElements = screen.getAllByText("Quick Sweat");
    expect(quickSweatElements.length).toBeGreaterThan(0);

    const gentleRecoveryElements = screen.getAllByText(
      "Gentle Recovery & Mobility"
    );
    expect(gentleRecoveryElements.length).toBeGreaterThan(0);

    const coreAbsElements = screen.getAllByText("Core & Abs Focus");
    expect(coreAbsElements.length).toBeGreaterThan(0);
  });

  it("should render energy level options", () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Check that energy level options are rendered (multiple instances expected)
    const veryLowElements = screen.getAllByText("Very Low");
    expect(veryLowElements.length).toBeGreaterThan(0);

    const lowElements = screen.getAllByText("Low");
    expect(lowElements.length).toBeGreaterThan(0);

    const moderateElements = screen.getAllByText("Moderate");
    expect(moderateElements.length).toBeGreaterThan(0);

    const somewhatHighElements = screen.getAllByText("Somewhat High");
    expect(somewhatHighElements.length).toBeGreaterThan(0);

    const highElements = screen.getAllByText("High");
    expect(highElements.length).toBeGreaterThan(0);

    const veryHighElements = screen.getAllByText("Very High");
    expect(veryHighElements.length).toBeGreaterThan(0);
  });
});
