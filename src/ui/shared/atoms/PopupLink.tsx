"use client";
import React, { useState } from "react";

interface PopupLinkProps {
  linkText: string;
  popupText: string;
}

export const PopupLink: React.FC<PopupLinkProps> = ({
  linkText,
  popupText,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!linkText || !popupText) return null;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="btn btn-link btn-xs p-0 h-auto min-h-0 text-info normal-case"
        onClick={() => setIsOpen(!isOpen)}
      >
        {linkText}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-10 p-4 bg-base-100 shadow-lg rounded-lg w-64 text-sm mt-1">
            {popupText}
          </div>
        </>
      )}
    </div>
  );
};
