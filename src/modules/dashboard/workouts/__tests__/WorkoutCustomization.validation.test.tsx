import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WorkoutCustomization from "../components/WorkoutCustomization";
import { VALIDATION_MESSAGES } from "../constants/validationMessages";
import { PerWorkoutOptions } from "../components/types";

describe("WorkoutCustomization Validation", () => {
  const defaultProps = {
    options: {} as PerWorkoutOptions,
    onChange: () => {},
    errors: {},
    mode: "quick" as const,
    activeQuickStep: "focus-energy" as const,
    onQuickStepChange: () => {},
  };

  describe("Focus & Energy Step", () => {
    it("shows no errors initially with empty selections", () => {
      render(<WorkoutCustomization {...defaultProps} />);
      
      // Should not show any validation messages
      const energyError = screen.queryByText(VALIDATION_MESSAGES.ENERGY_REQUIRED);
      const focusError = screen.queryByText(VALIDATION_MESSAGES.FOCUS_REQUIRED);
      
      expect(energyError).not.toBeInTheDocument();
      expect(focusError).not.toBeInTheDocument();
    });

    it("shows energy validation when only focus is selected", () => {
      const options: PerWorkoutOptions = {
        customization_focus: "energizing_boost",
      };

      render(<WorkoutCustomization {...defaultProps} options={options} />);
      
      const energyError = screen.getByText(VALIDATION_MESSAGES.ENERGY_REQUIRED);
      expect(energyError).toBeInTheDocument();
    });

    it("shows focus validation when only energy is selected", () => {
      const options: PerWorkoutOptions = {
        customization_energy: 4,
      };

      render(<WorkoutCustomization {...defaultProps} options={options} />);
      
      const focusError = screen.getByText(VALIDATION_MESSAGES.FOCUS_REQUIRED);
      expect(focusError).toBeInTheDocument();
    });

    it("shows no errors when both focus and energy are selected", () => {
      const options: PerWorkoutOptions = {
        customization_focus: "energizing_boost",
        customization_energy: 4,
      };

      render(<WorkoutCustomization {...defaultProps} options={options} />);
      
      const energyError = screen.queryByText(VALIDATION_MESSAGES.ENERGY_REQUIRED);
      const focusError = screen.queryByText(VALIDATION_MESSAGES.FOCUS_REQUIRED);
      
      expect(energyError).not.toBeInTheDocument();
      expect(focusError).not.toBeInTheDocument();
    });
  });

  describe("Duration & Equipment Step", () => {
    const durationEquipmentProps = {
      ...defaultProps,
      activeQuickStep: "duration-equipment" as const,
    };

    it("shows no errors initially with empty selections", () => {
      render(<WorkoutCustomization {...durationEquipmentProps} />);
      
      const durationError = screen.queryByText(VALIDATION_MESSAGES.DURATION_REQUIRED);
      const equipmentError = screen.queryByText(VALIDATION_MESSAGES.EQUIPMENT_REQUIRED);
      
      expect(durationError).not.toBeInTheDocument();
      expect(equipmentError).not.toBeInTheDocument();
    });

    it("shows equipment validation when only duration is selected", () => {
      const options: PerWorkoutOptions = {
        customization_duration: 30,
      };

      render(<WorkoutCustomization {...durationEquipmentProps} options={options} />);
      
      const equipmentError = screen.getByText(VALIDATION_MESSAGES.EQUIPMENT_REQUIRED);
      expect(equipmentError).toBeInTheDocument();
    });

    it("shows duration validation when only equipment is selected", () => {
      const options: PerWorkoutOptions = {
        customization_equipment: ["bodyweight"],
      };

      render(<WorkoutCustomization {...durationEquipmentProps} options={options} />);
      
      const durationError = screen.getByText(VALIDATION_MESSAGES.DURATION_REQUIRED);
      expect(durationError).toBeInTheDocument();
    });

    it("shows no errors when both duration and equipment are selected", () => {
      const options: PerWorkoutOptions = {
        customization_duration: 30,
        customization_equipment: ["bodyweight"],
      };

      render(<WorkoutCustomization {...durationEquipmentProps} options={options} />);
      
      const durationError = screen.queryByText(VALIDATION_MESSAGES.DURATION_REQUIRED);
      const equipmentError = screen.queryByText(VALIDATION_MESSAGES.EQUIPMENT_REQUIRED);
      
      expect(durationError).not.toBeInTheDocument();
      expect(equipmentError).not.toBeInTheDocument();
    });
  });

  describe("Range Validation", () => {
    it("shows energy range error for invalid energy level", () => {
      const options: PerWorkoutOptions = {
        customization_energy: 7, // Invalid: > 6
      };

      render(<WorkoutCustomization {...defaultProps} options={options} errors={{
        customization_energy: VALIDATION_MESSAGES.ENERGY_RANGE
      }} />);
      
      const rangeError = screen.getByText(VALIDATION_MESSAGES.ENERGY_RANGE);
      expect(rangeError).toBeInTheDocument();
    });

    it("shows duration range error for invalid duration", () => {
      const options: PerWorkoutOptions = {
        customization_duration: 60, // Invalid: > 45
      };

      render(
        <WorkoutCustomization 
          {...defaultProps} 
          options={options} 
          errors={{
            customization_duration: VALIDATION_MESSAGES.DURATION_RANGE
          }}
          activeQuickStep="duration-equipment"
        />
      );
      
      const rangeError = screen.getByText(VALIDATION_MESSAGES.DURATION_RANGE);
      expect(rangeError).toBeInTheDocument();
    });
  });
});