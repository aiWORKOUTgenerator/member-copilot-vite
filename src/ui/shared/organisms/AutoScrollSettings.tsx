import React from 'react';
import { Settings } from 'lucide-react';
import { useAutoScrollPreferences } from '@/hooks';

/**
 * Settings component for auto-scroll preferences
 * Can be embedded in user settings or preferences pages
 */
export const AutoScrollSettings: React.FC = () => {
  const { enabled, delay, setEnabled, setDelay } = useAutoScrollPreferences();

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body">
        <h3 className="card-title text-base flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Auto-Scroll Settings
        </h3>

        <div className="space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <div>
                <span className="label-text font-medium">
                  Enable Auto-Scroll
                </span>
                <p className="text-xs text-base-content/70">
                  Automatically scroll to the next section after making
                  selections
                </p>
              </div>
            </label>
          </div>

          {/* Delay Slider */}
          {enabled && (
            <div className="form-control">
              <label className="label" htmlFor="scroll-delay-slider">
                <span className="label-text">Scroll Delay</span>
                <span className="label-text-alt">{delay}ms</span>
              </label>
              <input
                id="scroll-delay-slider"
                type="range"
                min="500"
                max="3000"
                step="100"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="range range-primary range-sm"
                aria-label={`Scroll delay: ${delay} milliseconds`}
              />
              <div className="w-full flex justify-between text-xs text-base-content/70 mt-1">
                <span>Fast</span>
                <span>Medium</span>
                <span>Slow</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
