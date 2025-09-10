import {
  ClassSchedule,
  ClassScheduleWithLocation,
  ClassScheduleUtils,
} from '@/domain/entities/classSchedule';
import { ClassScheduleCard } from '@/ui/shared/molecules/ClassScheduleCard';
import LoadingState from '@/ui/shared/atoms/LoadingState';
import EmptyStateBasic from '@/ui/shared/molecules/EmptyState';
import { SelectionBadge } from '@/ui/shared/atoms/SelectionBadge';
import { Calendar, Filter, X } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';

interface ClassScheduleDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Function to close the dialog */
  onClose: () => void;
  /** Array of class schedules to display (with or without location info) */
  schedules: ClassSchedule[] | ClassScheduleWithLocation[];
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Dialog title */
  title?: string;
  /** Dialog subtitle */
  subtitle?: string;
  /** Callback when a schedule is selected */
  onScheduleSelect?: (
    schedule: ClassSchedule | ClassScheduleWithLocation
  ) => void;
}

/**
 * Glassmorphism-styled dialog for displaying and filtering class schedules
 */
export const ClassScheduleDialog: React.FC<ClassScheduleDialogProps> = ({
  isOpen,
  onClose,
  schedules,
  isLoading = false,
  error = null,
  title = 'Class Schedule',
  subtitle = 'Find a matching class for your workout',
  onScheduleSelect,
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>('all');
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Check if schedules have location information
  const hasLocationInfo = schedules.length > 0 && 'location' in schedules[0];

  // Get unique workout types and instructors for filtering
  const workoutTypes = useMemo(
    () => ClassScheduleUtils.getUniqueWorkoutTypes(schedules),
    [schedules]
  );

  const instructors = useMemo(
    () => ClassScheduleUtils.getUniqueInstructors(schedules),
    [schedules]
  );

  const locations = useMemo(() => {
    if (!hasLocationInfo) return [];
    return ClassScheduleUtils.getUniqueLocations(
      schedules as ClassScheduleWithLocation[]
    );
  }, [schedules, hasLocationInfo]);

  // Filter schedules based on selected filters
  const filteredSchedules = useMemo(() => {
    let filtered = schedules.filter((schedule) => schedule.is_active);

    if (selectedWorkoutType !== 'all') {
      filtered = ClassScheduleUtils.filterByWorkoutType(
        filtered,
        selectedWorkoutType
      );
    }

    if (selectedInstructor !== 'all') {
      filtered = ClassScheduleUtils.filterByInstructor(
        filtered,
        selectedInstructor
      );
    }

    if (selectedLocation !== 'all' && hasLocationInfo) {
      const locationId =
        selectedLocation === 'default' ? null : selectedLocation;
      filtered = ClassScheduleUtils.filterByLocation(
        filtered as ClassScheduleWithLocation[],
        locationId
      );
    }

    return filtered;
  }, [
    schedules,
    selectedWorkoutType,
    selectedInstructor,
    selectedLocation,
    hasLocationInfo,
  ]);

  const handleScheduleClick = (
    schedule: ClassSchedule | ClassScheduleWithLocation
  ) => {
    onScheduleSelect?.(schedule);
  };

  const clearFilters = () => {
    setSelectedWorkoutType('all');
    setSelectedInstructor('all');
    setSelectedLocation('all');
  };

  const hasActiveFilters =
    selectedWorkoutType !== 'all' ||
    selectedInstructor !== 'all' ||
    (hasLocationInfo && selectedLocation !== 'all');

  // Handle modal open/close state
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [isOpen]);

  // Handle modal close events
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => {
      onClose();
    };

    modal.addEventListener('close', handleClose);
    return () => modal.removeEventListener('close', handleClose);
  }, [onClose]);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      ref={modalRef}
      className="modal modal-bottom sm:modal-middle"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-base-100/10 backdrop-blur-xl border border-white/10 modal-box max-w-4xl max-h-[80vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1
              id="modal-title"
              className="text-xl font-bold text-base-content"
            >
              {title}
            </h1>
            <p
              id="modal-description"
              className="text-sm text-base-content/70 mt-1"
            >
              {subtitle}
            </p>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* Filters */}
          <div className="flex-shrink-0 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Filters</span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn btn-ghost btn-xs gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Workout Type Filter */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="workout-type-filter"
                  className="text-xs font-medium text-base-content/70"
                >
                  Workout Type
                </label>
                <select
                  id="workout-type-filter"
                  value={selectedWorkoutType}
                  onChange={(e) => setSelectedWorkoutType(e.target.value)}
                  className="select select-sm select-bordered bg-base-100/20 backdrop-blur-xl border-white/10"
                >
                  <option value="all">All Types</option>
                  {workoutTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor Filter */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="instructor-filter"
                  className="text-xs font-medium text-base-content/70"
                >
                  Instructor
                </label>
                <select
                  id="instructor-filter"
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                  className="select select-sm select-bordered bg-base-100/20 backdrop-blur-xl border-white/10"
                >
                  <option value="all">All Instructors</option>
                  {instructors.map((instructor) => (
                    <option key={instructor} value={instructor}>
                      {instructor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              {hasLocationInfo && (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="location-filter"
                    className="text-xs font-medium text-base-content/70"
                  >
                    Location
                  </label>
                  <select
                    id="location-filter"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="select select-sm select-bordered bg-base-100/20 backdrop-blur-xl border-white/10"
                  >
                    <option value="all">All Locations</option>
                    {locations.map((location) => (
                      <option
                        key={location.id || 'default'}
                        value={location.id || 'default'}
                      >
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedWorkoutType !== 'all' && (
                  <SelectionBadge value={selectedWorkoutType} />
                )}
                {selectedInstructor !== 'all' && (
                  <SelectionBadge value={selectedInstructor} />
                )}
                {hasLocationInfo && selectedLocation !== 'all' && (
                  <SelectionBadge
                    value={
                      locations.find(
                        (loc) => (loc.id || 'default') === selectedLocation
                      )?.name || selectedLocation
                    }
                  />
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingState />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-error mb-2">Failed to load schedules</div>
                <div className="text-sm text-base-content/70">{error}</div>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <EmptyStateBasic
                icon={<Calendar className="w-12 h-12 text-base-content/50" />}
                title={
                  hasActiveFilters
                    ? 'No matching classes'
                    : 'No classes available'
                }
                description={
                  hasActiveFilters
                    ? 'Try adjusting your filters to see more classes'
                    : 'There are no active class schedules at this location'
                }
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">
                    {filteredSchedules.length} class
                    {filteredSchedules.length !== 1 ? 'es' : ''} found
                  </span>
                </div>

                <div className="grid gap-4">
                  {filteredSchedules.map((schedule) => (
                    <ClassScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      onClick={() => handleScheduleClick(schedule)}
                      showLocationInChips={!hasLocationInfo}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal backdrop - clicking outside closes modal */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Close modal">
          close
        </button>
      </form>
    </dialog>
  );
};
