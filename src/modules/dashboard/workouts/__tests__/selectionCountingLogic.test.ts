import { describe, it, expect } from "vitest";
import { SelectionCounter } from "../selectionCountingLogic";
import { VALIDATION_MESSAGES } from "../constants/validationMessages";
import { PerWorkoutOptions } from "../components/types";

describe("SelectionCounter", () => {
  describe("getFieldSelectionState", () => {
    describe("Energy Level Validation", () => {
      it("validates energy level within range", () => {
        const validState = SelectionCounter.getFieldSelectionState(
          "customization_energy",
          4
        );
        expect(validState.isValid).toBe(true);
        expect(validState.hasValue).toBe(true);
        expect(validState.errorMessage).toBeUndefined();
      });

      it("detects energy level below minimum", () => {
        const invalidState = SelectionCounter.getFieldSelectionState(
          "customization_energy",
          0
        );
        expect(invalidState.isValid).toBe(false);
        expect(invalidState.hasValue).toBe(false);
        expect(invalidState.errorMessage).toBe(
          VALIDATION_MESSAGES.ENERGY_RANGE
        );
      });

      it("detects energy level above maximum", () => {
        const invalidState = SelectionCounter.getFieldSelectionState(
          "customization_energy",
          7
        );
        expect(invalidState.isValid).toBe(false);
        expect(invalidState.hasValue).toBe(true);
        expect(invalidState.errorMessage).toBe(
          VALIDATION_MESSAGES.ENERGY_RANGE
        );
      });
    });

    describe("Duration Validation", () => {
      it("validates duration within range", () => {
        const validState = SelectionCounter.getFieldSelectionState(
          "customization_duration",
          30
        );
        expect(validState.isValid).toBe(true);
        expect(validState.hasValue).toBe(true);
        expect(validState.errorMessage).toBeUndefined();
      });

      it("detects duration below minimum", () => {
        const invalidState = SelectionCounter.getFieldSelectionState(
          "customization_duration",
          3
        );
        expect(invalidState.isValid).toBe(false);
        expect(invalidState.hasValue).toBe(true);
        expect(invalidState.errorMessage).toBe(
          VALIDATION_MESSAGES.DURATION_RANGE
        );
      });

      it("detects duration above maximum", () => {
        const invalidState = SelectionCounter.getFieldSelectionState(
          "customization_duration",
          50
        );
        expect(invalidState.isValid).toBe(false);
        expect(invalidState.hasValue).toBe(true);
        expect(invalidState.errorMessage).toBe(
          VALIDATION_MESSAGES.DURATION_RANGE
        );
      });
    });

    describe("Equipment Validation", () => {
      it("validates valid equipment selection", () => {
        const validState = SelectionCounter.getFieldSelectionState(
          "customization_equipment",
          ["bodyweight"]
        );
        expect(validState.isValid).toBe(true);
        expect(validState.hasValue).toBe(true);
      });

      it("detects invalid equipment selection", () => {
        const invalidState = SelectionCounter.getFieldSelectionState(
          "customization_equipment",
          ["invalid_equipment"]
        );
        expect(invalidState.isValid).toBe(false);
        expect(invalidState.hasValue).toBe(true);
      });
    });
  });

  describe("Step Validation", () => {
    describe("getFocusEnergySelections", () => {
      it("validates complete focus and energy selections", () => {
        const options: PerWorkoutOptions = {
          customization_focus: "energizing_boost",
          customization_energy: 4,
        };

        const state = SelectionCounter.getFocusEnergySelections(options);
        expect(state.isComplete).toBe(true);
        expect(state.canProceed).toBe(true);
        expect(state.total).toBe(2);
      });

      it("detects partial focus and energy selections", () => {
        const options: PerWorkoutOptions = {
          customization_focus: "energizing_boost",
        };

        const state = SelectionCounter.getFocusEnergySelections(options);
        expect(state.isComplete).toBe(false);
        expect(state.isPartial).toBe(true);
        expect(state.total).toBe(1);
      });
    });

    describe("getDurationEquipmentSelections", () => {
      it("validates complete duration and equipment selections", () => {
        const options: PerWorkoutOptions = {
          customization_duration: 30,
          customization_equipment: ["bodyweight"],
        };

        const state = SelectionCounter.getDurationEquipmentSelections(options);
        expect(state.isComplete).toBe(true);
        expect(state.canProceed).toBe(true);
        expect(state.total).toBe(2);
      });

      it("detects partial duration and equipment selections", () => {
        const options: PerWorkoutOptions = {
          customization_duration: 30,
        };

        const state = SelectionCounter.getDurationEquipmentSelections(options);
        expect(state.isComplete).toBe(false);
        expect(state.isPartial).toBe(true);
        expect(state.total).toBe(1);
      });
    });
  });
});
