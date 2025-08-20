import { useNavigate } from 'react-router';
import { Zap, Target } from 'lucide-react';
import { WorkoutPathCard } from './WorkoutPathCard';
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
    difficulty: 'Beginner' as const,
    icon: Zap,
    colorScheme: 'quick' as const,
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
    difficulty: 'Advanced' as const,
    icon: Target,
    colorScheme: 'detailed' as const,
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
      role="group"
      aria-label="Workout path selection options"
    >
      <WorkoutPathCard
        {...quickPathData}
        onClick={() => handlePathSelect('quick')}
      />
      <WorkoutPathCard
        {...detailedPathData}
        onClick={() => handlePathSelect('detailed')}
      />
    </div>
  );
}
