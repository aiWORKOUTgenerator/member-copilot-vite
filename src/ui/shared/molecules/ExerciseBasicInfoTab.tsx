'use client';

interface ExerciseBasicInfoTabProps {
  primaryName: string;
  alternateNames?: string[] | null;
  bodyPart?: string | null;
  difficultyLevel?: string | null;
  exerciseType?: string | null;
  className?: string;
}

export const ExerciseBasicInfoTab: React.FC<ExerciseBasicInfoTabProps> = ({
  primaryName,
  alternateNames,
  bodyPart,
  difficultyLevel,
  exerciseType,
  className = '',
}) => {
  const formatAlternateNames = (
    names: string[] | null | undefined
  ): string[] => {
    if (!names || !Array.isArray(names)) return [];
    return names.filter((name) => name && name.trim() !== '');
  };

  const alternateNamesList = formatAlternateNames(alternateNames);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-base-content">
          Exercise Information
        </h3>
        <p className="text-sm text-base-content/70 mt-1">
          Basic details and identification for this exercise
        </p>
      </div>

      <div className="space-y-4">
        {/* Primary Name */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">N</span>
            </div>
            <h4 className="font-semibold text-base-content">Primary Name</h4>
          </div>
          <p className="text-base-content/80 font-medium">{primaryName}</p>
        </div>

        {/* Alternate Names */}
        {alternateNamesList.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-secondary text-sm font-bold">A</span>
              </div>
              <h4 className="font-semibold text-base-content">
                Alternate Names
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {alternateNamesList.map((name, index) => (
                <span key={index} className="badge badge-outline badge-sm">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Body Part */}
        {bodyPart && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent text-sm font-bold">B</span>
              </div>
              <h4 className="font-semibold text-base-content">Body Part</h4>
            </div>
            <p className="text-base-content/80 capitalize">{bodyPart}</p>
          </div>
        )}

        {/* Difficulty Level */}
        {difficultyLevel && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center">
                <span className="text-warning text-sm font-bold">D</span>
              </div>
              <h4 className="font-semibold text-base-content">
                Difficulty Level
              </h4>
            </div>
            <span className="badge badge-warning badge-sm">
              {difficultyLevel}
            </span>
          </div>
        )}

        {/* Exercise Type */}
        {exerciseType && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-info/20 flex items-center justify-center">
                <span className="text-info text-sm font-bold">T</span>
              </div>
              <h4 className="font-semibold text-base-content">Exercise Type</h4>
            </div>
            <span className="badge badge-info badge-sm capitalize">
              {exerciseType}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
