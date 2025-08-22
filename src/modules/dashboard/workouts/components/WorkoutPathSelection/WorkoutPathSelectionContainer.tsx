import { useNavigate } from 'react-router';
import { Zap, Target } from 'lucide-react';
import { PathCard } from '@/ui/shared/molecules/PathCard';
import { useWorkoutPathSelection } from '../../hooks/useWorkoutPathSelection';

export function WorkoutPathSelectionContainer() {
  const navigate = useNavigate();
  const { selectPath } = useWorkoutPathSelection();

  const handlePathSelect = (path: 'quick' | 'detailed') => {
    selectPath(path);
    navigate(`/dashboard/workouts/generate/${path}`);
  };

  const quickPathData = {
    title: 'Quick Workout Setup',
    description:
      'Get a personalized workout in minutes with our streamlined setup process.',
    features: [
      'Fast and efficient setup',
      'AI-powered recommendations',
      'Quick customization options',
      'Perfect for busy schedules',
    ],
    badge: 'Beginner',
    icon: Zap,
    variant: 'primary' as const,
  };

  const detailedPathData = {
    title: 'Detailed Workout Setup',
    description:
      'Create a highly customized workout with advanced options and preferences.',
    features: [
      'Comprehensive customization',
      'Advanced preference settings',
      'Detailed equipment selection',
      'Tailored to your exact needs',
    ],
    badge: 'Advanced',
    icon: Target,
    variant: 'secondary' as const,
  };

  return (
    <div
      className="bg-base-200/30 rounded-xl p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
      role="group"
      aria-label="Workout path selection options"
    >
      <PathCard {...quickPathData} onClick={() => handlePathSelect('quick')} />
      <PathCard
        {...detailedPathData}
        onClick={() => handlePathSelect('detailed')}
      />
    </div>
  );
}
