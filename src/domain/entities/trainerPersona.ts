/**
 * TrainerPersona entity representing an AI trainer persona
 */
export interface TrainerPersona {
  name: string;
  user_shown_bio: string;
  avatar_photo_url: string | null;
  gender: string;
  personality_traits: string[];
  expertise_areas: string[];
  communication_style: string;
}
