import { useContext } from 'react';
import {
  AutoScrollContext,
  AutoScrollContextType,
} from '@/contexts/AutoScrollContext';

/**
 * Hook to access auto-scroll preferences
 */
export const useAutoScrollPreferences = (): AutoScrollContextType => {
  const context = useContext(AutoScrollContext);
  if (!context) {
    throw new Error(
      'useAutoScrollPreferences must be used within an AutoScrollProvider'
    );
  }
  return context;
};
