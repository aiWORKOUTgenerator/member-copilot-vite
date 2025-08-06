import { WorkoutInstance } from '@/domain/entities/workoutInstance';
import {
  Activity,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  ExternalLink,
  StickyNote,
  Target,
  X,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { formatDate } from '../utils/workoutHistoryUtils';

export interface WorkoutInstanceModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should be closed */
  onClose: () => void;
  /** The workout instance to display */
  workoutInstance: WorkoutInstance;
  /** Callback when user wants to view full details */
  onViewDetails?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export default function WorkoutInstanceModal({
  isOpen,
  onClose,
  workoutInstance,
  onViewDetails,
  className = '',
}: WorkoutInstanceModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Calculate workout stats
  const totalExercises =
    workoutInstance.jsonFormat?.sections.reduce(
      (total, section) => total + (section.exercises?.length || 0),
      0
    ) || 0;

  const completedExercises =
    workoutInstance.jsonFormat?.sections.reduce(
      (total, section) =>
        total + (section.exercises?.filter((ex) => ex.completed).length || 0),
      0
    ) || 0;

  const completionPercentage =
    totalExercises > 0
      ? Math.round((completedExercises / totalExercises) * 100)
      : 0;

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        ${className}
      `}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="workout-modal-title"
    >
      <div
        className={`
          w-full max-w-2xl mx-4 max-h-[90vh] 
          bg-base-100 rounded-lg shadow-xl
          flex flex-col overflow-hidden
        `}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-base-300">
          <div className="flex-1 pr-4">
            <h2 id="workout-modal-title" className="text-xl font-bold mb-2">
              {workoutInstance.jsonFormat?.title ||
                `Workout ${workoutInstance.id.slice(0, 8)}`}
            </h2>
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(workoutInstance.performedAt)}
              </div>
              {workoutInstance.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {workoutInstance.duration} min
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Section */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`badge ${
                  workoutInstance.completed ? 'badge-success' : 'badge-warning'
                } gap-2`}
              >
                {workoutInstance.completed ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
                {workoutInstance.completed ? 'Completed' : 'In Progress'}
              </div>
              {totalExercises > 0 && (
                <div className="badge badge-outline gap-2">
                  <Target className="w-3 h-3" />
                  {completedExercises}/{totalExercises} exercises (
                  {completionPercentage}%)
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {totalExercises > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-base-content/70 mb-1">
                <span>Progress</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-base-300 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    workoutInstance.completed ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Description */}
          {workoutInstance.jsonFormat?.description && (
            <div className="mb-4">
              <p className="text-sm text-base-content/80">
                {workoutInstance.jsonFormat.description}
              </p>
            </div>
          )}
        </div>

        {/* Exercises Section */}
        <div className="flex-1 overflow-y-auto px-6">
          {workoutInstance.jsonFormat?.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-base">{section.name}</h3>
                {section.rounds && section.rounds > 1 && (
                  <span className="badge badge-sm badge-outline">
                    {section.rounds} rounds
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {section.exercises?.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      exercise.completed
                        ? 'bg-success/10 border-success/20'
                        : 'bg-base-200 border-base-300'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {exercise.completed ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Circle className="w-4 h-4 text-base-content/50" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {exercise.name}
                      </div>
                      <div className="text-xs text-base-content/70 flex gap-3">
                        {exercise.sets && <span>{exercise.sets} sets</span>}
                        {exercise.reps && <span>{exercise.reps} reps</span>}
                        {exercise.weight && <span>{exercise.weight} lbs</span>}
                        {exercise.duration && <span>{exercise.duration}s</span>}
                      </div>
                    </div>
                  </div>
                )) || []}
              </div>
            </div>
          )) || []}

          {/* Empty state */}
          {!workoutInstance.jsonFormat?.sections?.length && (
            <div className="text-center py-8 text-base-content/50">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <p>No workout structure available</p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        {workoutInstance.notes && (
          <div className="px-6 py-4 border-t border-base-300">
            <div className="flex items-start gap-2">
              <StickyNote className="w-4 h-4 mt-0.5 text-base-content/50" />
              <div>
                <h4 className="font-medium text-sm mb-1">Notes</h4>
                <p className="text-sm text-base-content/80">
                  {workoutInstance.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 pt-4 border-t border-base-300">
          <div className="text-xs text-base-content/50">
            ID: {workoutInstance.id.slice(0, 8)}...
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
            >
              Close
            </button>
            {onViewDetails && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onViewDetails}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
