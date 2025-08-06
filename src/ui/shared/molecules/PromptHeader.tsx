'use client';

import React from 'react';
import { PromptLabel } from '../atoms/PromptLabel';
import { HintText } from '../atoms/HintText';
import { PopupLink } from '../atoms/PopupLink';

interface PromptHeaderProps {
  text: string;
  hintText?: string;
  popupText?: string;
  popupLinkText?: string;
  isRequired?: boolean;
  htmlFor?: string;
}

export const PromptHeader: React.FC<PromptHeaderProps> = ({
  text,
  hintText,
  popupText,
  popupLinkText,
  isRequired = false,
  htmlFor,
}) => {
  return (
    <div className="mb-2">
      <div className="flex items-start justify-between">
        <PromptLabel text={text} isRequired={isRequired} htmlFor={htmlFor} />
        {popupText && popupLinkText && (
          <PopupLink linkText={popupLinkText} popupText={popupText} />
        )}
      </div>
      {hintText && <HintText text={hintText} />}
    </div>
  );
};
