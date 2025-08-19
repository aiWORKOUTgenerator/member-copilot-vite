export interface WorkoutPathCardProps {
  title: string;
  description: string;
  features: string[];
  difficulty: 'Beginner' | 'Advanced';
  icon: React.ComponentType<{ className?: string }>;
  colorScheme: 'quick' | 'detailed';
  onClick: () => void;
  isSelected?: boolean; // NEW: For focus management
}

export interface WorkoutPathSelectionProps {
  onPathSelect: (path: 'quick' | 'detailed') => void;
}
