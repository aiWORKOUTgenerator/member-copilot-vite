export interface WorkoutPathCardProps {
  title: string;
  description: string;
  features: string[];
  difficulty: 'Beginner' | 'Advanced';
  icon: React.ComponentType<{ className?: string }>;
  colorScheme: 'quick' | 'detailed';
  onClick: () => void;
}

export interface WorkoutPathSelectionProps {
  onPathSelect: (path: 'quick' | 'detailed') => void;
}
