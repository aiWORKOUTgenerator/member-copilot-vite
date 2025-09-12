/**
 * Generation status for trainer persona
 */
export interface GenerationStatus {
  status: 'none' | 'generating' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  has_persona: boolean;
  persona_id: string | null;
}

/**
 * Profile attribute status
 */
export interface AttributeStatus {
  present: boolean;
  value: unknown;
}

/**
 * Profile completeness information
 */
export interface ProfileCompleteness {
  required_attributes: Record<string, AttributeStatus>;
  recommended_attributes: Record<string, AttributeStatus>;
  required_completeness: number;
  overall_completeness: number;
  is_sufficient_for_generation: boolean;
}

/**
 * TrainerPersona entity representing an AI trainer persona
 */
export interface TrainerPersona {
  has_persona: boolean;
  persona_id?: string;
  trainer_name?: string;
  trainer_bio?: string;
  trainer_gender?: 'male' | 'female';
  expertise_areas?: string[];
  communication_style?: 'formal' | 'casual' | 'motivational' | 'technical';
  personality_traits?: Record<string, unknown>;
  avatar_url?: string | null;
  generation_status: GenerationStatus;
  message?: string;
}

/**
 * Trainer persona generation status response
 */
export interface TrainerPersonaStatus {
  generation_status: GenerationStatus;
  can_generate: boolean;
  generation_blocked_reason: string | null;
  estimated_time_remaining_seconds?: number;
  estimated_completion_percentage?: number;
  profile_completeness: ProfileCompleteness;
  contact_id: number;
}

/**
 * Generation start response
 */
export interface GenerationStartResponse {
  message: string;
  contact_id: number;
  generation_status: string;
  started_at: string;
  estimated_completion_time: string;
}
