'use client';

import { NewBadge } from '@/ui/shared/atoms/NewBadge';
import { User, MessageSquare, Target, TrendingUp, Crown } from 'lucide-react';

interface TrainerPersonaCardProps {
  /**
   * Whether the user has access to trainer persona feature
   */
  hasAccess: boolean;

  /**
   * Handler for upgrade/access button click
   */
  onUpgradeClick: () => void;

  /**
   * Handler for accessing the feature (when user has access)
   */
  onAccessClick: () => void;

  /**
   * Whether to show the NEW badge
   */
  showNewBadge?: boolean;

  /**
   * Custom headline text
   */
  headline?: string;

  /**
   * Custom description text
   */
  description?: string;
}

const DEFAULT_HEADLINE = 'Meet Your AI Personal Trainer';
const DEFAULT_DESCRIPTION =
  'Get personalized coaching, real-time form feedback, and adaptive guidance that evolves with your fitness journey.';

const FEATURE_HIGHLIGHTS = [
  {
    icon: <User className="w-4 h-4" />,
    text: 'Personalized coaching',
  },
  {
    icon: <MessageSquare className="w-4 h-4" />,
    text: 'Real-time feedback',
  },
  {
    icon: <Target className="w-4 h-4" />,
    text: 'Form correction',
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    text: 'Adaptive guidance',
  },
];

export function TrainerPersonaCard({
  hasAccess,
  onUpgradeClick,
  onAccessClick,
  showNewBadge = true,
  headline = DEFAULT_HEADLINE,
  description = DEFAULT_DESCRIPTION,
}: TrainerPersonaCardProps) {
  const handlePrimaryAction = () => {
    if (hasAccess) {
      onAccessClick();
    } else {
      onUpgradeClick();
    }
  };

  return (
    <div className="mb-6">
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content relative">
        {showNewBadge && !hasAccess && (
          <NewBadge
            position="top-right"
            variant="warning"
            className="mr-2 mt-2"
          />
        )}

        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-primary-content" />
                <h3 className="card-title text-lg">{headline}</h3>
                {hasAccess && (
                  <div className="badge badge-success badge-outline whitespace-nowrap">
                    Available
                  </div>
                )}
              </div>

              <p className="text-primary-content/90 mb-3">{description}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                {FEATURE_HIGHLIGHTS.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1">
                    {feature.icon}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className={`btn btn-xl ${
                  hasAccess ? 'btn-accent' : 'btn-warning'
                }`}
                onClick={handlePrimaryAction}
              >
                {hasAccess ? (
                  <>
                    <User className="w-4 h-4" />
                    Start Training
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    Unlock AI Trainer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
