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
      'Basic customization options',
    ],
    difficulty: 'Beginner' as const,
    icon: Zap,
    colorScheme: 'quick' as const,
    onClick: () => handlePathSelect('quick'),
  };

  const detailedPathData = {
    title: 'Detailed Workout Focus',
    description:
      'Fine-tune every aspect of your workout with comprehensive customization options for the perfect routine.',
    features: [
      'Complete workout customization',
      'Equipment and exercise preferences',
      'Advanced targeting options',
    ],
    difficulty: 'Advanced' as const,
    icon: Target,
    colorScheme: 'detailed' as const,
    onClick: () => handlePathSelect('detailed'),
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
      role="radiogroup"
      aria-label="Workout path selection"
    >
      <WorkoutPathCard {...quickPathData} />
      <WorkoutPathCard {...detailedPathData} />
    </div>
  );
}
