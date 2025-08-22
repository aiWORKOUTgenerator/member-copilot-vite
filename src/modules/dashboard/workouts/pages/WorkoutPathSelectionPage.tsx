import { useState, useEffect } from 'react';
import { WorkoutPathSelectionContainer } from '../components/WorkoutPathSelection/WorkoutPathSelectionContainer';
import { PathCardSkeleton } from '@/ui/shared/molecules/PathCard';
import { useWorkoutPathSelection } from '../hooks/useWorkoutPathSelection';

// Constants
// 300ms provides a brief, perceptible loading animation for better UX.
// This duration was chosen to avoid a "flash" effect while keeping the wait minimal.
const LOADING_DELAY_MS = 300;

export default function WorkoutPathSelectionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { trackPageView } = useWorkoutPathSelection();

  useEffect(() => {
    // Track page view
    trackPageView();

    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [trackPageView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200">
        <header className="bg-base-200 p-6 rounded-lg">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-base-content">
              Choose Your Workout Path
            </h1>
            <p className="text-base-content/70 mt-2">
              Select how you'd like to set up your personalized workout
            </p>
          </div>
        </header>

        <main className="py-8">
          <div className="bg-base-200/30 rounded-xl p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PathCardSkeleton />
            <PathCardSkeleton />
          </div>
        </main>

        <footer className="bg-base-200 p-6 mt-auto rounded-lg">
          <div className="container mx-auto text-center text-base-content/70">
            <p>Loading your workout options...</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-base-200 p-6 rounded-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-base-content">
            Choose Your Workout Path
          </h1>
          <p className="text-base-content/70 mt-2">
            Select how you'd like to set up your personalized workout
          </p>
        </div>
      </header>

      <main className="py-8">
        <WorkoutPathSelectionContainer />
      </main>

      <footer className="bg-base-200 p-6 mt-auto rounded-lg">
        <div className="container mx-auto text-center text-base-content/70">
          <p>Choose the path that best fits your preferences and time</p>
        </div>
      </footer>
    </div>
  );
}
