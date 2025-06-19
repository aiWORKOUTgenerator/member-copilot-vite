/**
 * TrainerPersona entity representing an AI trainer persona
 */
export interface TrainerPersona {
  trainer_name: string;
  trainer_bio: string;
  trainer_gender: string;
  avatar_photo_url: string | null;
  personality_traits: { [key: string]: string };
  expertise_areas: string[];
  communication_style: string[];
  llm_system_prompt: string;
}
