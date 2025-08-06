// Helper function to format time in seconds to minutes:seconds
export const formatTime = (seconds?: number): string => {
  if (
    seconds === undefined ||
    seconds === null ||
    isNaN(seconds) ||
    seconds < 0
  ) {
    return '0:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
