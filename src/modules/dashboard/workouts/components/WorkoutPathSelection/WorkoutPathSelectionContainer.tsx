import { useNavigate } from 'react-router';
import { Zap, Target } from 'lucide-react';
import {
  RadioGroupOfCards,
  SelectableItem,
} from '@/ui/shared/molecules/RadioGroupOfCards';
import { useWorkoutPathSelection } from '../../hooks/useWorkoutPathSelection';

export function WorkoutPathSelectionContainer() {
  const navigate = useNavigate();
  const { selectPath } = useWorkoutPathSelection();

  const handlePathSelect = (selected: SelectableItem | SelectableItem[]) => {
    // Since we're using single selection (multiple=false), selected will be a single item
    const selectedItem = Array.isArray(selected) ? selected[0] : selected;
    const path = selectedItem.id as 'quick' | 'detailed';
    selectPath(path);
    navigate(`/dashboard/workouts/generate/${path}`);
  };

  const workoutPathOptions: SelectableItem[] = [
    {
      id: 'quick',
      title: 'Quick Workout Setup',
      description:
        'Get a personalized workout in minutes with our streamlined setup process.',
      tertiary: (
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Beginner
          </span>
        </div>
      ),
    },
    {
      id: 'detailed',
      title: 'Detailed Workout Setup',
      description:
        'Create a highly customized workout with advanced options and preferences.',
      tertiary: (
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
            Advanced
          </span>
        </div>
      ),
    },
  ];

  return (
    <RadioGroupOfCards
      items={workoutPathOptions}
      onChange={handlePathSelect}
      legend="Choose Your Workout Path"
      gridCols={2}
      colorScheme="primary"
      showDescription={true}
      showTertiary={true}
    />
  );
}
