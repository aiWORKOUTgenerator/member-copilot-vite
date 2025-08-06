import { useContext } from 'react';
import { TitleContext, TitleContextType } from '@/contexts/title.types';

/**
 * Custom hook to use and update the title
 * Throws an error if used outside of a TitleProvider
 */
export function useTitle(): TitleContextType {
  const context = useContext(TitleContext);

  if (!context) {
    throw new Error('useTitle must be used within a TitleProvider');
  }

  return context;
}
