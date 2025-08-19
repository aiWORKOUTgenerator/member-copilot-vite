import { useState, useEffect } from 'react';
import { WorkoutPathSelectionContainer } from '../components/WorkoutPathSelection/WorkoutPathSelectionContainer';
import { WorkoutPathCardSkeleton } from '../components/WorkoutPathSelection/WorkoutPathCardSkeleton';
import { useWorkoutPathSelection } from '../hooks/useWorkoutPathSelection';

export default function WorkoutPathSelectionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { trackPageView } = useWorkoutPathSelection();

  useEffect(() => {
    // Track page view
    trackPageView();

    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [trackPageView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Choose Your Workout Path
            </h1>
          </header>

          {/* Loading Cards */}
          <main>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <WorkoutPathCardSkeleton />
              <WorkoutPathCardSkeleton />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Choose Your Workout Path
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Select how you'd like to create your workout routine. Choose the
            path that best fits your time and customization needs.
          </p>
        </header>

        {/* Main Content */}
        <main>
          <WorkoutPathSelectionContainer />
        </main>

        {/* Footer Note */}
        <footer className="text-center mt-12">
          <p className="text-sm text-base-content/60">
            You can change your selection at any time during the setup process.
          </p>
        </footer>
      </div>
    </div>
  );
}
