import { describe, it, expect } from "vitest";
import { SelectionCounter } from "@/modules/dashboard/workouts/selectionCountingLogic";

describe("Selection Counting Edge Cases", () => {
  it("should handle zero duration", () => {
    const result = SelectionCounter.getFieldSelectionState(
      "customization_duration",
      0
    );
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      "Duration must be between 5 and 300 minutes"
    );
  });

  it("should handle out-of-range energy level", () => {
    const result = SelectionCounter.getFieldSelectionState(
      "customization_energy",
      11
    ); // Max is 6
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Energy level must be between 1 and 6");
  });

  it("should handle valid duration", () => {
    const result = SelectionCounter.getFieldSelectionState(
      "customization_duration",
      30
    );
    expect(result.isValid).toBe(true);
  });

  it("should handle valid energy level", () => {
    const result = SelectionCounter.getFieldSelectionState(
      "customization_energy",
      5
    );
    expect(result.isValid).toBe(true);
  });

  it("should handle valid equipment selections", () => {
    const equipment = ["dumbbells", "bench"];
    const result = SelectionCounter.getFieldSelectionState(
      "customization_equipment",
      equipment
    );
    expect(result.isValid).toBe(true);
  });

  it("should handle empty equipment array", () => {
    const result = SelectionCounter.getFieldSelectionState(
      "customization_equipment",
      []
    );
    expect(result.isValid).toBe(false); // Empty equipment is not valid
  });
});
