/**
 * Standardized Customization Component Utilities
 * 
 * This module extracts common patterns from customization components to eliminate
 * duplication and provide consistent behavior across the workout customization system.
 * 
 * Key utilities:
 * 1. formatSelectionSummary() - Unified selection display
 * 2. handleMultipleSelection() - Generic multi-select logic
 * 3. validateRequired() - Consistent validation patterns
 * 4. generateBadgeClass() - Standardized styling
 * 5. formatTimeDisplay() - Unified time formatting
 * 6. calculatePercentage() - Standard percentage logic
 * 7. getCustomizationButtonClass() - Standardized button styling
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SelectionSummaryOptions {
  maxItems?: number;
  showCount?: boolean;
  separator?: string;
  truncateAt?: number;
}

export interface MultiSelectOptions<T> {
  allowEmpty?: boolean;
  maxSelections?: number;
  onSelectionChange?: (item: T, isSelected: boolean, allSelected: T[]) => void;
}

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  recommendations?: string[];
}

export interface BadgeConfig {
  level?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  outline?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  intensity?: 'low' | 'moderate' | 'high' | 'variable';
}

export interface TimeDisplayOptions {
  includeSeconds?: boolean;
  compact?: boolean;
  showUnits?: boolean;
  precision?: 'exact' | 'rounded' | 'smart';
}

export interface PercentageOptions {
  precision?: number;
  showSymbol?: boolean;
  minValue?: number;
  maxValue?: number;
  threshold?: {
    excellent?: number;
    good?: number;
    moderate?: number;
  };
}

// ============================================================================
// 1. SELECTION SUMMARY FORMATTING
// ============================================================================

/**
 * Unified selection display formatter for all customization components
 * Handles different data types and provides consistent summary formatting
 */
export const formatSelectionSummary = (
  items: unknown[],
  options: SelectionSummaryOptions = {}
): string | null => {
  const {
    maxItems = 3,
    showCount = true,
    separator = ", ",
    truncateAt = 50
  } = options;

  if (!items || items.length === 0) return null;

  // Convert items to display strings
  const displayItems = items.map(item => {
    if (typeof item === 'string') {
      return item.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }
    if (typeof item === 'object' && item !== null) {
      // Handle objects with label property
      const obj = item as { label?: string; name?: string; value?: string };
      return obj.label || obj.name || obj.value || String(item);
    }
    return String(item);
  });

  // Single item - return as is (possibly truncated)
  if (displayItems.length === 1) {
    const item = displayItems[0];
    return item.length > truncateAt ? `${item.substring(0, truncateAt)}...` : item;
  }

  // Multiple items within maxItems - show all
  if (displayItems.length <= maxItems) {
    return displayItems.join(separator);
  }

  // Too many items - show count or truncated list
  if (showCount) {
    return `${displayItems.length} items selected`;
  } else {
    const shown = displayItems.slice(0, maxItems).join(separator);
    const remaining = displayItems.length - maxItems;
    return `${shown} +${remaining} more`;
  }
};

/**
 * Format hierarchical selections with parent-child context
 */
export const formatHierarchicalSummary = (
  data: Record<string, { selected: boolean; label: string; level: string; parentKey?: string }>,
  options: SelectionSummaryOptions = {}
): string | null => {
  const selectedEntries = Object.entries(data).filter(([, info]) => info.selected);
  
  if (selectedEntries.length === 0) return null;

  const { maxItems = 2 } = options;

  // Single selection with parent context
  if (selectedEntries.length === 1) {
    const [, info] = selectedEntries[0];
    if (info.parentKey && data[info.parentKey]) {
      return `${data[info.parentKey].label} > ${info.label}`;
    }
    return info.label;
  }

  // Multiple selections - group by level
  const byLevel = selectedEntries.reduce((acc, [, info]) => {
    if (!acc[info.level]) acc[info.level] = [];
    acc[info.level].push(info.label);
    return acc;
  }, {} as Record<string, string[]>);

  // Prioritize primary level selections
  if (byLevel.primary && byLevel.primary.length <= maxItems) {
    const remaining = selectedEntries.length - byLevel.primary.length;
    return remaining > 0 
      ? `${byLevel.primary.join(", ")} +${remaining} specific`
      : byLevel.primary.join(", ");
  }

  return `${selectedEntries.length} areas selected`;
};

// ============================================================================
// 2. MULTI-SELECT LOGIC
// ============================================================================

/**
 * Generic multi-select logic handler for toggle behavior
 * Provides consistent add/remove logic across all customization components
 */
export const handleMultipleSelection = <T>(
  currentSelections: T[],
  toggleItem: T,
  options: MultiSelectOptions<T> = {}
): T[] => {
  const {
    allowEmpty = true,
    maxSelections,
    onSelectionChange
  } = options;

  const isCurrentlySelected = currentSelections.includes(toggleItem);
  let newSelections: T[];

  if (isCurrentlySelected) {
    // Remove item
    newSelections = currentSelections.filter(item => item !== toggleItem);
    
    // Check if empty is allowed
    if (!allowEmpty && newSelections.length === 0) {
      return currentSelections; // Don't allow empty selection
    }
  } else {
    // Add item
    if (maxSelections && currentSelections.length >= maxSelections) {
      // Remove oldest selection and add new one
      newSelections = [...currentSelections.slice(1), toggleItem];
    } else {
      newSelections = [...currentSelections, toggleItem];
    }
  }

  // Call callback if provided
  if (onSelectionChange) {
    onSelectionChange(toggleItem, !isCurrentlySelected, newSelections);
  }

  return newSelections;
};

/**
 * Handle category-based multi-select with parent-child relationships
 */
export const handleCategorySelection = <T extends { category: string; value: string }>(
  currentSelections: T[],
  categoryItems: T[],
  toggleItem: T,
  selectAllInCategory: boolean = false
): T[] => {
  if (selectAllInCategory) {
    const categoryItemValues = categoryItems
      .filter(item => item.category === toggleItem.category)
      .map(item => item.value);
    
    const allSelected = categoryItemValues.every(value => 
      currentSelections.some(sel => sel.value === value)
    );

    if (allSelected) {
      // Deselect all in category
      return currentSelections.filter(sel => 
        !categoryItemValues.includes(sel.value)
      );
    } else {
      // Select all in category
      const newItems = categoryItems.filter(item => 
        item.category === toggleItem.category &&
        !currentSelections.some(sel => sel.value === item.value)
      );
      return [...currentSelections, ...newItems];
    }
  }

  return handleMultipleSelection(currentSelections, toggleItem);
};

// ============================================================================
// 3. VALIDATION PATTERNS
// ============================================================================

/**
 * Consistent validation pattern for required fields and business rules
 */
export const validateRequired = (
  value: unknown,
  fieldName: string,
  customValidators: Array<(value: unknown) => ValidationResult> = []
): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
    recommendations: []
  };

  // Required field validation
  if (value === undefined || value === null || value === '') {
    result.isValid = false;
    result.errors.push(`${fieldName} is required`);
    return result;
  }

  // Array emptiness check
  if (Array.isArray(value) && value.length === 0) {
    result.isValid = false;
    result.errors.push(`${fieldName} must have at least one selection`);
    return result;
  }

  // Object emptiness check (for complex configurations)
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    if (Object.keys(obj).length === 0) {
      result.isValid = false;
      result.errors.push(`${fieldName} configuration is incomplete`);
      return result;
    }
  }

  // Run custom validators
  for (const validator of customValidators) {
    const customResult = validator(value);
    result.warnings.push(...customResult.warnings);
    result.errors.push(...customResult.errors);
    if (customResult.recommendations) {
      result.recommendations!.push(...customResult.recommendations);
    }
    if (!customResult.isValid) {
      result.isValid = false;
    }
  }

  return result;
};

/**
 * Validate time allocations (duration, warm-up, cool-down)
 */
export const validateTimeAllocation = (
  totalMinutes: number,
  warmUpMinutes: number,
  coolDownMinutes: number,
  minWorkingTime: number = 5
): ValidationResult => {
  const workingTime = totalMinutes - warmUpMinutes - coolDownMinutes;
  const structurePercentage = ((warmUpMinutes + coolDownMinutes) / totalMinutes) * 100;
  
  const result: ValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
    recommendations: []
  };

  // Critical validations (blocking)
  if (workingTime < minWorkingTime) {
    result.isValid = false;
    result.errors.push(`Working time (${workingTime} min) is below minimum (${minWorkingTime} min)`);
  }

  if (warmUpMinutes + coolDownMinutes >= totalMinutes) {
    result.isValid = false;
    result.errors.push("Preparation time cannot equal or exceed total duration");
  }

  // Advisory validations (warnings)
  if (structurePercentage > 60) {
    result.warnings.push("Consider reducing warm-up or cool-down for more working time");
  }

  if (totalMinutes >= 60 && warmUpMinutes < 5) {
    result.warnings.push("Consider longer warm-up for extended sessions");
  }

  if (totalMinutes >= 90 && coolDownMinutes < 8) {
    result.warnings.push("Extended sessions benefit from longer recovery periods");
  }

  // Efficiency recommendations
  const workingPercentage = (workingTime / totalMinutes) * 100;
  if (workingPercentage < 50) {
    result.recommendations!.push("Very low working time - consider shorter preparation");
  } else if (workingPercentage > 95) {
    result.recommendations!.push("Consider adding warm-up/cool-down for injury prevention");
  }

  return result;
};

// ============================================================================
// 4. BADGE CLASS GENERATION
// ============================================================================

/**
 * Standardized badge class generation based on level, size, and styling options
 */
export const generateBadgeClass = (config: BadgeConfig = {}): string => {
  const {
    level = 'primary',
    size = 'sm',
    outline = false,
    variant = 'solid',
    intensity
  } = config;

  let badgeClass = 'badge';

  // Base level styling
  switch (level) {
    case 'primary':
      badgeClass += outline ? ' badge-primary' : ' badge-primary';
      break;
    case 'secondary':
      badgeClass += outline ? ' badge-secondary badge-outline' : ' badge-secondary';
      break;
    case 'tertiary':
    case 'accent':
      badgeClass += outline ? ' badge-accent badge-outline' : ' badge-accent';
      break;
    case 'success':
      badgeClass += outline ? ' badge-success badge-outline' : ' badge-success';
      break;
    case 'warning':
      badgeClass += outline ? ' badge-warning badge-outline' : ' badge-warning';
      break;
    case 'error':
      badgeClass += outline ? ' badge-error badge-outline' : ' badge-error';
      break;
  }

  // Size modifier
  if (size !== 'md') {
    badgeClass += ` badge-${size}`;
  }

  // Variant styling
  if (variant === 'outline' && !outline) {
    badgeClass += ' badge-outline';
  } else if (variant === 'ghost') {
    badgeClass += ' badge-ghost';
  }

  // Intensity-based styling override
  if (intensity) {
    switch (intensity) {
      case 'low':
        badgeClass = badgeClass.replace(/badge-(primary|secondary|accent)/, 'badge-success');
        break;
      case 'high':
        badgeClass = badgeClass.replace(/badge-(primary|secondary|accent)/, 'badge-error');
        break;
      case 'variable':
        badgeClass = badgeClass.replace(/badge-(primary|secondary|accent)/, 'badge-warning');
        break;
      // 'moderate' keeps the original level styling
    }
  }

  return badgeClass.trim();
};

/**
 * Generate badge class based on hierarchical level
 */
export const generateHierarchicalBadgeClass = (
  level: 'primary' | 'secondary' | 'tertiary',
  size: 'xs' | 'sm' | 'md' = 'sm'
): string => {
  const config: BadgeConfig = { size };

  switch (level) {
    case 'primary':
      config.level = 'primary';
      break;
    case 'secondary':
      config.level = 'secondary';
      config.outline = true;
      break;
    case 'tertiary':
      config.level = 'accent';
      config.outline = true;
      config.size = 'xs';
      break;
  }

  return generateBadgeClass(config);
};

// ============================================================================
// 5. TIME FORMATTING
// ============================================================================

/**
 * Unified time formatting for durations, timestamps, and time displays
 */
export const formatTimeDisplay = (
  minutes: number,
  options: TimeDisplayOptions = {}
): string => {
  const {
    includeSeconds = false,
    compact = false,
    showUnits = true,
    precision = 'smart'
  } = options;

  if (minutes <= 0) return showUnits ? "0 min" : "0";

  // Handle seconds if included
  const totalSeconds = includeSeconds ? minutes * 60 : 0;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const seconds = includeSeconds ? Math.floor(totalSeconds % 60) : 0;

  // Smart precision handling
  if (precision === 'smart') {
    if (minutes >= 60) {
      if (remainingMinutes === 0) {
        if (!showUnits) {
          return compact ? `${hours}` : `${hours}`;
        }
        return compact 
          ? `${hours}h`
          : `${hours} hour${hours > 1 ? "s" : ""}`;
      } else {
        if (!showUnits) {
          return compact ? `${hours}:${remainingMinutes}` : `${hours}:${remainingMinutes}`;
        }
        return compact
          ? `${hours}h ${remainingMinutes}m`
          : `${hours}h ${remainingMinutes}min`;
      }
    }
    if (!showUnits) {
      return `${minutes}`;
    }
    return compact ? `${minutes}m` : `${minutes} min`;
  }

  // Exact precision
  if (precision === 'exact' && includeSeconds) {
    if (hours > 0) {
      if (!showUnits) {
        return `${hours}:${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      return compact
        ? `${hours}:${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${hours}h ${remainingMinutes}m ${seconds}s`;
    }
    if (!showUnits) {
      return `${remainingMinutes}:${String(seconds).padStart(2, '0')}`;
    }
    return compact
      ? `${remainingMinutes}:${String(seconds).padStart(2, '0')}`
      : `${remainingMinutes}m ${seconds}s`;
  }

  // Rounded precision
  if (precision === 'rounded') {
    const roundedMinutes = Math.round(minutes);
    if (roundedMinutes >= 60) {
      const roundedHours = Math.round(roundedMinutes / 60);
      if (!showUnits) {
        return `${roundedHours}`;
      }
      return compact ? `${roundedHours}h` : `${roundedHours} hour${roundedHours > 1 ? "s" : ""}`;
    }
    if (!showUnits) {
      return `${roundedMinutes}`;
    }
    return compact ? `${roundedMinutes}m` : `${roundedMinutes} min`;
  }

  // Default fallback
  if (!showUnits) {
    return `${minutes}`;
  }
  return compact ? `${minutes}m` : `${minutes} min`;
};

/**
 * Format time ranges (e.g., "45-60 min")
 */
export const formatTimeRange = (
  minMinutes: number,
  maxMinutes: number,
  options: TimeDisplayOptions = {}
): string => {
  if (minMinutes === maxMinutes) {
    return formatTimeDisplay(minMinutes, options);
  }

  const minFormatted = formatTimeDisplay(minMinutes, { ...options, showUnits: false });
  const maxFormatted = formatTimeDisplay(maxMinutes, options);
  
  return `${minFormatted}-${maxFormatted}`;
};

// ============================================================================
// 6. PERCENTAGE CALCULATIONS
// ============================================================================

/**
 * Standard percentage calculation with thresholds and formatting
 */
export const calculatePercentage = (
  value: number,
  total: number,
  options: PercentageOptions = {}
): {
  percentage: number;
  formatted: string;
  rating: 'excellent' | 'good' | 'moderate' | 'poor';
  recommendation: string;
} => {
  const {
    precision = 0,
    showSymbol = true,
    minValue = 0,
    maxValue = 100,
    threshold = {
      excellent: 85,
      good: 70,
      moderate: 50
    }
  } = options;

  // Calculate raw percentage
  const rawPercentage = total === 0 ? 0 : (value / total) * 100;
  
  // Apply min/max constraints
  const constrainedPercentage = Math.max(minValue, Math.min(maxValue, rawPercentage));
  
  // Round to specified precision
  const percentage = Math.round(constrainedPercentage * Math.pow(10, precision)) / Math.pow(10, precision);
  
  // Format display string
  const formatted = showSymbol ? `${percentage}%` : percentage.toString();
  
  // Determine rating based on thresholds
  let rating: 'excellent' | 'good' | 'moderate' | 'poor';
  let recommendation: string;

  if (percentage >= threshold.excellent!) {
    rating = 'excellent';
    recommendation = 'Optimal performance level achieved';
  } else if (percentage >= threshold.good!) {
    rating = 'good';
    recommendation = 'Good performance with room for improvement';
  } else if (percentage >= threshold.moderate!) {
    rating = 'moderate';
    recommendation = 'Moderate performance - consider optimization';
  } else {
    rating = 'poor';
    recommendation = 'Performance needs significant improvement';
  }

  return {
    percentage,
    formatted,
    rating,
    recommendation
  };
};

/**
 * Calculate efficiency percentage for workout time allocation
 */
export const calculateWorkoutEfficiency = (
  workingTime: number,
  totalTime: number
): {
  percentage: number;
  formatted: string;
  rating: 'excellent' | 'good' | 'moderate' | 'poor';
  recommendation: string;
} => {
  const result = calculatePercentage(workingTime, totalTime, {
    precision: 0,
    threshold: {
      excellent: 85,
      good: 70,
      moderate: 50
    }
  });

  // Workout-specific recommendations
  if (result.rating === 'excellent') {
    result.recommendation = 'Optimal balance for focused training';
  } else if (result.rating === 'good') {
    result.recommendation = 'Good structure with adequate preparation time';
  } else if (result.rating === 'moderate') {
    result.recommendation = 'Consider reducing preparation time for more active training';
  } else {
    result.recommendation = 'Too much preparation time - consider shorter warm-up/cool-down';
  }

  return result;
};

// ============================================================================
// UTILITY COMPOSITION HELPERS
// ============================================================================

/**
 * Compose multiple validation results into a single result
 */
export const combineValidationResults = (...results: ValidationResult[]): ValidationResult => {
  return {
    isValid: results.every(r => r.isValid),
    warnings: results.flatMap(r => r.warnings),
    errors: results.flatMap(r => r.errors),
    recommendations: results.flatMap(r => r.recommendations || [])
  };
};

/**
 * Create a debounced version of multi-select handler for performance
 */
export const createDebouncedMultiSelect = <T>(
  handler: (selections: T[]) => void,
  delay: number = 300
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (currentSelections: T[], toggleItem: T, options?: MultiSelectOptions<T>) => {
    const newSelections = handleMultipleSelection(currentSelections, toggleItem, options);
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handler(newSelections);
    }, delay);
    
    return newSelections;
  };
}; 

// ============================================================================
// STYLING UTILITIES
// ============================================================================

/**
 * Generate standardized button classes for customization components
 * Eliminates duplication of button styling patterns
 */
export const getCustomizationButtonClass = (
  isSelected: boolean,
  disabled: boolean = false,
  size: 'xs' | 'sm' | 'md' | 'lg' = 'sm',
  variant: 'default' | 'outline' | 'ghost' = 'default'
): string => {
  const baseClass = `btn btn-${size} justify-start`;
  
  let stateClass: string;
  if (disabled) {
    stateClass = "btn-disabled";
  } else if (isSelected) {
    stateClass = variant === 'outline' ? "btn-accent" : "btn-primary";
  } else {
    stateClass = variant === 'ghost' ? "btn-ghost" : "btn-outline";
  }
  
  return `${baseClass} ${stateClass}`;
};

/**
 * Generate standardized rating button classes for rating components
 * Used by components like SorenessCustomization, StressLevelCustomization, etc.
 */
export const getRatingButtonClass = (
  isSelected: boolean,
  disabled: boolean = false,
  ratingType: 'primary' | 'secondary' | 'warning' | 'error' = 'primary'
): string => {
  const baseClass = "btn btn-circle font-bold text-base";
  
  let colorClass: string;
  if (disabled) {
    colorClass = "btn-disabled";
  } else if (isSelected) {
    switch (ratingType) {
      case 'secondary':
        colorClass = "btn-secondary text-secondary-content";
        break;
      case 'warning':
        colorClass = "btn-warning text-warning-content";
        break;
      case 'error':
        colorClass = "btn-error text-error-content";
        break;
      default:
        colorClass = "btn-primary text-primary-content";
    }
  } else {
    switch (ratingType) {
      case 'secondary':
        colorClass = "btn-outline btn-secondary";
        break;
      case 'warning':
        colorClass = "btn-outline btn-warning";
        break;
      case 'error':
        colorClass = "btn-outline btn-error";
        break;
      default:
        colorClass = "btn-outline btn-primary";
    }
  }
  
  return `${baseClass} ${colorClass}`;
};

/**
 * Generate expandable section button classes
 * Used for collapsible sections in complex customization components
 */
export const getExpandableButtonClass = (
  isExpanded: boolean,
  disabled: boolean = false,
  _hasSelections: boolean = false
): string => {
  const baseClass = "w-full flex items-center justify-between p-4 text-left transition-all duration-200";
  
  let stateClass: string;
  if (disabled) {
    stateClass = "opacity-50 cursor-not-allowed";
  } else {
    stateClass = "hover:bg-base-200 cursor-pointer";
  }
  
  const bgClass = isExpanded ? "bg-base-200" : "bg-base-100";
  
  return `${baseClass} ${stateClass} ${bgClass}`;
};

/**
 * Generate classes for selection grid items (exercises, equipment, etc.)
 * Provides consistent styling for selectable grid items
 */
export const getGridItemClass = (
  isSelected: boolean,
  disabled: boolean = false,
  size: 'sm' | 'md' | 'lg' = 'md'
): string => {
  const sizeClasses = {
    sm: "h-auto min-h-[2rem] py-1 px-2 text-xs",
    md: "h-auto min-h-[2.5rem] py-3 px-3 text-xs",
    lg: "h-auto min-h-[3rem] py-4 px-4 text-sm"
  };
  
  const baseClass = `flex items-center justify-center ${sizeClasses[size]} rounded-lg font-medium transition-all duration-200 border text-center`;
  
  let stateClass: string;
  if (disabled) {
    stateClass = "opacity-50 cursor-not-allowed";
  } else if (isSelected) {
    stateClass = "bg-primary text-primary-content border-primary cursor-pointer";
  } else {
    stateClass = "bg-base-100 border-base-300 text-base-content hover:border-base-400 hover:bg-base-200 cursor-pointer";
  }
  
  return `${baseClass} ${stateClass}`;
}; 