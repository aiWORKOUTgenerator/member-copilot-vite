import {
  Clock,
  Activity,
  Zap,
  Heart,
  Moon,
  Target,
  AlertTriangle,
  Brain,
  Plus,
  Minus,
} from 'lucide-react';
import { CustomizationConfig } from '../types';
import WorkoutDurationCustomization from './WorkoutDurationCustomization';
import WorkoutFocusCustomization from './WorkoutFocusCustomization';
// Enhanced components from PR #3, PR #4, and PR #5 modularization effort
import AvailableEquipmentCustomization from './AvailableEquipmentCustomization';
import IncludeExercisesCustomization from './IncludeExercisesCustomization';
import ExcludeExercisesCustomization from './ExcludeExercisesCustomization';

// Enhanced components from PR #3, PR #4, and PR #5 modularization effort
import {
  EnhancedFocusAreaCustomization,
  EnhancedSleepQualityCustomization,
  EnhancedStressLevelCustomization,
  EnhancedSorenessCustomization,
  EnhancedEnergyLevelCustomization,
} from './enhanced';

// Export individual components
export { default as WorkoutDurationCustomization } from './WorkoutDurationCustomization';
export { default as WorkoutFocusCustomization } from './WorkoutFocusCustomization';
export { default as AvailableEquipmentCustomization } from './AvailableEquipmentCustomization';
export { default as IncludeExercisesCustomization } from './IncludeExercisesCustomization';
export { default as ExcludeExercisesCustomization } from './ExcludeExercisesCustomization';

// Enhanced components exports
export {
  EnhancedFocusAreaCustomization,
  EnhancedSleepQualityCustomization,
  EnhancedStressLevelCustomization,
  EnhancedSorenessCustomization,
  EnhancedEnergyLevelCustomization,
} from './enhanced';

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
  {
    key: 'customization_sleep',
    component: EnhancedSleepQualityCustomization,
    label: 'Sleep Quality',
    icon: Moon,
    category: 'Current State & Wellness',
  },
  {
    key: 'customization_energy',
    component: EnhancedEnergyLevelCustomization,
    label: 'Energy Level',
    icon: Zap,
    category: 'Current State & Wellness',
  },
  {
    key: 'customization_stress',
    component: EnhancedStressLevelCustomization,
    label: 'Stress Level',
    icon: Brain,
    category: 'Current State & Wellness',
  },
  {
    key: 'customization_soreness',
    component: EnhancedSorenessCustomization,
    label: 'Current Soreness',
    icon: AlertTriangle,
    category: 'Current State & Wellness',
  },
];
