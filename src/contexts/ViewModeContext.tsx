import { createContext, useContext, ReactNode } from 'react';

export type ViewMode = 'simple' | 'detailed';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | null>(null);

interface ViewModeProviderProps {
  children: ReactNode;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}

export function ViewModeProvider({
  children,
  viewMode,
  setViewMode,
}: ViewModeProviderProps) {
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
