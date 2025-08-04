import { createContext, Dispatch, SetStateAction } from "react";

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
