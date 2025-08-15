import { TrainerPersona } from '@/domain/entities/trainerPersona';

interface TrainerPersonaDisplayProps {
  trainerPersona: TrainerPersona;
  /** Optional class applied to the outer container */
  className?: string;
  /** Optional class applied to the inner row for alignment overrides */
  contentClassName?: string;
  /** Optional subtitle text displayed beneath the row */
  subtitle?: string;
}

export function TrainerPersonaDisplay({
  trainerPersona,
  className = '',
  contentClassName = '',
  subtitle,
}: TrainerPersonaDisplayProps) {
  return (
    <div
      className={`bg-base-100 border border-base-300 rounded-lg p-4 ${className}`}
    >
      <div className={`flex items-center gap-3 ${contentClassName}`}>
        <div className="avatar">
          <div className="w-12 h-12 rounded-full ring ring-primary/40 ring-offset-base-100 ring-offset-2">
            {trainerPersona.avatar_url ? (
              <img
                src={trainerPersona.avatar_url}
                alt={trainerPersona.trainer_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full text-lg font-bold">
                {trainerPersona.trainer_name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="badge badge-primary badge-sm mb-1">Your trainer</div>
          <p className="text-base font-semibold">
            {trainerPersona.trainer_name}
          </p>
        </div>
      </div>
      {subtitle ? (
        <div className="mt-2 text-sm text-base-content/70">
          <p>{subtitle}</p>
        </div>
      ) : null}
    </div>
  );
}
