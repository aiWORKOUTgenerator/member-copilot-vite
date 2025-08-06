/**
 * Contact information entity
 */
export interface Contact {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  phone_verified_at: string | null;
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
 * Type guard to check if an object is a valid Contact
 */
export function isContact(obj: unknown): obj is Contact {
  return !!(
    obj &&
    typeof obj === 'object' &&
    obj !== null &&
    'email' in obj &&
    'first_name' in obj &&
    'last_name' in obj &&
    'phone_number' in obj &&
    'phone_verified_at' in obj &&
    'source' in obj &&
    'status' in obj &&
    'attributes' in obj &&
    'registration_status' in obj &&
    'workout_count' in obj &&
    'last_workout_date' in obj &&
    typeof (obj as Contact).email === 'string' &&
    typeof (obj as Contact).first_name === 'string' &&
    typeof (obj as Contact).last_name === 'string' &&
    typeof (obj as Contact).phone_number === 'string' &&
    ((obj as Contact).phone_verified_at === null ||
      typeof (obj as Contact).phone_verified_at === 'string') &&
    typeof (obj as Contact).source === 'string' &&
    typeof (obj as Contact).status === 'string' &&
    (obj as Contact).attributes &&
    typeof (obj as Contact).attributes === 'object' &&
    typeof (obj as Contact).registration_status === 'string' &&
    typeof (obj as Contact).workout_count === 'number' &&
    typeof (obj as Contact).last_workout_date === 'string'
  );
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
          contact.attributes[prompt.variableName] !== ''
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
