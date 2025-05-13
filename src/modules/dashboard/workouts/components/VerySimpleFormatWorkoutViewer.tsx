"use client";

import { useEffect, useState } from "react";

interface VerySimpleFormatWorkoutViewerProps {
  verySimpleFormat: string | null;
}

const VerySimpleFormatWorkoutViewer = ({
  verySimpleFormat,
}: VerySimpleFormatWorkoutViewerProps) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (verySimpleFormat) {
      setContent(verySimpleFormat);
    } else {
      setContent("No quick view format available for this workout.");
    }
  }, [verySimpleFormat]);

  if (!content) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-4">
      <div className="prose prose-sm sm:prose lg:prose-lg w-full whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};

export default VerySimpleFormatWorkoutViewer;
