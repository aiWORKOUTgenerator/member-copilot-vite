import { useState, useEffect } from 'react';
import { WorkoutPathSelectionContainer } from '../components/WorkoutPathSelection/WorkoutPathSelectionContainer';
import { PathCardSkeleton } from '@/ui/shared/molecules/PathCard';
import { useWorkoutPathSelection } from '../hooks/useWorkoutPathSelection';

// Constants
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
      <div className="min-h-screen bg-base-100">
        <header className="bg-base-200 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-base-content">
              Choose Your Workout Path
            </h1>
            <p className="text-base-content/70 mt-2">
              Select how you'd like to set up your personalized workout
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <PathCardSkeleton />
            <PathCardSkeleton />
          </div>
        </main>

        <footer className="bg-base-200 p-6 mt-auto">
          <div className="container mx-auto text-center text-base-content/70">
            <p>Loading your workout options...</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <header className="bg-base-200 p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-base-content">
            Choose Your Workout Path
          </h1>
          <p className="text-base-content/70 mt-2">
            Select how you'd like to set up your personalized workout
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <WorkoutPathSelectionContainer />
      </main>

      <footer className="bg-base-200 p-6 mt-auto">
        <div className="container mx-auto text-center text-base-content/70">
          <p>Choose the path that best fits your preferences and time</p>
        </div>
      </footer>
    </div>
  );
}
