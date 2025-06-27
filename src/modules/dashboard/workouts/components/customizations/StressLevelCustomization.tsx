
import { CustomizationComponentProps, CategoryRatingData } from "../types";

// Stress categories for multi-dimensional assessment
const STRESS_CATEGORIES = [
  { 
    label: "Physical", 
    value: "physical",
    description: "Training overload, poor sleep, nutrient deficiency, illness"
  },
  { 
    label: "Mental/Emotional", 
    value: "mental_emotional",
    description: "Work pressure, relationships, anxiety, cognitive overload" 
  },
  { 
    label: "Environmental", 
    value: "environmental",
    description: "Loud environments, travel, weather, schedule disruption"
  },
  { 
    label: "Systemic Load", 
    value: "systemic",
    description: "Overall burnout from multi-factor stress accumulation"
  },
];

// Stress level ratings for each category
const STRESS_LEVELS = [
  {
    value: 1,
    label: "Mild",
    description: "Well-managed, minimal impact on daily function",
  },
  {
    value: 2,
    label: "Low-Moderate",
    description: "Noticeable but manageable, slight impact on focus",
  },
  {
    value: 3,
    label: "Moderate",
    description: "Clear stress affecting some activities and decision-making",
  },
  {
    value: 4,
    label: "High",
    description: "Significant stress limiting performance and recovery",
  },
  {
    value: 5,
    label: "Severe",
    description: "Overwhelming stress severely impacting function and wellbeing",
  },
];

export default function StressLevelCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<CategoryRatingData | undefined>) {
  const categoryData = value || {};
  
  // Convert CategoryRatingData to internal format for easier manipulation
  const selectedStressCategories = Object.keys(categoryData).filter(key => categoryData[key].selected);

  const handleCategoryToggle = (categoryValue: string) => {
    const category = STRESS_CATEGORIES.find(c => c.value === categoryValue);
    const isSelected = categoryData[categoryValue]?.selected || false;

    if (isSelected) {
      // Remove the category
      const newCategoryData = { ...categoryData };
      delete newCategoryData[categoryValue];
      onChange(Object.keys(newCategoryData).length > 0 ? newCategoryData : undefined);
    } else {
      // Add the category
      const newCategoryData = {
        ...categoryData,
        [categoryValue]: {
          selected: true,
          label: category?.label || categoryValue,
          description: category?.description
        }
      };
      onChange(newCategoryData);
    }
  };

  const handleStressLevelChange = (category: string, level: number) => {
    const newCategoryData = {
      ...categoryData,
      [category]: {
        ...categoryData[category],
        rating: level
      }
    };
    onChange(newCategoryData);
  };

  const getStressRecommendation = (category: string, level: number) => {
    const recommendations = {
      physical: {
        1: <span className="inline-flex items-center space-x-1"><span className="text-success">✓</span><span>Well recovered, great for intense training</span></span>,
        2: <span className="inline-flex items-center space-x-1"><span className="text-success">⚡</span><span>Good energy, ready for challenging workouts</span></span>,
        3: <span className="inline-flex items-center space-x-1"><span className="text-warning">⚠️</span><span>Moderate fatigue, consider lighter intensity</span></span>,
        4: <span className="inline-flex items-center space-x-1"><span className="text-error">🛑</span><span>Significant fatigue, focus on recovery activities</span></span>,
        5: <span className="inline-flex items-center space-x-1"><span className="text-error">🚨</span><span>Severe fatigue, rest and recovery essential</span></span>,
      },
      mental_emotional: {
        1: <span className="inline-flex items-center space-x-1"><span className="text-success">✓</span><span>Clear focus, excellent for skill-based training</span></span>,
        2: <span className="inline-flex items-center space-x-1"><span className="text-success">🧠</span><span>Good mental state, ready for complex movements</span></span>,
        3: <span className="inline-flex items-center space-x-1"><span className="text-warning">💭</span><span>Some distraction, prefer routine exercises</span></span>,
        4: <span className="inline-flex items-center space-x-1"><span className="text-info">🧘</span><span>High stress, consider mindful movement or yoga</span></span>,
        5: <span className="inline-flex items-center space-x-1"><span className="text-info">🤝</span><span>Overwhelmed, seek support and gentle activities</span></span>,
      },
      environmental: {
        1: <span className="inline-flex items-center space-x-1"><span className="text-success">✓</span><span>Ideal conditions, any workout type suitable</span></span>,
        2: <span className="inline-flex items-center space-x-1"><span className="text-success">🌟</span><span>Good environment, minor adaptations may help</span></span>,
        3: <span className="inline-flex items-center space-x-1"><span className="text-warning">🔄</span><span>Some disruption, flexible routine recommended</span></span>,
        4: <span className="inline-flex items-center space-x-1"><span className="text-warning">🏠</span><span>Challenging environment, home workouts preferred</span></span>,
        5: <span className="inline-flex items-center space-x-1"><span className="text-error">⏸️</span><span>Chaotic conditions, postpone structured training</span></span>,
      },
      systemic: {
        1: <span className="inline-flex items-center space-x-1"><span className="text-success">✓</span><span>Fully balanced, optimal training capacity</span></span>,
        2: <span className="inline-flex items-center space-x-1"><span className="text-success">⚖️</span><span>Well-managed load, maintain current routine</span></span>,
        3: <span className="inline-flex items-center space-x-1"><span className="text-warning">📊</span><span>Noticeable load, monitor recovery closely</span></span>,
        4: <span className="inline-flex items-center space-x-1"><span className="text-error">⚠️</span><span>High allostatic load, reduce training volume</span></span>,
        5: <span className="inline-flex items-center space-x-1"><span className="text-error">🔴</span><span>Burnout risk, prioritize rest and recovery</span></span>,
      },
    };

    return recommendations[category as keyof typeof recommendations]?.[level as keyof typeof recommendations.physical] || null;
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-base-content/80 mb-3">
            Select any stress categories you're currently experiencing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STRESS_CATEGORIES.map((category) => {
              const isSelected = categoryData[category.value]?.selected || false;

              return (
                <button
                  key={category.value}
                  type="button"
                  className={`btn btn-sm justify-start ${
                    isSelected ? "btn-accent" : "btn-outline"
                  } ${disabled ? "btn-disabled" : ""}`}
                  onClick={() => handleCategoryToggle(category.value)}
                  disabled={disabled}
                  title={category.description}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stress Level Ratings for Selected Categories */}
        {selectedStressCategories.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium text-base-content">
              Rate the stress level for each selected category:
            </h4>
            
            {selectedStressCategories.map((categoryValue) => {
              const category = STRESS_CATEGORIES.find(c => c.value === categoryValue);
              const selectedLevel = categoryData[categoryValue]?.rating;
              const selectedStressLevel = STRESS_LEVELS.find(level => level.value === selectedLevel);
              
              return (
                <div key={categoryValue} className="border border-base-300 rounded-lg p-4">
                  <div className="mb-3">
                    <h5 className="font-medium text-base-content mb-1">{category?.label}</h5>
                    <p className="text-xs text-base-content/60 mb-3">{category?.description}</p>
                    
                    <div role="radiogroup" aria-labelledby={`stress-${categoryValue}-label`}>
                      <p id={`stress-${categoryValue}-label`} className="text-sm text-base-content/80 mb-3">
                        Rate stress level (1 = Mild, 5 = Severe)
                      </p>

                      <div className="rating rating-lg gap-2">
                        {STRESS_LEVELS.map((level) => {
                          const isSelected = selectedLevel === level.value;

                          return (
                            <button
                              key={level.value}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              aria-describedby={error ? `stress-${categoryValue}-error` : undefined}
                              className={`btn btn-circle ${
                                isSelected
                                  ? "btn-accent text-accent-content"
                                  : "btn-outline btn-accent"
                              } ${disabled ? "btn-disabled" : ""} font-bold text-base`}
                              onClick={() => handleStressLevelChange(categoryValue, level.value)}
                              disabled={disabled}
                              title={`${level.label}: ${level.description}`}
                            >
                              {level.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {selectedStressLevel && (
                    <div className="mt-4 bg-base-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-accent text-accent-content flex items-center justify-center font-bold text-sm">
                            {selectedStressLevel.value}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-accent mb-1">
                            {selectedStressLevel.label} {category?.label} Stress
                          </p>
                          <p className="text-xs text-base-content/70 leading-relaxed">
                            {selectedStressLevel.description}
                          </p>
                          
                          {/* Category-specific recommendations */}
                          <div className="mt-2 text-xs text-base-content/60">
                            {getStressRecommendation(categoryValue, selectedStressLevel.value)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="validator-hint mt-2" role="alert">{error}</p>}

      {selectedStressCategories.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-base-content/60 mb-2">
            Selected stress categories ({selectedStressCategories.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {selectedStressCategories.map((categoryValue) => {
              const categoryInfo = categoryData[categoryValue];
              const level = categoryInfo?.rating;
              const levelLabel = STRESS_LEVELS.find(l => l.value === level)?.label;
              
              return (
                <span
                  key={categoryValue}
                  className="badge badge-accent badge-outline badge-sm"
                >
                  {categoryInfo?.label}{level ? ` (${levelLabel})` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
