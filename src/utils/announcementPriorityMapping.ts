/**
 * Priority mapping utility for gym announcements
 * Maps generic backend priorities to gym-relevant terms
 */

export type GenericPriority = 'high' | 'medium' | 'low';
export type GymPriorityLabel = 'Challenge Alert' | 'Announcement' | 'Offer';

export interface PriorityMapping {
  label: GymPriorityLabel;
  description: string;
  color: 'error' | 'warning' | 'info';
  icon: string;
}

/**
 * Maps generic backend priorities to gym-relevant terms
 *
 * HIGH -> Challenge Alert (urgent, time-sensitive, action required)
 * MEDIUM -> Announcement (important updates, policy changes)
 * LOW -> Offer (promotions, general information)
 */
export const PRIORITY_MAPPING: Record<GenericPriority, PriorityMapping> = {
  high: {
    label: 'Challenge Alert',
    description: 'Time-sensitive challenges and urgent updates',
    color: 'error',
    icon: '🏆',
  },
  medium: {
    label: 'Announcement',
    description: 'Important updates and policy changes',
    color: 'warning',
    icon: '📢',
  },
  low: {
    label: 'Offer',
    description: 'Promotions and general information',
    color: 'info',
    icon: '🎁',
  },
};

/**
 * Gets the gym-relevant priority mapping for a given generic priority
 */
export function getPriorityMapping(priority: GenericPriority): PriorityMapping {
  return PRIORITY_MAPPING[priority];
}

/**
 * Gets the display label for a priority
 */
export function getPriorityLabel(priority: GenericPriority): GymPriorityLabel {
  return PRIORITY_MAPPING[priority].label;
}

/**
 * Gets the color class for a priority badge
 */
export function getPriorityColor(priority: GenericPriority): string {
  return `badge-${PRIORITY_MAPPING[priority].color}`;
}

/**
 * Gets the icon for a priority
 */
export function getPriorityIcon(priority: GenericPriority): string {
  return PRIORITY_MAPPING[priority].icon;
}
