import { Button } from '@/ui/shared/atoms/Button';
import LoadingState from '@/ui/shared/atoms/LoadingState';

export interface ConfigurationLoadingScreenProps {
  /** Whether configuration is currently loading */
  isLoading: boolean;
  /** Error message if configuration loading failed */
  error: string | null;
  /** Function to retry loading configuration */
  onRetry: () => void;
}

/**
 * Loading screen component displayed while app configuration is being loaded.
 * Shows a loading spinner during fetch, or an error state with retry option.
 */
export function ConfigurationLoadingScreen({
  isLoading,
  error,
  onRetry,
}: ConfigurationLoadingScreenProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
          {/* Loading animation */}
          <div className="flex justify-center">
            <LoadingState size="lg" />
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-base-content">
              Loading Application
            </h1>
            <p className="text-base-content/70">
              Setting up your personalized experience...
            </p>
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-base-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
          {/* Error icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          {/* Error message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-base-content">
              Unable to Load Configuration
            </h1>
            <p className="text-base-content/70">
              We're having trouble setting up your application. Please check
              your connection and try again.
            </p>
            {error && (
              <p className="text-sm text-error bg-error/10 p-3 rounded-lg">
                {error}
              </p>
            )}
          </div>

          {/* Retry button */}
          <div className="space-y-3">
            <Button
              onClick={onRetry}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Try Again
            </Button>

            <p className="text-xs text-base-content/50">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
