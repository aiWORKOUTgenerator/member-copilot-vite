import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  getAutoScrollPreferences,
  saveAutoScrollPreferences,
  AutoScrollPreferences,
} from '@/config/autoScroll';

export interface AutoScrollContextType extends AutoScrollPreferences {
  setEnabled: (enabled: boolean) => void;
  setDelay: (delay: number) => void;
}

export const AutoScrollContext = createContext<AutoScrollContextType | null>(
  null
);

interface AutoScrollProviderProps {
  children: ReactNode;
}

/**
 * Provider for global auto-scroll preferences
 * Manages persistence and provides consistent settings across the app
 */
export const AutoScrollProvider: React.FC<AutoScrollProviderProps> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<AutoScrollPreferences>(() =>
    getAutoScrollPreferences()
  );

  // Save preferences when they change
  useEffect(() => {
    saveAutoScrollPreferences(preferences);
  }, [preferences]);

  const setEnabled = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, enabled }));
  };

  const setDelay = (delay: number) => {
    setPreferences((prev) => ({ ...prev, delay }));
  };

  const contextValue: AutoScrollContextType = {
    ...preferences,
    setEnabled,
    setDelay,
  };

  return (
    <AutoScrollContext.Provider value={contextValue}>
      {children}
    </AutoScrollContext.Provider>
  );
};

// Hook moved to separate file to avoid fast refresh warning
