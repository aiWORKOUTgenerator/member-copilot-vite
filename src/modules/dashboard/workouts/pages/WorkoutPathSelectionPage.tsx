import { WorkoutPathSelectionContainer } from '../components/WorkoutPathSelection/WorkoutPathSelectionContainer';

export default function WorkoutPathSelectionPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Choose Your Workout Path
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Select how you'd like to create your workout routine. Choose the
            path that best fits your time and customization needs.
          </p>
        </div>

        {/* Cards Section */}
        <WorkoutPathSelectionContainer />

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-base-content/50">
            You can always switch between paths later in your workout setup
          </p>
        </div>
      </div>
    </div>
  );
}
