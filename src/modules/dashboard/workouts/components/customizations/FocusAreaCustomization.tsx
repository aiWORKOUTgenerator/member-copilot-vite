import { useState } from "react";
import { CustomizationComponentProps, HierarchicalSelectionData } from "../types";

// Primary regions
const PRIMARY_REGIONS = [
  { label: "Upper Body", value: "upper_body" },
  { label: "Lower Body", value: "lower_body" },
  { label: "Core", value: "core" },
  { label: "Full Body", value: "full_body" },
  { label: "Mobility & Flexibility", value: "mobility" },
  { label: "Recovery & Stretching", value: "recovery" },
];

// Secondary muscle groups by primary region
const SECONDARY_MUSCLES = {
  upper_body: [
    { label: "Chest", value: "chest", hasTertiary: true },
    { label: "Back", value: "back", hasTertiary: true },
    { label: "Shoulders", value: "shoulders", hasTertiary: true },
    { label: "Biceps", value: "biceps", hasTertiary: true },
    { label: "Triceps", value: "triceps", hasTertiary: true },
  ],
  lower_body: [
    { label: "Quads", value: "quads", hasTertiary: true },
    { label: "Hamstrings", value: "hamstrings", hasTertiary: true },
    { label: "Glutes", value: "glutes", hasTertiary: true },
    { label: "Calves", value: "calves", hasTertiary: true },
  ],
  core: [
    { label: "Abs", value: "abs", hasTertiary: true },
    { label: "Obliques", value: "obliques", hasTertiary: true },
    { label: "Lower Back", value: "lower_back", hasTertiary: true },
  ],
  full_body: [
    { label: "Core & Stabilizers", value: "full_body_core", hasTertiary: true },
    { label: "Posterior Chain", value: "posterior_chain", hasTertiary: true },
    { label: "Functional Movement", value: "functional_movement", hasTertiary: true },
  ],
  mobility: [
    { label: "Hips", value: "hips", hasTertiary: true },
    { label: "Ankles", value: "ankles", hasTertiary: true },
    { label: "Shoulders", value: "mobility_shoulders", hasTertiary: true },
    { label: "Thoracic Spine", value: "thoracic_spine", hasTertiary: false },
  ],
  recovery: [
    { label: "Foam Rolling", value: "foam_rolling", hasTertiary: false },
    { label: "Static Stretching", value: "static_stretching", hasTertiary: false },
    { label: "PNF", value: "pnf", hasTertiary: false },
    { label: "Breathing/Meditation", value: "breathing_meditation", hasTertiary: false },
  ],
};

// Tertiary specific areas
const TERTIARY_AREAS = {
  chest: [
    { label: "Upper Chest (Clavicular)", value: "upper_chest" },
    { label: "Lower Chest (Sternal)", value: "lower_chest" },
  ],
  back: [
    { label: "Lats (Wing Muscles)", value: "lats" },
    { label: "Traps (Upper Back)", value: "traps" },
    { label: "Rhomboids (Mid Back)", value: "rhomboids" },
    { label: "Erector Spinae (Lower Back)", value: "erector_spinae" },
  ],
  shoulders: [
    { label: "Front Delts (Anterior)", value: "anterior_delt" },
    { label: "Side Delts (Lateral)", value: "lateral_delt" },
    { label: "Rear Delts (Posterior)", value: "rear_delt" },
  ],
  biceps: [
    { label: "Inner Bicep (Short Head)", value: "biceps_short_head" },
    { label: "Outer Bicep (Long Head)", value: "biceps_long_head" },
    { label: "Brachialis (Deep Arm)", value: "brachialis" },
  ],
  triceps: [
    { label: "Long Head (Inner Tricep)", value: "triceps_long_head" },
    { label: "Lateral Head (Outer Tricep)", value: "triceps_lateral_head" },
    { label: "Medial Head (Deep Tricep)", value: "triceps_medial_head" },
  ],
  quads: [
    { label: "Rectus Femoris (Center Quad)", value: "rectus_femoris" },
    { label: "Vastus Lateralis (Outer Quad)", value: "vastus_lateralis" },
    { label: "Vastus Medialis (Inner Quad/VMO)", value: "vastus_medialis" },
    { label: "Vastus Intermedius (Deep Quad)", value: "vastus_intermedius" },
  ],
  glutes: [
    { label: "Glute Max (Main Butt Muscle)", value: "glute_max" },
    { label: "Glute Med (Side Glutes)", value: "glute_med" },
    { label: "Glute Min (Deep Side Glutes)", value: "glute_min" },
  ],
  hamstrings: [
    { label: "Biceps Femoris (Outer Hamstring)", value: "biceps_femoris" },
    { label: "Semitendinosus (Inner Hamstring)", value: "semitendinosus" },
    { label: "Semimembranosus (Deep Inner Hamstring)", value: "semimembranosus" },
  ],
  calves: [
    { label: "Inner Calf (Medial Gastrocnemius)", value: "gastrocnemius_medial" },
    { label: "Outer Calf (Lateral Gastrocnemius)", value: "gastrocnemius_lateral" },
    { label: "Deep Calf (Soleus)", value: "soleus" },
  ],
  abs: [
    { label: "Upper Abs (Top Six-Pack)", value: "upper_abs" },
    { label: "Lower Abs (Bottom Six-Pack)", value: "lower_abs" },
    { label: "Deep Core (TVA)", value: "tva" },
    { label: "Pelvic Floor (Core Foundation)", value: "pelvic_floor" },
  ],
  obliques: [
    { label: "Internal Obliques (Deep Side Abs)", value: "internal_obliques" },
    { label: "External Obliques (Surface Side Abs)", value: "external_obliques" },
  ],
  lower_back: [
    { label: "Erector Spinae (Spine Muscles)", value: "lower_erector_spinae" },
    { label: "Multifidus (Deep Spine Stabilizers)", value: "multifidus" },
    { label: "QL (Side Lower Back)", value: "quadratus_lumborum" },
  ],
  hips: [
    { label: "Hip Flexors (Front Hip)", value: "hip_flexors" },
    { label: "Glute Med (Side Hip)", value: "hip_glute_med" },
    { label: "TFL (Hip/IT Band)", value: "tfl" },
    { label: "Piriformis (Deep Hip)", value: "piriformis" },
  ],
  ankles: [
    { label: "Shin Muscles (Dorsiflexors)", value: "dorsiflexors" },
    { label: "Calf Muscles (Plantarflexors)", value: "plantarflexors" },
    { label: "Inner Ankle (Inverters)", value: "inverters" },
    { label: "Outer Ankle (Everters)", value: "everters" },
  ],
  mobility_shoulders: [
    { label: "Front Rotator Cuff (Subscapularis)", value: "subscapularis" },
    { label: "Top Rotator Cuff (Supraspinatus)", value: "supraspinatus" },
    { label: "Back Rotator Cuff (Infraspinatus)", value: "infraspinatus" },
    { label: "Small Rotator Cuff (Teres Minor)", value: "teres_minor" },
  ],
  full_body_core: [
    { label: "Deep Stabilizers (TVA)", value: "deep_stabilizers" },
    { label: "Diaphragm & Breathing", value: "diaphragm_breathing" },
    { label: "Multifidus (Spine Stability)", value: "multifidus_spine" },
    { label: "Pelvic Floor (Foundation)", value: "pelvic_floor_stability" },
  ],
  posterior_chain: [
    { label: "Glutes & Hamstrings", value: "glutes_hamstrings" },
    { label: "Erector Spinae (Back)", value: "erector_spinae_back" },
    { label: "Lats & Rhomboids", value: "lats_rhomboids" },
    { label: "Rear Delts & Traps", value: "rear_delts_traps" },
  ],
  functional_movement: [
    { label: "Hip-Shoulder Integration", value: "hip_shoulder_integration" },
    { label: "Anti-Rotation (Core)", value: "anti_rotation_core" },
    { label: "Multi-Planar Movement", value: "multi_planar_movement" },
    { label: "Compound Movement Patterns", value: "compound_patterns" },
  ],
};

// Helper functions to work with the 3-tier data structure
const getAllSelectableOptions = () => {
  const options: Array<{ label: string; value: string; level: 'primary' | 'secondary' | 'tertiary' }> = [];
  
  // Add primary regions
  PRIMARY_REGIONS.forEach(primary => {
    options.push({ label: primary.label, value: primary.value, level: 'primary' });
  });
  
  // Add secondary muscles
  Object.values(SECONDARY_MUSCLES).flat().forEach(secondary => {
    options.push({ label: secondary.label, value: secondary.value, level: 'secondary' });
  });
  
  // Add tertiary areas
  Object.values(TERTIARY_AREAS).flat().forEach(tertiary => {
    options.push({ label: tertiary.label, value: tertiary.value, level: 'tertiary' });
  });
  
  return options;
};

const findOptionInfo = (value: string) => {
  const allOptions = getAllSelectableOptions();
  return allOptions.find(option => option.value === value);
};

// Advanced helper functions for hierarchical relationships
const getParentKey = (value: string, level: 'primary' | 'secondary' | 'tertiary'): string | undefined => {
  if (level === 'primary') return undefined;
  
  if (level === 'secondary') {
    // Find which primary region contains this secondary muscle
    for (const [primaryKey, secondaries] of Object.entries(SECONDARY_MUSCLES)) {
      if (secondaries.some(secondary => secondary.value === value)) {
        return primaryKey;
      }
    }
  }
  
  if (level === 'tertiary') {
    // Find which secondary muscle contains this tertiary area
    for (const [secondaryKey, tertiaries] of Object.entries(TERTIARY_AREAS)) {
      if (tertiaries.some(tertiary => tertiary.value === value)) {
        return secondaryKey;
      }
    }
  }
  
  return undefined;
};

const getChildrenKeys = (value: string, level: 'primary' | 'secondary' | 'tertiary'): string[] | undefined => {
  if (level === 'primary') {
    return (SECONDARY_MUSCLES as Record<string, { value: string; label: string }[]>)[value]?.map((secondary) => secondary.value);
  }
  
  if (level === 'secondary') {
    return (TERTIARY_AREAS as Record<string, { value: string; label: string }[]>)[value]?.map((tertiary) => tertiary.value);
  }
  
  // Tertiary level has no children
  return undefined;
};

const getAllDescendants = (value: string, level: 'primary' | 'secondary' | 'tertiary'): string[] => {
  const descendants: string[] = [];
  
  if (level === 'primary') {
    // Get all secondary and tertiary descendants
    const secondaries = (SECONDARY_MUSCLES as Record<string, { value: string; label: string }[]>)[value] || [];
    secondaries.forEach((secondary) => {
      descendants.push(secondary.value);
      
      const tertiaries = (TERTIARY_AREAS as Record<string, { value: string; label: string }[]>)[secondary.value] || [];
      tertiaries.forEach((tertiary) => {
        descendants.push(tertiary.value);
      });
    });
  } else if (level === 'secondary') {
    // Get all tertiary descendants
    const tertiaries = (TERTIARY_AREAS as Record<string, { value: string; label: string }[]>)[value] || [];
    tertiaries.forEach((tertiary) => {
      descendants.push(tertiary.value);
    });
  }
  
  return descendants;
};


// Smart summary analysis for intelligent display
const analyzeSelectionSummary = (hierarchicalData: HierarchicalSelectionData) => {
  const selectedEntries = Object.entries(hierarchicalData).filter(([, info]) => info.selected);
  const primary = selectedEntries.filter(([, info]) => info.level === 'primary');
  const secondary = selectedEntries.filter(([, info]) => info.level === 'secondary');
  const tertiary = selectedEntries.filter(([, info]) => info.level === 'tertiary');
  
  return {
    total: selectedEntries.length,
    primary: primary.map(([key, info]) => ({ key, info })),
    secondary: secondary.map(([key, info]) => ({ key, info })),
    tertiary: tertiary.map(([key, info]) => ({ key, info })),
    hasComplexSelection: selectedEntries.length > 6,
    hasMultipleLevels: primary.length > 0 && (secondary.length > 0 || tertiary.length > 0)
  };
};

export default function FocusAreaCustomization({
  value,
  onChange,
  disabled = false,
  error,
}: CustomizationComponentProps<HierarchicalSelectionData | undefined>) {
  const hierarchicalData = value || {};
  
  // Multi-level expansion state management (will be used in Phase 3 UI)
  const [expandedPrimary, setExpandedPrimary] = useState<Set<string>>(new Set());
  const [expandedTertiary, setExpandedTertiary] = useState<Set<string>>(new Set());
  

  
  // Extract selected areas from hierarchical data for backward compatibility with current UI
  const selectedAreas = Object.keys(hierarchicalData).filter(key => hierarchicalData[key]?.selected);

  // Smart expansion management functions
  const togglePrimaryExpansion = (primaryValue: string) => {
    setExpandedPrimary(prev => {
      const newSet = new Set(prev);
      if (newSet.has(primaryValue)) {
        newSet.delete(primaryValue);
        // Collapse all related tertiary sections
        setExpandedTertiary(prev => {
          const newTertiary = new Set(prev);
          const secondaries = (SECONDARY_MUSCLES as Record<string, { value: string; label: string }[]>)[primaryValue] || [];
          secondaries.forEach((secondary) => {
            newTertiary.delete(secondary.value);
          });
          return newTertiary;
        });
      } else {
        newSet.add(primaryValue);
      }
      return newSet;
    });
  };

  const toggleTertiaryExpansion = (secondaryValue: string) => {
    setExpandedTertiary(prev => {
      const newSet = new Set(prev);
      if (newSet.has(secondaryValue)) {
        newSet.delete(secondaryValue);
      } else {
        newSet.add(secondaryValue);
      }
      return newSet;
    });
  };

  // Advanced cascading selection logic
  const handleAreaToggle = (areaValue: string, level?: 'primary' | 'secondary' | 'tertiary') => {
    const isSelected = selectedAreas.includes(areaValue);
    const optionInfo = findOptionInfo(areaValue);
    const actualLevel = level || optionInfo?.level || 'primary';

    if (isSelected) {
      // Smart removal with cascade
      const newHierarchicalData = { ...hierarchicalData };
      
      // Remove the area itself
      delete newHierarchicalData[areaValue];
      
      // Remove all descendants based on level
      const descendants = getAllDescendants(areaValue, actualLevel);
      descendants.forEach(descendant => {
        delete newHierarchicalData[descendant];
      });
      
      // Update expansion states
      if (actualLevel === 'primary') {
        setExpandedPrimary(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaValue);
          return newSet;
        });
      } else if (actualLevel === 'secondary') {
        setExpandedTertiary(prev => {
          const newSet = new Set(prev);
          newSet.delete(areaValue);
          return newSet;
        });
      }
      
      onChange(Object.keys(newHierarchicalData).length > 0 ? newHierarchicalData : undefined);
    } else {
      // Smart addition with parent relationship building
      const parentKey = getParentKey(areaValue, actualLevel);
      const childrenKeys = getChildrenKeys(areaValue, actualLevel);
      
      const newHierarchicalData = {
        ...hierarchicalData,
        [areaValue]: {
          selected: true,
          label: optionInfo?.label || areaValue,
          level: actualLevel,
          description: undefined,
          parentKey: parentKey,
          children: childrenKeys
        }
      };
      
      // Auto-expand if selecting a primary with children
      if (actualLevel === 'primary' && childrenKeys && childrenKeys.length > 0) {
        setExpandedPrimary(prev => new Set(prev).add(areaValue));
      }
      
      // Auto-expand tertiary if selecting a secondary with tertiary children
      if (actualLevel === 'secondary' && childrenKeys && childrenKeys.length > 0) {
        setExpandedTertiary(prev => new Set(prev).add(areaValue));
      }
      
      onChange(newHierarchicalData);
    }
  };

  // Handle secondary click logic - for Phase 3 UI
  const handleSecondaryClick = (secondaryValue: string, _hasTertiary: boolean) => {
    // Always toggle selection - handleAreaToggle already handles expansion logic perfectly
    handleAreaToggle(secondaryValue, 'secondary');
  };
  


  return (
    <div>
      <div className="space-y-6">
        {/* Primary Level - Pill-style buttons like SorenessCustomization */}
        <div>
          <p className="text-sm text-base-content/80 mb-3">
            Select the body regions or workout types you want to focus on:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRIMARY_REGIONS.map((region) => {
              const isSelected = selectedAreas.includes(region.value);
              const isExpanded = expandedPrimary.has(region.value);

              return (
                <button
                  key={region.value}
                  type="button"
                  className={`btn btn-sm justify-start h-auto min-h-[2.5rem] py-3 px-4 ${
                    isSelected ? "btn-primary" : "btn-outline"
                  } ${disabled ? "btn-disabled" : ""}`}
                  onClick={() => handleAreaToggle(region.value)}
                  disabled={disabled}
                >
                  <span className="flex-1 text-left">{region.label}</span>
                  {isSelected && (SECONDARY_MUSCLES as Record<string, { value: string; label: string; hasTertiary?: boolean }[]>)[region.value] && (
                    <span className="ml-2 badge badge-primary-content badge-xs flex-shrink-0">
                      {isExpanded ? '−' : '+'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Level - Expandable sections for selected primaries */}
        {PRIMARY_REGIONS.map((region) => {
          const isPrimarySelected = selectedAreas.includes(region.value);
          const isExpanded = expandedPrimary.has(region.value);
          const secondaryMuscles = (SECONDARY_MUSCLES as Record<string, { value: string; label: string; hasTertiary?: boolean }[]>)[region.value];

          return (
            isPrimarySelected && isExpanded && secondaryMuscles && (
              <div key={`${region.value}-secondary`} className="border border-base-300 rounded-lg p-4">
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-base-content">{region.label} - Specific Muscles</h4>
                    <button
                      type="button"
                      className={`btn btn-xs btn-ghost`}
                      onClick={() => togglePrimaryExpansion(region.value)}
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-base-content/80 mb-3">
                    Select specific muscle groups within {region.label.toLowerCase()}:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {secondaryMuscles.map((secondary: { value: string; label: string; hasTertiary?: boolean }) => {
                      const isSecondarySelected = selectedAreas.includes(secondary.value);

                      return (
                        <button
                          key={secondary.value}
                          type="button"
                          className={`btn btn-sm justify-start h-auto min-h-[2.25rem] py-2 px-3 ${
                            isSecondarySelected ? "btn-secondary" : "btn-outline"
                          } ${disabled ? "btn-disabled" : ""}`}
                          onClick={() => handleSecondaryClick(secondary.value, secondary.hasTertiary || false)}
                          disabled={disabled}
                          title={secondary.hasTertiary ? "Click to select or expand for specific areas" : ""}
                        >
                          <span className="flex-1 text-left">{secondary.label}</span>
                          {isSecondarySelected && secondary.hasTertiary && (
                            <span className="ml-2 badge badge-secondary-content badge-xs flex-shrink-0">
                              {expandedTertiary.has(secondary.value) ? '−' : '+'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tertiary Level - Expandable sections for selected secondaries */}
                {secondaryMuscles.map((secondary: { value: string; label: string; hasTertiary?: boolean }) => {
                  const isSecondarySelected = selectedAreas.includes(secondary.value);
                  const isTertiaryExpanded = expandedTertiary.has(secondary.value);
                  const tertiaryAreas = (TERTIARY_AREAS as Record<string, { value: string; label: string }[]>)[secondary.value];

                  return (
                    isSecondarySelected && isTertiaryExpanded && tertiaryAreas && (
                      <div key={`${secondary.value}-tertiary`} className="mt-4 bg-base-100 border border-base-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-medium text-base-content text-sm">
                            {secondary.label} - Specific Areas
                          </h5>
                          <button
                            type="button"
                            className="btn btn-xs btn-ghost"
                            onClick={() => toggleTertiaryExpansion(secondary.value)}
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-sm text-base-content/80 mb-3">
                          Target specific areas within {secondary.label.toLowerCase()}:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tertiaryAreas.map((tertiary: { value: string; label: string }) => {
                            const isTertiarySelected = selectedAreas.includes(tertiary.value);

                            return (
                              <label
                                key={tertiary.value}
                                className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-base-200 transition-colors border border-base-300"
                              >
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-sm checkbox-accent"
                                  checked={isTertiarySelected}
                                  onChange={() => handleAreaToggle(tertiary.value, 'tertiary')}
                                  disabled={disabled}
                                />
                                <span className="text-sm text-base-content font-medium flex-1">
                                  {tertiary.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            )
          );
        })}
      </div>

      {error && <p className="validator-hint mt-2" role="alert">{error}</p>}

      {selectedAreas.length > 0 && (() => {
        const summary = analyzeSelectionSummary(hierarchicalData);
        
        return (
          <div className="mt-4">
            <p className="text-xs text-base-content/60 mb-2">
              Selected focus areas ({summary.total}):
            </p>
            
            {summary.hasComplexSelection ? (
              // Compact summary for complex selections
              <div className="space-y-2">
                {summary.primary.length > 0 && (
                  <div>
                    <span className="text-xs text-base-content/40 mr-2">Regions:</span>
                    <div className="inline-flex flex-wrap gap-1">
                      {summary.primary.map(({ key, info }) => (
                        <span key={key} className="badge badge-primary badge-sm">
                          {info.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {summary.secondary.length > 0 && (
                  <div>
                    <span className="text-xs text-base-content/40 mr-2">Muscles:</span>
                    <div className="inline-flex flex-wrap gap-1">
                      {summary.secondary.slice(0, 4).map(({ key, info }) => (
                        <span key={key} className="badge badge-secondary badge-outline badge-sm">
                          {info.label}
                        </span>
                      ))}
                      {summary.secondary.length > 4 && (
                        <span className="badge badge-secondary badge-outline badge-sm">
                          +{summary.secondary.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {summary.tertiary.length > 0 && (
                  <div>
                    <span className="text-xs text-base-content/40 mr-2">Specific Areas:</span>
                    <div className="inline-flex flex-wrap gap-1">
                      {summary.tertiary.slice(0, 3).map(({ key, info }) => (
                        <span key={key} className="badge badge-accent badge-outline badge-xs">
                          {info.label}
                        </span>
                      ))}
                      {summary.tertiary.length > 3 && (
                        <span className="badge badge-accent badge-outline badge-xs">
                          +{summary.tertiary.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Full display for simple selections
              <div className="flex flex-wrap gap-1">
                {Object.entries(hierarchicalData)
                  .filter(([, info]) => info.selected)
                  .map(([key, info]) => {
                    let badgeClass = "badge badge-sm";
                    let label = info.label;
                    
                    if (info.level === 'primary') {
                      badgeClass += " badge-primary";
                      
                    } else if (info.level === 'secondary') {
                      badgeClass += " badge-secondary badge-outline";
                      const parent = info.parentKey ? hierarchicalData[info.parentKey] : null;
                      if (parent) {
                        label = `${parent.label} > ${info.label}`;
                      }
                      
                    } else if (info.level === 'tertiary') {
                      badgeClass += " badge-accent badge-outline badge-xs";
                      const parent = info.parentKey ? hierarchicalData[info.parentKey] : null;
                      const grandparent = parent?.parentKey ? hierarchicalData[parent.parentKey] : null;
                      
                      if (grandparent && parent) {
                        label = `${grandparent.label} > ${parent.label} > ${info.label}`;
                      } else if (parent) {
                        label = `${parent.label} > ${info.label}`;
                      }
                    }
                    
                    return (
                      <span key={key} className={badgeClass}>
                        {label}
                      </span>
                    );
                  })}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
