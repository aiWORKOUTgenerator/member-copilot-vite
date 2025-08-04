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

    // Check that step indicator is present (only one instance in quick mode)
    expect(screen.getByTestId("step-indicator-container")).toBeInTheDocument();
    expect(screen.getByTestId("step-indicator-steps")).toBeInTheDocument();
  });

  it("should render workout goal options", () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Check that workout goal options are rendered (one instance each)
    expect(screen.getByText("Energizing Boost")).toBeInTheDocument();
    expect(screen.getByText("Improve Posture")).toBeInTheDocument();
    expect(screen.getByText("Stress Reduction")).toBeInTheDocument();
    expect(screen.getByText("Quick Sweat")).toBeInTheDocument();
    expect(screen.getByText("Gentle Recovery & Mobility")).toBeInTheDocument();
    expect(screen.getByText("Core & Abs Focus")).toBeInTheDocument();
  });

  it("should render energy level options", () => {
    render(
      <BrowserRouter>
        <GeneratePage />
      </BrowserRouter>
    );

    // Check that energy level options are rendered (one instance each)
    expect(screen.getByText("Very Low")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("Somewhat High")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Very High")).toBeInTheDocument();
  });
});
