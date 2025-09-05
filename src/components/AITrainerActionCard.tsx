import { useUserAccess } from '@/hooks';
import {
  useTrainerPersonaData,
  useTrainerPersonaHasNoPersona,
  useTrainerPersonaLoading,
} from '@/hooks/useTrainerPersona';
import { ActionCard } from '@/ui/shared/molecules/ActionCard';
import { Bot, Brain, Crown } from 'lucide-react';
import { useNavigate } from 'react-router';

/**
 * AI Trainer action card for dashboard
 * Shows different states based on user access and trainer persona status
 */
export function AITrainerActionCard() {
  const navigate = useNavigate();
  const { canAccessFeature, isLoading: isAccessLoading } = useUserAccess();
  const trainerPersona = useTrainerPersonaData();
  const hasNoPersona = useTrainerPersonaHasNoPersona();
  const isLoading = useTrainerPersonaLoading();

  // Check if user has access to trainer persona feature
  const hasTrainerAccess = canAccessFeature('ai_assistant_advanced');

  // Show loading state while checking access
  if (isAccessLoading || isLoading) {
    return (
      <ActionCard
        title="AI Trainer"
        description="Loading your AI trainer status..."
        actionText="Loading..."
        onClick={() => {}}
        icon={<Bot className="w-5 h-5" />}
        actionCardIsDisabled={true}
      />
    );
  }

  // If user doesn't have access to AI Trainer feature
  if (!hasTrainerAccess) {
    return (
      <ActionCard
        title="AI Trainer"
        description="Get a personalized AI trainer that adapts to your fitness goals, communication style, and training preferences. Upgrade to unlock this advanced feature."
        actionText="Upgrade to Access"
        onClick={() => navigate('/dashboard/billing')}
        icon={<Crown className="w-5 h-5" />}
        badgeText="Premium Feature"
        badgeColor="badge-accent"
      />
    );
  }

  // If user has access but no trainer persona yet
  if (hasNoPersona) {
    return (
      <ActionCard
        title="Create Your AI Trainer"
        description="Generate your personalized AI trainer persona tailored to your fitness goals, communication preferences, and training style."
        actionText="Generate Trainer"
        onClick={() => navigate('/dashboard/trainer')}
        icon={<Brain className="w-5 h-5" />}
        badgeText="Ready to Create"
        badgeColor="badge-primary"
      />
    );
  }

  // If user has a trainer persona
  return (
    <ActionCard
      title="My AI Trainer"
      description={`Meet ${trainerPersona?.trainer_name || 'your AI trainer'} - your personalized fitness coach ready to guide your workouts and provide expert advice.`}
      actionText="View Trainer"
      onClick={() => navigate('/dashboard/trainer')}
      icon={<Bot className="w-5 h-5" />}
      badgeText="Active"
      badgeColor="badge-success"
    />
  );
}
