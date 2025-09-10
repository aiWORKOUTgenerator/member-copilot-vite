import {
  ClassSchedule,
  ClassScheduleUtils,
} from '@/domain/entities/classSchedule';
import { ClassScheduleChip } from '@/ui/shared/atoms/ClassScheduleChip';
import { Calendar, MapPin, Repeat } from 'lucide-react';

interface ClassScheduleCardProps {
  /** Class schedule data */
  schedule: ClassSchedule;
  /** Additional CSS classes */
  className?: string;
  /** Click handler for the card */
  onClick?: () => void;
}

/**
 * Glassmorphism-styled card displaying class schedule information
 */
export const ClassScheduleCard: React.FC<ClassScheduleCardProps> = ({
  schedule,
  className = '',
  onClick,
}) => {
  const instructorTimes = ClassScheduleUtils.getInstructorTimes(schedule);

  return (
    <div
      className={`
        bg-base-100/10 backdrop-blur-xl border border-white/10
        rounded-2xl p-6 cursor-pointer
        hover:bg-base-100/20 hover:border-white/20 hover:scale-[1.02]
        transition-all duration-300
        shadow-[0_4px_30px_rgba(0,0,0,0.2)]
        ${className}
      `}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Select ${schedule.name} class`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-base-content mb-1">
            {schedule.name}
          </h3>
          <p className="text-base-content/70 text-sm leading-relaxed">
            {schedule.description}
          </p>
        </div>
        <div
          className={`badge ${schedule.is_active ? 'badge-success' : 'badge-neutral'} badge-sm ml-2 flex-shrink-0`}
        >
          {schedule.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Workout Type and Frequency */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-medium text-primary capitalize">
            {schedule.workout_type}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Repeat className="w-4 h-4 text-accent" />
          <span className="text-base-content/80 capitalize">
            {schedule.frequency}
          </span>
        </div>
      </div>

      {/* Instructor Times */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-sm font-medium text-base-content/90">
          <MapPin className="w-4 h-4" />
          <span>Class Times</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {instructorTimes.map((instructorTime, index) => (
            <ClassScheduleChip key={index} instructorTime={instructorTime} />
          ))}
        </div>
      </div>
    </div>
  );
};
