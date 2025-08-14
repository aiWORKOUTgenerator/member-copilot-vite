import { Clock, Activity, Heart, Target, Plus, Minus } from 'lucide-react';
import { CustomizationConfig } from '../types';
import WorkoutDurationCustomization from './WorkoutDurationCustomization';
import WorkoutFocusCustomization from './WorkoutFocusCustomization';
import AvailableEquipmentCustomization from './AvailableEquipmentCustomization';
import IncludeExercisesCustomization from './IncludeExercisesCustomization';
import ExcludeExercisesCustomization from './ExcludeExercisesCustomization';

// Enhanced components from PR #3, PR #4, and PR #5 modularization effort
import { EnhancedFocusAreaCustomization } from './enhanced';

// Export individual components
export { default as WorkoutDurationCustomization } from './WorkoutDurationCustomization';
export { default as WorkoutFocusCustomization } from './WorkoutFocusCustomization';
export { default as AvailableEquipmentCustomization } from './AvailableEquipmentCustomization';
export { default as IncludeExercisesCustomization } from './IncludeExercisesCustomization';
export { default as ExcludeExercisesCustomization } from './ExcludeExercisesCustomization';

// Enhanced components exports (wellness components moved to step system)
export { EnhancedFocusAreaCustomization } from './enhanced';

// Configuration for all available customizations
export const CUSTOMIZATION_CONFIG: CustomizationConfig[] = [
  {
    key: 'customization_duration',
    component: WorkoutDurationCustomization,
    label: 'Workout Duration',
    icon: Clock,
    category: 'Workout Goals & Structure',
  },
  {
    key: 'customization_areas',
    component: EnhancedFocusAreaCustomization,
    label: 'Focus Areas',
    icon: Target,
    category: 'Workout Goals & Structure',
  },
  {
    key: 'customization_focus',
    component: WorkoutFocusCustomization,
    label: 'Workout Focus',
    icon: Heart,
    category: 'Workout Goals & Structure',
  },
  {
    key: 'customization_equipment',
    component: AvailableEquipmentCustomization,
    label: 'Available Equipment',
    icon: Activity,
    category: 'Physical Focus & Equipment',
  },
  {
    key: 'customization_include',
    component: IncludeExercisesCustomization,
    label: 'Include Exercises',
    icon: Plus,
    category: 'Physical Focus & Equipment',
  },
  {
    key: 'customization_exclude',
    component: ExcludeExercisesCustomization,
    label: 'Exclude Exercises',
    icon: Minus,
    category: 'Physical Focus & Equipment',
  },
  // Note: Wellness fields (sleep, stress, soreness, energy) are now handled
  // by the modularized step system in CurrentStateStep and WorkoutStructureStep
];
