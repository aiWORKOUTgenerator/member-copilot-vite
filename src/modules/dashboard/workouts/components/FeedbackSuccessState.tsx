import { CheckCircle, PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface FeedbackSuccessStateProps {
  /** Callback when user wants to close the success state */
  onClose: () => void;
  /** Auto-close timeout in milliseconds (default: 3000) */
  autoCloseTimeout?: number;
  /** Whether to show the celebration animation */
  showCelebration?: boolean;
}

export default function FeedbackSuccessState({
  onClose,
  autoCloseTimeout = 3000,
  showCelebration = true,
}: FeedbackSuccessStateProps) {
  const [timeLeft, setTimeLeft] = useState(Math.ceil(autoCloseTimeout / 1000));
  const [showAnimation, setShowAnimation] = useState(showCelebration);

  useEffect(() => {
    // Auto-close timer
    const autoCloseTimer = setTimeout(() => {
      onClose();
    }, autoCloseTimeout);

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(countdownTimer);
        }
        return Math.max(0, newTime);
      });
    }, 1000);

    // Hide animation after 2 seconds
    const animationTimer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    return () => {
      clearTimeout(autoCloseTimer);
      clearInterval(countdownTimer);
      clearTimeout(animationTimer);
    };
  }, [autoCloseTimeout, onClose]);

  return (
    <div className="text-center space-y-6 py-8">
      {/* Success Icon with Animation */}
      <div className="flex justify-center">
        <div className={`relative ${showAnimation ? 'animate-bounce' : ''}`}>
          <CheckCircle className="w-16 h-16 text-success" />
          {showAnimation && (
            <div className="absolute -top-2 -right-2 animate-pulse">
              <PartyPopper className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-success">
          Feedback Submitted Successfully!
        </h3>
        <p className="text-base-content/70">
          Thank you for sharing your workout experience. Your feedback helps us
          create better workouts for you and the community.
        </p>
      </div>

      {/* Celebration Messages */}
      <div className="bg-base-200 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <PartyPopper className="w-5 h-5" />
          <span className="font-medium">You're awesome!</span>
          <PartyPopper className="w-5 h-5" />
        </div>
        <p className="text-sm text-base-content/60">
          Your feedback is valuable and will help improve future workout
          experiences.
        </p>
      </div>

      {/* Auto-close Notice */}
      <div className="text-sm text-base-content/50">
        {timeLeft > 0 ? (
          <span>Closing automatically in {timeLeft} seconds...</span>
        ) : (
          <span>Closing...</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center pt-4">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onClose}
        >
          Close Now
        </button>
      </div>
    </div>
  );
}
