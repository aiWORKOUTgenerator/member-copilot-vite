import { TrainerPersona } from '@/domain/entities/trainerPersona';

interface TrainerPersonaDisplayProps {
  trainerPersona: TrainerPersona;
  className?: string;
}

export function TrainerPersonaDisplay({
  trainerPersona,
  className,
}: TrainerPersonaDisplayProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="avatar">
        <div className="w-10 h-10 rounded-full">
          {trainerPersona.avatar_url ? (
            <img
              src={trainerPersona.avatar_url}
              alt={trainerPersona.trainer_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full">
              {trainerPersona.trainer_name.charAt(0)}
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="font-medium text-sm">Your trainer</p>
        <p className="text-base font-semibold">{trainerPersona.trainer_name}</p>
      </div>
    </div>
  );
}
