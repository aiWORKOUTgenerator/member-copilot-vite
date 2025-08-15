/**
 * Workout prompt examples organized by category for use in prompt input components
 */

import type { PromptExample } from '@/ui/shared/molecules/PromptInputWithExamples';

export const WORKOUT_PROMPT_EXAMPLES: PromptExample[] = [
  // Environment examples (6 total)
  { text: 'Quiet workout for apartment living', category: 'environment' },
  {
    text: 'Outdoor workout for neighborhood park setting',
    category: 'environment',
  },
  { text: 'Outdoor workout for backyard', category: 'environment' },
  { text: 'Trail friendly workout with stations', category: 'environment' },
  { text: 'Small apartment, no jumping exercises', category: 'environment' },
  { text: 'Hotel room workout while traveling', category: 'environment' },

  // Modification examples (6 total) - Focus on accessibility, skill level, and physical considerations
  {
    text: 'Beginner-friendly with focus on proper form',
    category: 'modifications',
  },
  {
    text: 'Start easy and gradually increase intensity',
    category: 'modifications',
  },
  { text: 'Pregnancy-safe modifications please', category: 'modifications' },
  { text: 'Beginner level with detailed form cues', category: 'modifications' },
  {
    text: 'Low-impact options for sensitive joints',
    category: 'modifications',
  },
  {
    text: 'Modifications for limited mobility or injuries',
    category: 'modifications',
  },

  // Context examples (6 total) - Focus on timing, mood, and situational factors
  { text: 'High energy, ready for intense session', category: 'context' },
  { text: "Recovery from yesterday's leg day", category: 'context' },
  { text: 'Quick morning energizer before work', category: 'context' },
  { text: 'Post-work stress relief and unwind', category: 'context' },
  { text: 'Weekend warrior, longer session available', category: 'context' },
  { text: 'Feeling unmotivated, need something fun', category: 'context' },
];
