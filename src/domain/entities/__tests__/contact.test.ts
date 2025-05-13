import { Contact, ContactUtils } from "../contact";

describe("ContactUtils", () => {
  describe("getAttributeCompletionStatus", () => {
    // Define test fixtures
    const mockAttributeTypes = [
      { id: 1, name: "Goals", description: "Your fitness goals" },
      { id: 2, name: "Injuries", description: "Your injuries and limitations" },
      { id: 3, name: "Equipment", description: "Available equipment" },
    ];

    const mockPrompts = [
      // Goals prompts
      { attributeType: { id: 1 }, variableName: "fitness_goal" },
      { attributeType: { id: 1 }, variableName: "weight_goal" },
      { attributeType: { id: 1 }, variableName: "target_weight" },

      // Injuries prompts
      { attributeType: { id: 2 }, variableName: "has_injuries" },
      { attributeType: { id: 2 }, variableName: "injury_details" },

      // Equipment prompts
      { attributeType: { id: 3 }, variableName: "has_equipment" },
      { attributeType: { id: 3 }, variableName: "equipment_list" },

      // Prompt with no attribute type
      { attributeType: null, variableName: "other_info" },
    ];

    test("should return empty array when contact is null", () => {
      const result = ContactUtils.getAttributeCompletionStatus(
        null,
        mockAttributeTypes,
        mockPrompts
      );

      expect(result).toEqual([]);
    });

    test("should correctly calculate completion with no attributes filled", () => {
      const mockContact: Contact = {
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        phone_number: "123456789",
        source: "web",
        status: "active",
        attributes: {},
        registration_status: "complete",
        workout_count: 0,
        last_workout_date: "",
      };

      const result = ContactUtils.getAttributeCompletionStatus(
        mockContact,
        mockAttributeTypes,
        mockPrompts
      );

      // Should have one completion status per attribute type
      expect(result.length).toBe(3);

      // All should have 0 completed
      result.forEach((completion) => {
        expect(completion.hasProvidedValue).toBe(false);
        expect(completion.completedPrompts).toBe(0);
        expect(completion.percentComplete).toBe(0);
      });

      // Verify specific totals
      expect(result[0].totalPrompts).toBe(3); // Goals
      expect(result[1].totalPrompts).toBe(2); // Injuries
      expect(result[2].totalPrompts).toBe(2); // Equipment
    });

    test("should correctly calculate completion with some attributes filled", () => {
      const mockContact: Contact = {
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        phone_number: "123456789",
        source: "web",
        status: "active",
        attributes: {
          // Goals - 2/3 completed
          fitness_goal: "Lose weight",
          weight_goal: "Lose 10 pounds",
          target_weight: "", // Empty string should not count as filled

          // Injuries - 1/2 completed
          has_injuries: true,
          injury_details: null, // Null should not count as filled

          // Equipment - 0/2 completed

          // Other
          other_info: "Additional information",
        },
        registration_status: "complete",
        workout_count: 0,
        last_workout_date: "",
      };

      const result = ContactUtils.getAttributeCompletionStatus(
        mockContact,
        mockAttributeTypes,
        mockPrompts
      );

      // Goals completion
      expect(result[0].attributeType.id).toBe(1);
      expect(result[0].hasProvidedValue).toBe(true);
      expect(result[0].completedPrompts).toBe(2);
      expect(result[0].totalPrompts).toBe(3);
      expect(result[0].percentComplete).toBe(67); // 2/3 = ~67%

      // Injuries completion
      expect(result[1].attributeType.id).toBe(2);
      expect(result[1].hasProvidedValue).toBe(true);
      expect(result[1].completedPrompts).toBe(1);
      expect(result[1].totalPrompts).toBe(2);
      expect(result[1].percentComplete).toBe(50); // 1/2 = 50%

      // Equipment completion
      expect(result[2].attributeType.id).toBe(3);
      expect(result[2].hasProvidedValue).toBe(false);
      expect(result[2].completedPrompts).toBe(0);
      expect(result[2].totalPrompts).toBe(2);
      expect(result[2].percentComplete).toBe(0); // 0/2 = 0%
    });

    test("should correctly calculate completion with all attributes filled", () => {
      const mockContact: Contact = {
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        phone_number: "123456789",
        source: "web",
        status: "active",
        attributes: {
          // Goals - 3/3 completed
          fitness_goal: "Lose weight",
          weight_goal: "Lose 10 pounds",
          target_weight: "150",

          // Injuries - 2/2 completed
          has_injuries: false,
          injury_details: "None",

          // Equipment - 2/2 completed
          has_equipment: true,
          equipment_list: ["Dumbbells", "Bench"],
        },
        registration_status: "complete",
        workout_count: 0,
        last_workout_date: "",
      };

      const result = ContactUtils.getAttributeCompletionStatus(
        mockContact,
        mockAttributeTypes,
        mockPrompts
      );

      // Goals completion
      expect(result[0].hasProvidedValue).toBe(true);
      expect(result[0].completedPrompts).toBe(3);
      expect(result[0].totalPrompts).toBe(3);
      expect(result[0].percentComplete).toBe(100);

      // Injuries completion
      expect(result[1].hasProvidedValue).toBe(true);
      expect(result[1].completedPrompts).toBe(2);
      expect(result[1].totalPrompts).toBe(2);
      expect(result[1].percentComplete).toBe(100);

      // Equipment completion
      expect(result[2].hasProvidedValue).toBe(true);
      expect(result[2].completedPrompts).toBe(2);
      expect(result[2].totalPrompts).toBe(2);
      expect(result[2].percentComplete).toBe(100);
    });

    test("should handle edge cases for attribute values", () => {
      const mockContact: Contact = {
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        phone_number: "123456789",
        source: "web",
        status: "active",
        attributes: {
          fitness_goal: 0, // Number 0 should count as filled
          weight_goal: false, // Boolean false should count as filled
          target_weight: undefined, // undefined should not count as filled
          has_injuries: "", // Empty string should not count as filled
        },
        registration_status: "complete",
        workout_count: 0,
        last_workout_date: "",
      };

      const result = ContactUtils.getAttributeCompletionStatus(
        mockContact,
        mockAttributeTypes,
        mockPrompts
      );

      // Goals completion (fitness_goal and weight_goal are valid, target_weight is not)
      expect(result[0].completedPrompts).toBe(2);

      // Injuries completion (has_injuries is empty string, should not count)
      expect(result[1].completedPrompts).toBe(0);
    });
  });
});
