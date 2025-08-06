'use client';
import React from 'react';

interface HintTextProps {
  text: string;
}

export const HintText: React.FC<HintTextProps> = ({ text }) => {
  if (!text) return null;

  return <div className="text-sm text-base-content/70 mt-1 mb-2">{text}</div>;
};
