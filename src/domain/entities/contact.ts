/**
 * Contact information entity
 */
export interface Contact {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  source: string;
  status: string;
  attributes: {
    [key: string]: string | number | string[] | boolean | null | undefined;
  };
  registration_status: string;
  workout_count: number;
  last_workout_date: string;
}

/**
 * Represents completion status of attribute prompts
 */
export interface AttributeCompletion {
  attributeType: {
    id: number | string;
    name: string;
    description: string | null;
  };
  hasProvidedValue: boolean;
  completedPrompts: number;
  totalPrompts: number;
  percentComplete: number;
}

/**
 * Helper functions for contact operations
 */
export const ContactUtils = {
  /**
   * Calculate completion status for all attribute types
   */
  getAttributeCompletionStatus(
    contact: Contact | null,
    attributeTypes: Array<{
      id: number | string;
      name: string;
      description: string | null;
    }>,
    prompts: Array<{
      attributeType: {
        id: number | string;
      } | null;
      variableName: string;
    }>
  ): AttributeCompletion[] {
    if (!contact) return [];

    return attributeTypes.map((attributeType) => {
      // Get prompts for this attribute type
      const attributePrompts = prompts.filter(
        (prompt) => prompt.attributeType?.id === attributeType.id
      );

      // Count completed prompts
      const completedPrompts = attributePrompts.filter(
        (prompt) =>
          contact.attributes[prompt.variableName] !== undefined &&
          contact.attributes[prompt.variableName] !== null &&
          contact.attributes[prompt.variableName] !== ""
      ).length;

      // Calculate stats
      const totalPrompts = attributePrompts.length;
      const hasProvidedValue = completedPrompts > 0;
      const percentComplete =
        totalPrompts > 0
          ? Math.round((completedPrompts / totalPrompts) * 100)
          : 0;

      return {
        attributeType,
        hasProvidedValue,
        completedPrompts,
        totalPrompts,
        percentComplete,
      };
    });
  },
};
