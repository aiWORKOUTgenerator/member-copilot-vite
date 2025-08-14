/**
 * Enhanced Customization Components Index
 *
 * This directory contains enhanced versions of workout customization components
 * that use the DetailedSelector molecule for consistent card-based UI and
 * integrate with the analytics and validation systems from PR #2.
 *
 * These components gradually replace legacy customization components to provide:
 * - Consistent visual experience with Quick mode
 * - Analytics tracking for user behavior insights
 * - Enhanced validation with real-time feedback
 * - Better accessibility and mobile responsiveness
 *
 * Implementation Status:
 * ✅ PR #3: EnhancedFocusAreaCustomization (Focus areas multi-select)
 * ✅ PR #4: Enhanced wellness components (Sleep & Stress)
 * ✅ PR #5: Enhanced soreness component
 * ⏳ Future: Additional enhanced components as needed
 */

// PR #3: Enhanced Focus Area Component
export { default as EnhancedFocusAreaCustomization } from './EnhancedFocusAreaCustomization';

// PR #4: Enhanced Wellness Components
export { default as EnhancedSleepQualityCustomization } from './EnhancedSleepQualityCustomization';
export { default as EnhancedStressLevelCustomization } from './EnhancedStressLevelCustomization';

// PR #5: Enhanced Soreness Component
export { default as EnhancedSorenessCustomization } from './EnhancedSorenessCustomization';

// PR #6: Enhanced Workout Structure Components
export { default as EnhancedWorkoutDurationCustomization } from './EnhancedWorkoutDurationCustomization';
export { default as EnhancedWorkoutFocusCustomization } from './EnhancedWorkoutFocusCustomization';

// PR #7: Enhanced Energy Level Component
export { default as EnhancedEnergyLevelCustomization } from './EnhancedEnergyLevelCustomization';

// Future enhanced components will be exported here as they're implemented
// export { default as EnhancedAvailableEquipmentCustomization } from './EnhancedAvailableEquipmentCustomization';
