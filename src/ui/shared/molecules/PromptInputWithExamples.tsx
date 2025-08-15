'use client';

import React, { useState } from 'react';

export interface PromptExample {
  text: string;
  category: 'environment' | 'modifications' | 'context';
}

interface PromptInputWithExamplesProps {
  /** Current prompt value */
  value: string;
  /** Callback when prompt value changes */
  onChange: (value: string) => void;
  /** List of example prompts organized by category */
  examples: PromptExample[];
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Label text */
  label?: string;
  /** Whether the field is optional */
  optional?: boolean;
  /** Description text below the label */
  description?: string;
}

export const PromptInputWithExamples: React.FC<
  PromptInputWithExamplesProps
> = ({
  value,
  onChange,
  examples,
  disabled = false,
  placeholder = 'Describe any additional requirements, modifications, or specific goals...',
  className = '',
  label = 'Additional Context',
  optional = true,
  description = 'Select from the list or type your own additional context to generate a workout.',
}) => {
  const [activeExampleTab, setActiveExampleTab] = useState<
    'environment' | 'modifications' | 'context'
  >('environment');

  // Organize examples by category
  const getExamplesByCategory = (
    category: 'environment' | 'modifications' | 'context'
  ): string[] => {
    return examples
      .filter((example) => example.category === category)
      .map((example) => example.text);
  };

  // Get examples for the active tab
  const getActiveExamples = (): string[] => {
    return getExamplesByCategory(activeExampleTab);
  };

  // Set an example prompt
  const setExamplePrompt = (example: string) => {
    onChange(example);
  };

  return (
    <div className={`card bg-base-100 border border-base-300 ${className}`}>
      <div className="card-body">
        {/* Label */}
        <label className="block mb-2 font-medium flex justify-between items-center">
          <span>
            {label}
            {optional ? (
              <span className="text-sm font-normal text-base-content/70 ml-1">
                (optional)
              </span>
            ) : (
              <span className="text-sm font-normal text-error ml-1">
                (required)
              </span>
            )}
          </span>
        </label>

        {/* Description */}
        {description && (
          <p className="text-sm text-base-content/70 mb-4">{description}</p>
        )}

        {/* Example Tabs */}
        <div className="mb-4">
          <div role="tablist" className="tabs tabs-lift">
            <button
              type="button"
              role="tab"
              className={`tab ${activeExampleTab === 'environment' ? 'tab-active text-primary-content [--tab-bg:black] [--tab-border-color:black]' : ''}`}
              onClick={() => setActiveExampleTab('environment')}
            >
              Environment
            </button>
            <button
              type="button"
              role="tab"
              className={`tab ${activeExampleTab === 'modifications' ? 'tab-active text-primary-content [--tab-bg:black] [--tab-border-color:black]' : ''}`}
              onClick={() => setActiveExampleTab('modifications')}
            >
              Modifications
            </button>
            <button
              type="button"
              role="tab"
              className={`tab ${activeExampleTab === 'context' ? 'tab-active text-primary-content [--tab-bg:black] [--tab-border-color:black]' : ''}`}
              onClick={() => setActiveExampleTab('context')}
            >
              Context
            </button>
          </div>

          {/* Example Buttons */}
          <div className="mt-3 space-y-2">
            {getActiveExamples().map((example: string, index: number) => (
              <button
                key={index}
                type="button"
                className="btn btn-sm btn-outline btn-block justify-start text-left normal-case"
                onClick={() => setExamplePrompt(example)}
                disabled={disabled}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          className="textarea textarea-bordered validator w-full min-h-32"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PromptInputWithExamples;
