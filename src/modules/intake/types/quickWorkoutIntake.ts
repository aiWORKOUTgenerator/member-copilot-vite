'use client';

export type AgeRange =
  | 'Male 18-34'
  | 'Male 35-54'
  | 'Male 55+'
  | 'Female 18-34'
  | 'Female 35-54'
  | 'Female 55+';

export type ExperienceLevel =
  | 'goal_fatloss_low'
  | 'goal_fatloss_mod'
  | 'goal_fatloss_high'
  | 'goal_muscle_low'
  | 'goal_muscle_mod'
  | 'goal_muscle_high'
  | 'goal_endurance_low_mod'
  | 'goal_endurance_high'
  | 'goal_strength_mod_high';

export type EnergyLevel = 'low' | 'moderate' | 'high';
export type DurationIntensity =
  | 'dur30_low'
  | 'dur30_mod'
  | 'dur30_high'
  | 'dur45_low'
  | 'dur45_mod'
  | 'dur45_high'
  | 'dur60_low';

export interface QuickWorkoutIntake {
  locationId: string;
  ageRange: AgeRange | null;
  experience: ExperienceLevel | null;
  energy: DurationIntensity | null;
}

export interface StepDescriptor {
  key: 'welcome' | 'ageRange' | 'experience' | 'energy' | 'complete';
  title: string;
}
