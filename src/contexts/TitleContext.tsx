"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

/**
 * TitleContextType interface defines the shape of our title context value.
 */
export interface TitleContextType {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}

/**
 * Create the context with default values
 */
export const TitleContext = createContext<TitleContextType>({
  title: "Dashboard",
  setTitle: () => {},
});

interface TitleProviderProps {
  children: ReactNode;
  defaultTitle?: string;
}

/**
 * Provider component for the TitleContext
 * Makes the title state available to any child component that calls useTitle()
 */
export function TitleProvider({
  children,
  defaultTitle = "Dashboard",
}: TitleProviderProps) {
  const [title, setTitle] = useState<string>(defaultTitle);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

/**
 * Custom hook to use and update the title
 * Throws an error if used outside of a TitleProvider
 */
export function useTitle(): TitleContextType {
  const context = useContext(TitleContext);

  if (!context) {
    throw new Error("useTitle must be used within a TitleProvider");
  }

  return context;
}
