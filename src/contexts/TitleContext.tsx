'use client';

import { ReactNode, useState } from 'react';
import { TitleContext } from './title.types';

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
  defaultTitle = 'Dashboard',
}: TitleProviderProps) {
  const [title, setTitle] = useState<string>(defaultTitle);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}
