'use client';

import React from 'react';
import { FormContainer } from '../organisms/FormContainer';

interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading...',
}) => {
  return (
    <FormContainer>
      <div className="flex flex-col items-center justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-base-content/70">{message}</p>
      </div>
    </FormContainer>
  );
};
