import {
  Clock,
  Activity,
  Zap,
  Heart,
  Moon,
  Target,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { CustomizationConfig } from "../types";
import WorkoutDurationCustomization from "./WorkoutDurationCustomization";
import FocusAreaCustomization from "./FocusAreaCustomization";
import WorkoutFocusCustomization from "./WorkoutFocusCustomization";
import SleepQualityCustomization from "./SleepQualityCustomization";
import EnergyLevelCustomization from "./EnergyLevelCustomization";
import StressLevelCustomization from "./StressLevelCustomization";
import AvailableEquipmentCustomization from "./AvailableEquipmentCustomization";
import SorenessCustomization from "./SorenessCustomization";

// Export individual components
export { default as WorkoutDurationCustomization } from "./WorkoutDurationCustomization";
export { default as FocusAreaCustomization } from "./FocusAreaCustomization";
export { default as WorkoutFocusCustomization } from "./WorkoutFocusCustomization";
export { default as SleepQualityCustomization } from "./SleepQualityCustomization";
export { default as EnergyLevelCustomization } from "./EnergyLevelCustomization";
export { default as StressLevelCustomization } from "./StressLevelCustomization";
export { default as AvailableEquipmentCustomization } from "./AvailableEquipmentCustomization";
export { default as SorenessCustomization } from "./SorenessCustomization";

// Configuration for all available customizations
export const CUSTOMIZATION_CONFIG: CustomizationConfig[] = [
  {
    key: "customization_duration",
    component: WorkoutDurationCustomization,
    label: "Workout Duration",
    icon: Clock,
  },
  {
    key: "customization_areas",
    component: FocusAreaCustomization,
    label: "Focus Areas",
    icon: Target,
  },
  {
    key: "customization_focus",
    component: WorkoutFocusCustomization,
    label: "Workout Focus",
    icon: Heart,
  },
  {
    key: "customization_equipment",
    component: AvailableEquipmentCustomization,
    label: "Available Equipment",
    icon: Activity,
  },
  {
    key: "customization_sleep",
    component: SleepQualityCustomization,
    label: "Sleep Quality",
    icon: Moon,
  },
  {
    key: "customization_energy",
    component: EnergyLevelCustomization,
    label: "Energy Level",
    icon: Zap,
  },
  {
    key: "customization_stress",
    component: StressLevelCustomization,
    label: "Stress Level",
    icon: Brain,
  },
  {
    key: "customization_soreness",
    component: SorenessCustomization,
    label: "Current Soreness",
    icon: AlertTriangle,
  },
];
