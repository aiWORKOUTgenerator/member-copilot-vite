/**
 * Shared field type mappings for workout customization
 *
 * This centralizes field type definitions to ensure consistency between
 * analytics tracking and validation systems. Eliminates brittle string
 * matching and provides a single source of truth for field types.
 */

import { CUSTOMIZATION_FIELD_KEYS } from './fieldKeys';

/**
 * Field type definitions for workout customization fields
 */
export type FieldType =
  | 'rating'
  | 'multi-select'
  | 'single-select'
  | 'duration'
  | 'text';

/**
 * Comprehensive mapping of field keys to their types
 *
 * This mapping is used by both analytics and validation systems
 * to ensure consistent field type detection and handling.
 */
export const FIELD_TYPE_MAP: Record<string, FieldType> = {
  [CUSTOMIZATION_FIELD_KEYS.ENERGY]: 'rating',
  [CUSTOMIZATION_FIELD_KEYS.SLEEP]: 'rating',
  [CUSTOMIZATION_FIELD_KEYS.STRESS]: 'rating',
  [CUSTOMIZATION_FIELD_KEYS.DURATION]: 'duration',
  [CUSTOMIZATION_FIELD_KEYS.FOCUS]: 'single-select',
  [CUSTOMIZATION_FIELD_KEYS.AREAS]: 'multi-select',
  [CUSTOMIZATION_FIELD_KEYS.SORENESS]: 'multi-select',
  [CUSTOMIZATION_FIELD_KEYS.EQUIPMENT]: 'multi-select',
  [CUSTOMIZATION_FIELD_KEYS.INCLUDE]: 'text',
  [CUSTOMIZATION_FIELD_KEYS.EXCLUDE]: 'text',
} as const;

/**
 * Get the field type for a given field key
 *
 * @param fieldKey - The field key to look up
 * @returns The field type, or undefined if not found
 */
export const getFieldType = (fieldKey: string): FieldType | undefined => {
  return FIELD_TYPE_MAP[fieldKey];
};

/**
 * Check if a field key is a rating field
 */
export const isRatingField = (fieldKey: string): boolean => {
  return getFieldType(fieldKey) === 'rating';
};

/**
 * Check if a field key is a multi-select field
 */
export const isMultiSelectField = (fieldKey: string): boolean => {
  return getFieldType(fieldKey) === 'multi-select';
};

/**
 * Check if a field key is a text field
 */
export const isTextField = (fieldKey: string): boolean => {
  return getFieldType(fieldKey) === 'text';
};

/**
 * Check if a field key is a duration field
 */
export const isDurationField = (fieldKey: string): boolean => {
  return getFieldType(fieldKey) === 'duration';
};
