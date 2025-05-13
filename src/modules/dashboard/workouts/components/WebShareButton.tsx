"use client";

import { useState } from "react";

interface WebShareProps {
  title?: string;
  text: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const WebShareButton = ({ title, text, children, disabled }: WebShareProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Shared Content",
          text: text,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.log("Error sharing content:", error);
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.log("Failed to copy: ", err);
        alert("Unable to share or copy. Please copy the text manually.");
      }
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleShare}
        className={`btn btn-secondary btn-sm ${disabled ? "opacity-50" : ""}`}
        disabled={disabled}
      >
        {copied ? "Copied!" : children}
      </button>
    </div>
  );
};

export default WebShareButton;
