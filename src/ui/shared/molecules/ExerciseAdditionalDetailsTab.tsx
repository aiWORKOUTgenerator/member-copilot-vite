'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Music } from 'lucide-react';

interface ExerciseAdditionalDetailsTabProps {
  caloriesPerMinute?: number | null;
  isActive?: boolean | null;
  createdFromWorkout?: string | null;
  className?: string;
}

export const ExerciseAdditionalDetailsTab: React.FC<
  ExerciseAdditionalDetailsTabProps
> = ({ caloriesPerMinute, isActive, createdFromWorkout, className = '' }) => {
  const [showAudio, setShowAudio] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const hasContent =
    caloriesPerMinute !== null ||
    isActive !== null ||
    createdFromWorkout !== null;

  if (!hasContent) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-base-content/60">
          <p className="text-lg font-medium mb-2">No Additional Details</p>
          <p className="text-sm">
            Additional technical details are not available for this exercise.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-base-content">
          Additional Details
        </h3>
        <p className="text-sm text-base-content/70 mt-1">
          Technical information and system details
        </p>
      </div>

      <div className="space-y-4">
        {/* Calories per Minute */}
        {caloriesPerMinute !== null && caloriesPerMinute !== undefined && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-error/20 flex items-center justify-center">
                <span className="text-error text-sm font-bold">C</span>
              </div>
              <h4 className="font-semibold text-base-content">
                Calories per Minute
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-error">
                {caloriesPerMinute.toFixed(1)}
              </span>
              <span className="text-sm text-base-content/70">cal/min</span>
            </div>
          </div>
        )}

        {/* Active Status */}
        {isActive !== null && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                <span className="text-success text-sm font-bold">A</span>
              </div>
              <h4 className="font-semibold text-base-content">Status</h4>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`badge badge-sm ${isActive ? 'badge-success' : 'badge-error'}`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-sm text-base-content/70">
                {isActive ? 'Available for use' : 'Not available'}
              </span>
            </div>
          </div>
        )}

        {/* Created from Workout */}
        {createdFromWorkout && (
          <div className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-info/20 flex items-center justify-center">
                <span className="text-info text-sm font-bold">W</span>
              </div>
              <h4 className="font-semibold text-base-content">
                Created from Workout
              </h4>
            </div>
            <p className="text-sm text-base-content/80 font-mono">
              {createdFromWorkout}
            </p>
          </div>
        )}

        {/* Collapsible Audio Section */}
        <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm">
          <button
            className="w-full p-4 flex items-center justify-between hover:bg-base-200/50 transition-colors"
            onClick={() => setShowAudio(!showAudio)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowAudio(!showAudio);
              }
            }}
            aria-expanded={showAudio}
            aria-controls="audio-section"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Music className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-semibold text-base-content">Audio</h4>
            </div>
            {showAudio ? (
              <ChevronDown className="w-4 h-4 text-base-content/60" />
            ) : (
              <ChevronRight className="w-4 h-4 text-base-content/60" />
            )}
          </button>
          {showAudio && (
            <div
              id="audio-section"
              className="px-4 pb-4 border-t border-base-300"
            >
              <p className="text-sm text-base-content/70 mt-3">
                Audio controls and settings would be displayed here.
              </p>
            </div>
          )}
        </div>

        {/* Collapsible Metadata Section */}
        <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm">
          <button
            className="w-full p-4 flex items-center justify-between hover:bg-base-200/50 transition-colors"
            onClick={() => setShowMetadata(!showMetadata)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowMetadata(!showMetadata);
              }
            }}
            aria-expanded={showMetadata}
            aria-controls="metadata-section"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent text-sm font-bold">M</span>
              </div>
              <h4 className="font-semibold text-base-content">Metadata</h4>
            </div>
            {showMetadata ? (
              <ChevronDown className="w-4 h-4 text-base-content/60" />
            ) : (
              <ChevronRight className="w-4 h-4 text-base-content/60" />
            )}
          </button>
          {showMetadata && (
            <div
              id="metadata-section"
              className="px-4 pb-4 border-t border-base-300"
            >
              <p className="text-sm text-base-content/70 mt-3">
                Additional metadata and system information would be displayed
                here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
