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
import EnergyLevelCustomization from './EnergyLevelCustomization';
import AvailableEquipmentCustomization from './AvailableEquipmentCustomization';
import SorenessCustomization from './SorenessCustomization';
import IncludeExercisesCustomization from './IncludeExercisesCustomization';
import ExcludeExercisesCustomization from './ExcludeExercisesCustomization';

// Enhanced components from PR #3 and PR #4 modularization effort
import {
  EnhancedFocusAreaCustomization,
  EnhancedSleepQualityCustomization,
  EnhancedStressLevelCustomization,
} from './enhanced';

// Export individual components
export { default as WorkoutDurationCustomization } from './WorkoutDurationCustomization';
export { default as WorkoutFocusCustomization } from './WorkoutFocusCustomization';
export { default as EnergyLevelCustomization } from './EnergyLevelCustomization';
export { default as AvailableEquipmentCustomization } from './AvailableEquipmentCustomization';
export { default as SorenessCustomization } from './SorenessCustomization';
export { default as IncludeExercisesCustomization } from './IncludeExercisesCustomization';
export { default as ExcludeExercisesCustomization } from './ExcludeExercisesCustomization';

// Enhanced components exports
export {
  EnhancedFocusAreaCustomization,
  EnhancedSleepQualityCustomization,
  EnhancedStressLevelCustomization,
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
    component: EnergyLevelCustomization,
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
    component: SorenessCustomization,
    label: 'Current Soreness',
    icon: AlertTriangle,
    category: 'Current State & Wellness',
  },
];
