import { InstructorTime } from '@/domain/entities/classSchedule';
import { Clock, User, MapPin } from 'lucide-react';

interface ClassScheduleChipProps {
  /** Instructor and time information */
  instructorTime: InstructorTime;
  /** Location information (optional for backward compatibility) */
  location?: {
    id: string | null;
    name: string;
  };
  /** Additional CSS classes */
  className?: string;
  /** Whether to show location information */
  showLocation?: boolean;
}

/**
 * Glassmorphism-styled chip displaying instructor name, class time, and optionally location
 */
export const ClassScheduleChip: React.FC<ClassScheduleChipProps> = ({
  instructorTime,
  location,
  showLocation = false,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-base-100/10 backdrop-blur-xl border border-white/10
        rounded-full px-4 py-2 flex items-center gap-2
        hover:bg-base-100/20 hover:border-white/20 
        transition-all duration-300
        shadow-[0_4px_30px_rgba(0,0,0,0.2)]
        ${className}
      `}
    >
      <div className="flex items-center gap-1 text-sm">
        <User className="w-3 h-3 text-primary" />
        <span className="font-medium text-base-content">
          {instructorTime.name}
        </span>
      </div>
      <div className="w-px h-4 bg-white/20" />
      <div className="flex items-center gap-1 text-sm">
        <Clock className="w-3 h-3 text-accent" />
        <span className="text-base-content/80">{instructorTime.time}</span>
      </div>
      {showLocation && location && (
        <>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="w-3 h-3 text-secondary" />
            <span className="text-base-content/70 font-medium">
              {location.name}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
