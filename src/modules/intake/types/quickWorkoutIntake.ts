'use client';

export type AgeRange = '18-24' | '25-34' | '35-44' | '45+';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type EnergyLevel = 'low' | 'moderate' | 'high';

export interface QuickWorkoutIntake {
  locationId: string;
  ageRange: AgeRange | null;
  experience: ExperienceLevel | null;
  energy: EnergyLevel | null;
}

export interface StepDescriptor {
  key: 'welcome' | 'ageRange' | 'experience' | 'energy' | 'complete';
  title: string;
}
