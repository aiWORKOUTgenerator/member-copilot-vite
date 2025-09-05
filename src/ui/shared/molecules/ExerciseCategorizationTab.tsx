'use client';

interface ExerciseCategorizationTabProps {
  muscleGroups?: string[] | null;
  equipmentRequired?: string[] | null;
  tags?: string[] | null;
  isCompound?: boolean | null;
  className?: string;
}

export const ExerciseCategorizationTab: React.FC<
  ExerciseCategorizationTabProps
> = ({ muscleGroups, equipmentRequired, tags, isCompound, className = '' }) => {
  const formatArray = (arr: string[] | null | undefined): string[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter((item) => item && item.trim() !== '');
  };

  const muscleGroupsList = formatArray(muscleGroups);
  const equipmentList = formatArray(equipmentRequired);
  const tagsList = formatArray(tags);

  const hasContent =
    muscleGroupsList.length > 0 ||
    equipmentList.length > 0 ||
    tagsList.length > 0 ||
    isCompound !== null;

  if (!hasContent) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-base-content/60">
          <p className="text-lg font-medium mb-2">
            No Categorization Available
          </p>
          <p className="text-sm">
            Categorization information is not available for this exercise.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-base-content">
          Exercise Categorization
        </h3>
        <p className="text-sm text-base-content/70 mt-1">
          Classification and targeting information
        </p>
      </div>

      <div className="space-y-4">
        {/* Muscle Groups */}
        {muscleGroupsList.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm font-bold">M</span>
              </div>
              <h4 className="font-semibold text-base-content">Muscle Groups</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {muscleGroupsList.map((muscle, index) => (
                <span key={index} className="badge badge-primary badge-sm">
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Required */}
        {equipmentList.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-secondary text-sm font-bold">E</span>
              </div>
              <h4 className="font-semibold text-base-content">
                Equipment Required
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {equipmentList.map((equipment, index) => (
                <span key={index} className="badge badge-secondary badge-sm">
                  {equipment}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent text-sm font-bold">T</span>
              </div>
              <h4 className="font-semibold text-base-content">Tags</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {tagsList.map((tag, index) => (
                <span key={index} className="badge badge-outline badge-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Compound Exercise Indicator */}
        {isCompound !== null && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center">
                <span className="text-warning text-sm font-bold">C</span>
              </div>
              <h4 className="font-semibold text-base-content">Exercise Type</h4>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`badge badge-sm ${isCompound ? 'badge-warning' : 'badge-info'}`}
              >
                {isCompound ? 'Compound Exercise' : 'Isolation Exercise'}
              </span>
              <span className="text-sm text-base-content/70">
                {isCompound
                  ? 'Works multiple muscle groups'
                  : 'Targets specific muscle group'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
