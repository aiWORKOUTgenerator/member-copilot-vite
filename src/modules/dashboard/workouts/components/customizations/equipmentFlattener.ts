// Simple Equipment Data Flattener
// Transforms complex equipment data into a flat, queryable format

import { EquipmentSelectionData } from "../types";

// Simple flattened structure - just the essentials
export interface SimpleEquipmentFlat {
  // Core selections
  equipment_location: string | null;
  equipment_contexts: string;  // comma-separated
  equipment_list: string;      // comma-separated
  
  // Key boolean flags (just the important ones)
  has_weights: boolean;
  has_cardio: boolean;
  has_bodyweight: boolean;
  
  // Weight summary (if any)
  min_weight: number | null;
  max_weight: number | null;
  weight_count: number;
  
  // Backup (for complex queries)
  equipment_data_json: string; // stringified original object
  
  // Meta
  updated_at: string;
}

// Helper function for older TypeScript support
function arrayIncludes<T>(array: T[], item: T): boolean {
  return array.indexOf(item) !== -1;
}

// Simple flattener function
export function flattenEquipmentData(data: EquipmentSelectionData | string[] | undefined): SimpleEquipmentFlat {
  // Handle undefined/null input
  if (!data) {
    return {
      equipment_location: null,
      equipment_contexts: '',
      equipment_list: '',
      has_weights: false,
      has_cardio: false,
      has_bodyweight: false,
      min_weight: null,
      max_weight: null,
      weight_count: 0,
      equipment_data_json: JSON.stringify(null),
      updated_at: new Date().toISOString()
    };
  }
  
  // Handle legacy format (string array)
  if (Array.isArray(data)) {
    const hasWeightEquipment = ['dumbbells', 'barbells', 'kettlebells'].some(eq => 
      arrayIncludes(data, eq)
    );
    const hasCardio = ['treadmill', 'elliptical', 'stationary_bike', 'rowing_machine'].some(eq => 
      arrayIncludes(data, eq)
    );
    const hasBodyweight = arrayIncludes(data, 'yoga_mat') || arrayIncludes(data, 'pull_up_bar');
    
    return {
      equipment_location: null,
      equipment_contexts: '',
      equipment_list: data.join(','),
      has_weights: hasWeightEquipment,
      has_cardio: hasCardio,
      has_bodyweight: hasBodyweight,
      min_weight: null,
      max_weight: null,
      weight_count: 0,
      equipment_data_json: JSON.stringify(data),
      updated_at: new Date().toISOString()
    };
  }
  
  // Handle modern format (EquipmentSelectionData)
  const allWeights = Object.keys(data.weights || {}).reduce((acc, key) => {
    const weights = data.weights![key] || [];
    return acc.concat(weights);
  }, [] as number[]);
  
  const hasWeightEquipment = ['dumbbells', 'barbells', 'kettlebells', 'plates', 'adjustable_dumbbells'].some(eq => 
    arrayIncludes(data.specificEquipment || [], eq)
  );
  
  const hasCardio = (data.specificEquipment || []).some(eq => 
    ['treadmill', 'elliptical', 'stationary_bike', 'rowing_machine'].some(cardioEq => eq === cardioEq)
  ) || (data.contexts || []).some(ctx => 
    ['Basic Cardio', 'Advanced Cardio', 'Minimal Cardio', 'Cardio Machines', 'Cardio'].some(cardioCtx => ctx === cardioCtx)
  );
  
  const hasBodyweight = arrayIncludes(data.contexts || [], 'Bodyweight') || 
    arrayIncludes(data.specificEquipment || [], 'yoga_mat') || 
    arrayIncludes(data.specificEquipment || [], 'pull_up_bar');
  
  return {
    equipment_location: data.location || null,
    equipment_contexts: (data.contexts || []).join(','),
    equipment_list: (data.specificEquipment || []).join(','),
    has_weights: hasWeightEquipment || allWeights.length > 0,
    has_cardio: hasCardio,
    has_bodyweight: hasBodyweight,
    min_weight: allWeights.length ? Math.min(...allWeights) : null,
    max_weight: allWeights.length ? Math.max(...allWeights) : null,
    weight_count: allWeights.length,
    equipment_data_json: JSON.stringify(data),
    updated_at: data.lastUpdated ? data.lastUpdated.toISOString() : new Date().toISOString()
  };
}

// Simple usage example
export function getEquipmentSummary(flattened: SimpleEquipmentFlat): string {
  const parts = [];
  
  if (flattened.equipment_location) {
    parts.push(`Location: ${flattened.equipment_location}`);
  }
  
  if (flattened.has_weights) {
    if (flattened.min_weight && flattened.max_weight) {
      parts.push(`Weights: ${flattened.min_weight}-${flattened.max_weight} lbs`);
    } else {
      parts.push('Weights available');
    }
  }
  
  if (flattened.has_cardio) parts.push('Cardio');
  if (flattened.has_bodyweight) parts.push('Bodyweight');
  
  return parts.join(' • ') || 'No equipment selected';
} 