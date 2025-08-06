'use client';

import { useEffect, useState } from 'react';

interface SimpleFormatWorkoutViewerProps {
  simpleFormat: string | null;
}

const SimpleFormatWorkoutViewer = ({
  simpleFormat,
}: SimpleFormatWorkoutViewerProps) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (simpleFormat) {
      setContent(simpleFormat);
    } else {
      setContent('No simple format available for this workout.');
    }
  }, [simpleFormat]);

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

export default SimpleFormatWorkoutViewer;
