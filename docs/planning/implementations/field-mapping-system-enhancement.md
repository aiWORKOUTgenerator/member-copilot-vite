# Field Mapping System Enhancement Plan

## 📋 Executive Summary

**Problem**: Current field name handling in validation messages uses brittle string replacement logic that can produce grammatically incorrect messages (e.g., "areas options" instead of "area options"). While we've implemented a quick fix with singularization rules, a more robust field mapping system would provide better maintainability and user experience.

**Solution**: Implement a comprehensive field mapping system that centralizes field metadata including display names, pluralization rules, and validation message templates.

## 🔍 Current State Analysis

### Current Implementation (Post-Quick Fix)

**File**: `src/modules/dashboard/workouts/constants/validationMessages.ts`

```typescript
// Current approach: String replacement + singularization rules
const fieldName = fieldKey.replace('customization_', '').replace('_', ' ');

const singularFieldName = fieldName
  .replace(/areas$/, 'area')
  .replace(/soreness$/, 'soreness area')
  .replace(/equipment$/, 'equipment item');
```

### Issues with Current Approach

1. **Hard-coded Rules**: Singularization rules are embedded in validation logic
2. **Limited Flexibility**: Can't handle complex field naming scenarios
3. **Maintenance Overhead**: New fields require code changes in multiple places
4. **Inconsistent Display**: No centralized field display logic
5. **Missing Context**: No support for context-specific field names

### Current Field Types and Their Issues

| Field Key                 | Current Output           | Desired Output          | Issue           |
| ------------------------- | ------------------------ | ----------------------- | --------------- |
| `customization_areas`     | "area options"           | "focus area options"    | Missing context |
| `customization_soreness`  | "soreness area options"  | "soreness area options" | ✅ Works        |
| `customization_equipment` | "equipment item options" | "equipment options"     | Overly specific |
| `customization_focus`     | "focus options"          | "workout focus options" | Missing context |
| `customization_energy`    | "energy options"         | "energy level options"  | Missing context |

## 🎯 Proposed Solution: Comprehensive Field Mapping System

### Phase 1: Field Metadata System

#### 1.1 Create Field Metadata Constants

**File**: `src/modules/dashboard/workouts/constants/fieldMetadata.ts` (New)

```typescript
/**
 * Comprehensive field metadata system for workout customization
 *
 * Centralizes all field display logic, validation rules, and user-facing text
 * to ensure consistency and maintainability across the application.
 */

import { CUSTOMIZATION_FIELD_KEYS } from './fieldKeys';

export interface FieldMetadata {
  /** Field key used internally */
  key: string;
  /** Display name for UI (singular form) */
  displayName: string;
  /** Plural form for multi-select contexts */
  pluralName: string;
  /** Short description for tooltips/help text */
  description: string;
  /** Field type for validation and UI rendering */
  fieldType: 'rating' | 'multi-select' | 'single-select' | 'duration' | 'text';
  /** Validation message templates */
  messages: {
    required: string;
    invalid: string;
    maxSelections: (max: number) => string;
    minSelections: (min: number) => string;
  };
  /** Context-specific display overrides */
  contexts?: {
    validation?: string;
    summary?: string;
    analytics?: string;
  };
}

/**
 * Comprehensive field metadata mapping
 */
export const FIELD_METADATA: Record<string, FieldMetadata> = {
  [CUSTOMIZATION_FIELD_KEYS.ENERGY]: {
    key: CUSTOMIZATION_FIELD_KEYS.ENERGY,
    displayName: 'energy level',
    pluralName: 'energy levels',
    description: 'Your current energy level from 1 (very low) to 6 (very high)',
    fieldType: 'rating',
    messages: {
      required: 'Please rate your current energy level',
      invalid: 'Energy level must be between 1 and 6',
      maxSelections: (max) => `Select up to ${max} energy level options`,
      minSelections: (min) =>
        `Select at least ${min} energy level option${min > 1 ? 's' : ''}`,
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.SLEEP]: {
    key: CUSTOMIZATION_FIELD_KEYS.SLEEP,
    displayName: 'sleep quality',
    pluralName: 'sleep quality levels',
    description:
      'How well you slept last night from 1 (very poor) to 6 (excellent)',
    fieldType: 'rating',
    messages: {
      required: 'Please rate your sleep quality',
      invalid: 'Sleep quality must be between 1 and 6',
      maxSelections: (max) => `Select up to ${max} sleep quality options`,
      minSelections: (min) =>
        `Select at least ${min} sleep quality option${min > 1 ? 's' : ''}`,
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.STRESS]: {
    key: CUSTOMIZATION_FIELD_KEYS.STRESS,
    displayName: 'stress level',
    pluralName: 'stress levels',
    description: 'Your current stress level from 1 (very low) to 6 (very high)',
    fieldType: 'rating',
    messages: {
      required: 'Please indicate your current stress level',
      invalid: 'Stress level must be between 1 and 6',
      maxSelections: (max) => `Select up to ${max} stress level options`,
      minSelections: (min) =>
        `Select at least ${min} stress level option${min > 1 ? 's' : ''}`,
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.DURATION]: {
    key: CUSTOMIZATION_FIELD_KEYS.DURATION,
    displayName: 'workout duration',
    pluralName: 'workout durations',
    description: 'How long you want your workout to be in minutes',
    fieldType: 'duration',
    messages: {
      required: 'Please select a workout duration',
      invalid: 'Workout duration must be at least 5 minutes',
      maxSelections: (max) => `Select up to ${max} duration options`,
      minSelections: (min) =>
        `Select at least ${min} duration option${min > 1 ? 's' : ''}`,
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.FOCUS]: {
    key: CUSTOMIZATION_FIELD_KEYS.FOCUS,
    displayName: 'workout focus',
    pluralName: 'workout focuses',
    description: 'The main goal or type of workout you want',
    fieldType: 'single-select',
    messages: {
      required: 'Please select a workout focus',
      invalid: 'Please choose a valid workout focus',
      maxSelections: (max) => `Select up to ${max} workout focus options`,
      minSelections: (min) =>
        `Select at least ${min} workout focus option${min > 1 ? 's' : ''}`,
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.AREAS]: {
    key: CUSTOMIZATION_FIELD_KEYS.AREAS,
    displayName: 'focus area',
    pluralName: 'focus areas',
    description: 'Body areas you want to target in your workout',
    fieldType: 'multi-select',
    messages: {
      required: 'Please select at least one focus area',
      invalid: 'Please choose valid focus areas',
      maxSelections: (max) => `Select up to ${max} focus area options`,
      minSelections: (min) =>
        `Select at least ${min} focus area option${min > 1 ? 's' : ''}`,
    },
    contexts: {
      validation: 'focus area',
      summary: 'target area',
      analytics: 'body area',
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.SORENESS]: {
    key: CUSTOMIZATION_FIELD_KEYS.SORENESS,
    displayName: 'soreness area',
    pluralName: 'soreness areas',
    description: 'Body areas where you are currently experiencing soreness',
    fieldType: 'multi-select',
    messages: {
      required: 'Please indicate any soreness areas',
      invalid: 'Please choose valid soreness areas',
      maxSelections: (max) => `Select up to ${max} soreness area options`,
      minSelections: (min) =>
        `Select at least ${min} soreness area option${min > 1 ? 's' : ''}`,
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.EQUIPMENT]: {
    key: CUSTOMIZATION_FIELD_KEYS.EQUIPMENT,
    displayName: 'equipment',
    pluralName: 'equipment items',
    description: 'Workout equipment you have available',
    fieldType: 'multi-select',
    messages: {
      required: 'Please select available equipment',
      invalid: 'Please choose valid equipment options',
      maxSelections: (max) => `Select up to ${max} equipment options`,
      minSelections: (min) =>
        `Select at least ${min} equipment option${min > 1 ? 's' : ''}`,
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.INCLUDE]: {
    key: CUSTOMIZATION_FIELD_KEYS.INCLUDE,
    displayName: 'included exercise',
    pluralName: 'included exercises',
    description: 'Specific exercises you want to include in your workout',
    fieldType: 'text',
    messages: {
      required: 'Please specify exercises to include',
      invalid: 'Please enter valid exercise names',
      maxSelections: (max) => `Include up to ${max} exercises`,
      minSelections: (min) =>
        `Include at least ${min} exercise${min > 1 ? 's' : ''}`,
    },
  },

  [CUSTOMIZATION_FIELD_KEYS.EXCLUDE]: {
    key: CUSTOMIZATION_FIELD_KEYS.EXCLUDE,
    displayName: 'excluded exercise',
    pluralName: 'excluded exercises',
    description: 'Specific exercises you want to avoid in your workout',
    fieldType: 'text',
    messages: {
      required: 'Please specify exercises to exclude',
      invalid: 'Please enter valid exercise names',
      maxSelections: (max) => `Exclude up to ${max} exercises`,
      minSelections: (min) =>
        `Exclude at least ${min} exercise${min > 1 ? 's' : ''}`,
    },
  },
};

/**
 * Helper functions for field metadata access
 */
export const getFieldMetadata = (fieldKey: string): FieldMetadata | null => {
  return FIELD_METADATA[fieldKey] || null;
};

export const getFieldDisplayName = (
  fieldKey: string,
  context: 'default' | 'validation' | 'summary' | 'analytics' = 'default'
): string => {
  const metadata = getFieldMetadata(fieldKey);
  if (!metadata)
    return fieldKey.replace('customization_', '').replace('_', ' ');

  // Return context-specific override if available
  if (context !== 'default' && metadata.contexts?.[context]) {
    return metadata.contexts[context]!;
  }

  return metadata.displayName;
};

export const getFieldPluralName = (fieldKey: string): string => {
  const metadata = getFieldMetadata(fieldKey);
  return metadata?.pluralName || getFieldDisplayName(fieldKey) + 's';
};

export const getFieldDescription = (fieldKey: string): string => {
  const metadata = getFieldMetadata(fieldKey);
  return metadata?.description || '';
};

export const getFieldType = (fieldKey: string): FieldMetadata['fieldType'] => {
  const metadata = getFieldMetadata(fieldKey);
  return metadata?.fieldType || 'text';
};
```

#### 1.2 Update Validation Messages to Use Field Metadata

**File**: `src/modules/dashboard/workouts/constants/validationMessages.ts` (Updated)

```typescript
import { getFieldMetadata, getFieldDisplayName } from './fieldMetadata';

export const ValidationMessageHelpers = {
  /**
   * Get a selection count message using field metadata
   */
  getSelectionCountMessage: (
    fieldKey: string,
    count: number,
    max: number,
    min: number = 0
  ): string => {
    const metadata = getFieldMetadata(fieldKey);

    if (metadata?.messages) {
      // Use field-specific message templates
      if (count > max) {
        return metadata.messages.maxSelections(max);
      }
      if (count < min && min > 0) {
        return metadata.messages.minSelections(min);
      }
    } else {
      // Fallback to generic logic for unmapped fields
      const displayName = getFieldDisplayName(fieldKey, 'validation');
      if (count > max) {
        return `Select up to ${max} ${displayName} option${max > 1 ? 's' : ''}`;
      }
      if (count < min && min > 0) {
        return `Select at least ${min} ${displayName} option${min > 1 ? 's' : ''}`;
      }
    }

    return '';
  },

  /**
   * Get field-specific validation message
   */
  getFieldValidationMessage: (
    fieldKey: string,
    validationType: 'required' | 'invalid'
  ): string => {
    const metadata = getFieldMetadata(fieldKey);

    if (metadata?.messages?.[validationType]) {
      return metadata.messages[validationType];
    }

    // Fallback to generic messages
    const displayName = getFieldDisplayName(fieldKey, 'validation');
    if (validationType === 'required') {
      return `Please select a ${displayName}`;
    }
    return `Please choose a valid ${displayName}`;
  },

  // ... other helper functions remain the same
};
```

### Phase 2: Integration with Analytics System

#### 2.1 Update Analytics Hook to Use Field Metadata

**File**: `src/modules/dashboard/workouts/hooks/useWorkoutAnalytics.ts` (Updated)

```typescript
import { getFieldType, getFieldDisplayName } from '../constants/fieldMetadata';

export const useWorkoutAnalytics = () => {
  const trackSelection = useCallback(
    (fieldKey: string, value: unknown, mode: 'quick' | 'detailed') => {
      try {
        // Use field metadata for consistent type detection
        const valueType = getFieldType(fieldKey);
        const displayName = getFieldDisplayName(fieldKey, 'analytics');

        analytics.track('workout_field_selected', {
          field: fieldKey,
          fieldDisplayName: displayName,
          value: Array.isArray(value) ? value.length : value,
          valueType,
          mode,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.warn('Failed to track workout field selection:', error);
      }
    },
    [analytics]
  );

  // ... rest of implementation
};
```

#### 2.2 Update Selection Formatters to Use Field Metadata

**File**: `src/modules/dashboard/workouts/utils/selectionFormatters.ts` (Updated)

```typescript
import {
  getFieldMetadata,
  getFieldDisplayName,
} from '../constants/fieldMetadata';

export const formatSelectionValue = (
  fieldKey: string,
  value: unknown
): string | null => {
  const metadata = getFieldMetadata(fieldKey);

  // Use field-specific formatting if available
  if (metadata && value != null) {
    switch (metadata.fieldType) {
      case 'rating':
        return formatRatingValue(value as number);
      case 'duration':
        return formatDurationValue(value as number);
      case 'multi-select':
        return formatMultiSelectValue(
          value as string[],
          metadata.displayName,
          metadata.pluralName
        );
      case 'single-select':
        return formatSingleSelectValue(value as string);
      case 'text':
        return formatTextValue(value as string);
      default:
        return String(value);
    }
  }

  // Fallback to existing logic for unmapped fields
  return formatValueGeneric(fieldKey, value);
};

const formatMultiSelectValue = (
  values: string[],
  singularName: string,
  pluralName: string
): string | null => {
  if (!values?.length) return null;
  if (values.length === 1) {
    return values[0]
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return `${values.length} ${pluralName}`;
};

// ... other formatting functions
```

### Phase 3: Enhanced User Experience Features

#### 3.1 Field Help System

```typescript
/**
 * Field help and tooltip system
 */
export const getFieldHelpText = (fieldKey: string): string => {
  const metadata = getFieldMetadata(fieldKey);
  return metadata?.description || '';
};

export const getFieldValidationHint = (
  fieldKey: string,
  currentValue: unknown
): string => {
  const metadata = getFieldMetadata(fieldKey);
  if (!metadata) return '';

  switch (metadata.fieldType) {
    case 'rating':
      return 'Rate from 1 (lowest) to 6 (highest)';
    case 'multi-select':
      const count = Array.isArray(currentValue) ? currentValue.length : 0;
      return `${count} selected. You can select multiple options.`;
    case 'duration':
      return 'Choose your preferred workout length';
    default:
      return metadata.description;
  }
};
```

#### 3.2 Contextual Field Names

```typescript
/**
 * Context-aware field naming for different UI areas
 */
export const getContextualFieldName = (
  fieldKey: string,
  context:
    | 'form-label'
    | 'validation-error'
    | 'summary-badge'
    | 'analytics-event'
): string => {
  const metadata = getFieldMetadata(fieldKey);
  if (!metadata) return fieldKey;

  switch (context) {
    case 'form-label':
      return metadata.displayName.replace(/\b\w/g, (l) => l.toUpperCase());
    case 'validation-error':
      return metadata.contexts?.validation || metadata.displayName;
    case 'summary-badge':
      return metadata.contexts?.summary || metadata.displayName;
    case 'analytics-event':
      return metadata.contexts?.analytics || metadata.displayName;
    default:
      return metadata.displayName;
  }
};
```

## 📊 Implementation Benefits

### User Experience Improvements

1. **Consistent Language**: All field references use the same terminology
2. **Better Validation Messages**: Context-appropriate error messages
3. **Improved Accessibility**: Consistent field descriptions and help text
4. **Enhanced Analytics**: Better event naming and categorization

### Developer Experience Improvements

1. **Centralized Configuration**: All field metadata in one place
2. **Type Safety**: Full TypeScript support for field properties
3. **Easy Maintenance**: Add new fields by updating one configuration object
4. **Consistent APIs**: Standardized functions for field operations

### Code Quality Improvements

1. **Reduced Duplication**: Eliminates scattered field naming logic
2. **Better Separation of Concerns**: UI logic separate from field definitions
3. **Enhanced Testability**: Field metadata can be easily unit tested
4. **Future-Proof**: Easy to add new field properties and contexts

## 🚀 Implementation Timeline

### Phase 1: Foundation (Week 1)

- [ ] Create field metadata constants
- [ ] Implement helper functions
- [ ] Add comprehensive unit tests
- [ ] Update TypeScript types

### Phase 2: Integration (Week 2)

- [ ] Update validation messages system
- [ ] Update analytics hook
- [ ] Update selection formatters
- [ ] Update existing tests

### Phase 3: Enhancement (Week 3)

- [ ] Add field help system
- [ ] Implement contextual naming
- [ ] Add advanced validation hints
- [ ] Create comprehensive documentation

### Phase 4: Testing & Polish (Week 4)

- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Performance optimization
- [ ] Migration guide for future fields

## 🎯 Success Metrics

### Functional Metrics

- [ ] 100% of fields use metadata system
- [ ] Zero hard-coded field names in validation logic
- [ ] Consistent field naming across all UI contexts
- [ ] Improved validation message clarity

### Technical Metrics

- [ ] 95%+ test coverage for field metadata system
- [ ] Zero TypeScript errors
- [ ] 50%+ reduction in field-related code duplication
- [ ] Easy addition of new fields (< 5 minutes)

### User Experience Metrics

- [ ] Improved validation message readability
- [ ] Consistent terminology across the application
- [ ] Better accessibility scores
- [ ] Enhanced analytics data quality

## 📝 Migration Strategy

### Backward Compatibility

- Keep existing APIs working during transition
- Gradual migration of components to use new system
- Fallback logic for unmapped fields
- Comprehensive testing at each migration step

### Risk Mitigation

- Feature flag for new field metadata system
- A/B testing for validation message improvements
- Rollback plan if issues are discovered
- Comprehensive error handling and logging

This comprehensive field mapping system will provide a solid foundation for consistent, maintainable, and user-friendly field handling throughout the workout customization system.
