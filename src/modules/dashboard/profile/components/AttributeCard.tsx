'use client';

import { ReactNode } from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface UserResponse {
  promptText: string;
  response: string;
  promptId: string;
}

interface AttributeCardProps {
  /** Attribute type ID */
  id: string;
  /** Attribute type name */
  name: string;
  /** Completion percentage (0-100) */
  completionPercentage: number;
  /** Number of completed prompts */
  completedPrompts: number;
  /** Total number of prompts */
  totalPrompts: number;
  /** Click handler for navigation */
  onClick: () => void;
  /** Optional icon for the attribute */
  icon?: ReactNode;
  /** Whether the attribute has errors */
  hasErrors?: boolean;
  /** User's responses for this attribute type */
  userResponses?: UserResponse[];
}

export function AttributeCard({
  name,
  completionPercentage,
  completedPrompts,
  totalPrompts,
  onClick,
  icon,
  hasErrors = false,
  userResponses = [],
}: AttributeCardProps) {
  // Determine completion status and styling
  const isComplete = completionPercentage === 100;
  const isIncomplete = completionPercentage > 0 && completionPercentage < 100;

  // Get status icon
  const getStatusIcon = () => {
    if (hasErrors) {
      return <AlertCircle className="w-5 h-5 text-error" />;
    }
    if (isComplete) {
      return <CheckCircle className="w-5 h-5 text-success" />;
    }
    return <Circle className="w-5 h-5 text-base-content/40" />;
  };

  // Get status color scheme
  const getStatusColor = () => {
    if (hasErrors) return 'error';
    if (isComplete) return 'success';
    if (isIncomplete) return 'warning';
    return 'info';
  };

  // Get status text
  const getStatusText = () => {
    if (hasErrors) return 'Has Errors';
    if (isComplete) return 'Complete';
    if (isIncomplete) return 'In Progress';
    return 'Not Started';
  };

  const statusColor = getStatusColor();

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-200/20 via-base-100/10 to-base-200/5 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${name} - ${getStatusText()} (${completionPercentage}% complete)`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl"></div>

      <div className="relative z-10 p-6">
        {/* Header with icon and status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {icon && (
              <span className="mr-3 p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md transition-transform duration-200">
                {icon}
              </span>
            )}
            <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors duration-200">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`badge badge-${statusColor} badge-sm`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Progress information */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-base-content/70">
              {completedPrompts} of {totalPrompts} questions answered
            </span>
            <span className="text-sm font-semibold text-base-content">
              {completionPercentage}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-base-200/30 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                statusColor === 'error'
                  ? 'bg-gradient-to-r from-error to-error/80'
                  : statusColor === 'success'
                    ? 'bg-gradient-to-r from-success to-success/80'
                    : statusColor === 'warning'
                      ? 'bg-gradient-to-r from-warning to-warning/80'
                      : 'bg-gradient-to-r from-info to-info/80'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* User Responses */}
        {userResponses.length > 0 && (
          <div className="mb-4">
            <div className="space-y-2">
              {userResponses.slice(0, 3).map((response) => (
                <div key={response.promptId} className="text-sm">
                  <div
                    className="font-medium text-base-content/80 truncate"
                    title={response.promptText}
                  >
                    {response.promptText}
                  </div>
                  <div
                    className="text-base-content/60 truncate"
                    title={response.response}
                  >
                    {response.response}
                  </div>
                </div>
              ))}
              {userResponses.length > 3 && (
                <div className="text-xs text-base-content/50 italic">
                  +{userResponses.length - 3} more response
                  {userResponses.length - 3 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-end">
          <button
            className={`btn btn-sm ${
              isComplete
                ? 'btn-outline btn-success'
                : isIncomplete
                  ? 'btn-outline btn-warning'
                  : 'btn-outline btn-primary'
            } transition-transform duration-200`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {isComplete ? 'Review' : isIncomplete ? 'Continue' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}
