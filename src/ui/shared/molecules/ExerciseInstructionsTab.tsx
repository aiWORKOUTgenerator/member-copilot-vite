'use client';

interface ExerciseInstructionsTabProps {
  detailedInstructions?: string | null;
  simpleInstructions?: string | null;
  exerciseName: string;
  className?: string;
}

export const ExerciseInstructionsTab: React.FC<
  ExerciseInstructionsTabProps
> = ({
  detailedInstructions,
  simpleInstructions,
  exerciseName,
  className = '',
}) => {
  const hasInstructions = detailedInstructions || simpleInstructions;

  if (!hasInstructions) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-base-content/60">
          <p className="text-lg font-medium mb-2">No Instructions Available</p>
          <p className="text-sm">
            Instructions for {exerciseName} are not available at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-base-content">
          How to Perform {exerciseName}
        </h3>
        <p className="text-sm text-base-content/70 mt-1">
          Follow these instructions to perform the exercise correctly
        </p>
      </div>

      {/* Simple Instructions */}
      {simpleInstructions && (
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">S</span>
            </div>
            <h4 className="font-semibold text-base-content">
              Simple Instructions
            </h4>
          </div>
          <p className="text-base-content/80 leading-relaxed">
            {simpleInstructions}
          </p>
        </div>
      )}

      {/* Detailed Instructions */}
      {detailedInstructions && (
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-sm font-bold">D</span>
            </div>
            <h4 className="font-semibold text-base-content">
              Detailed Instructions
            </h4>
          </div>
          <div className="text-base-content/80 leading-relaxed whitespace-pre-line">
            {detailedInstructions}
          </div>
        </div>
      )}
    </div>
  );
};
