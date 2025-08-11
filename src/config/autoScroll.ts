/**
 * Global configuration for auto-scroll functionality
 */
export const AUTO_SCROLL_CONFIG = {
  /** Default delay before scrolling (ms) */
  defaultDelay: 1200,
  /** Default scroll behavior */
  defaultBehavior: 'smooth' as ScrollBehavior,
  /** Toast notification duration (ms) */
  toastDuration: 1800,
  /** Enable auto-scroll by default */
  enabledByDefault: true,
  /** Local storage key for user preferences */
  storageKey: 'auto-scroll-preferences',
} as const;

/**
 * Auto-scroll user preferences interface
 */
export interface AutoScrollPreferences {
  enabled: boolean;
  delay: number;
}

/**
 * Get user auto-scroll preferences from localStorage
 */
export const getAutoScrollPreferences = (): AutoScrollPreferences => {
  try {
    const stored = localStorage.getItem(AUTO_SCROLL_CONFIG.storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        enabled: parsed.enabled ?? AUTO_SCROLL_CONFIG.enabledByDefault,
        delay: parsed.delay ?? AUTO_SCROLL_CONFIG.defaultDelay,
      };
    }
  } catch (error) {
    console.warn('Failed to load auto-scroll preferences:', error);
  }

  return {
    enabled: AUTO_SCROLL_CONFIG.enabledByDefault,
    delay: AUTO_SCROLL_CONFIG.defaultDelay,
  };
};

/**
 * Save user auto-scroll preferences to localStorage
 */
export const saveAutoScrollPreferences = (
  preferences: AutoScrollPreferences
): void => {
  try {
    localStorage.setItem(
      AUTO_SCROLL_CONFIG.storageKey,
      JSON.stringify(preferences)
    );
  } catch (error) {
    console.warn('Failed to save auto-scroll preferences:', error);
  }
};
