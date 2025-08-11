'use client';

import { useAttributeForm } from '@/hooks/useAttributeForm';
import { useAttributeType } from '@/hooks/useAttributeTypes';
import { useContact } from '@/hooks/useContact';
import { usePrompts } from '@/hooks/usePrompts';
import {
  usePromptService,
  useAutoScroll,
  useToast,
  useAutoScrollPreferences,
} from '@/hooks';
import { PromptCard } from '@/ui';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';

// Component to display the attribute form with access to context
export function AttributeForm({
  attributeTypeId,
}: {
  attributeTypeId: string;
}) {
  const { formValues, isFormDirty, isValid, initFormValues, updateFormValue } =
    useAttributeForm();
  const { prompts, isLoading } = usePrompts();
  const attributeType = useAttributeType(attributeTypeId);
  const promptService = usePromptService();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { contact, refetch } = useContact();

  // Auto-scroll functionality
  const { enabled: autoScrollEnabled } = useAutoScrollPreferences();
  const { showSelectionToast } = useToast();
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const { triggerAutoScroll } = useAutoScroll({
    enabled: autoScrollEnabled,
    delay: 1000,
    trackingContext: 'AttributeForm',
  });

  // Enhanced form value handler with auto-scroll
  const handleFormValueChange = (promptId: string, value: unknown) => {
    // Update the form value
    updateFormValue(promptId, value);

    // Show feedback and auto-scroll if enabled
    if (autoScrollEnabled) {
      const prompt = attributePrompts.find((p) => p.id === promptId);
      if (prompt) {
        showSelectionToast(`${prompt.title} updated`);

        // Find next incomplete prompt and scroll to it
        setTimeout(() => {
          const nextIncompleteIndex = attributePrompts.findIndex(
            (p, index) =>
              index > attributePrompts.findIndex((ap) => ap.id === promptId) &&
              !formValues[p.id]
          );

          if (nextIncompleteIndex > -1 && nextSectionRef.current) {
            triggerAutoScroll(nextSectionRef.current);
          }
        }, 100);
      }
    }
  };

  // Filter prompts for this attribute type
  const attributePrompts = prompts.filter(
    (prompt) => prompt.attributeType?.id === attributeTypeId
  );

  // Initialize form values when component mounts
  useEffect(() => {
    if (contact) {
      initFormValues(
        contact,
        prompts.filter((prompt) => prompt.attributeType?.id === attributeTypeId)
      );
    }
  }, [attributeTypeId, initFormValues, contact, prompts]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Format the form values for API submission
      const promptValues = Object.entries(formValues)
        .filter(([, value]) => value !== null)
        .map(([promptId, value]) => ({
          prompt_id: promptId,
          value: Array.isArray(value)
            ? value.join('::')
            : (value as string | number),
        }));

      // Submit the form values using the prompt service
      await promptService.submitPromptValues(promptValues);
      refetch();
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving form values:', error);
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!attributeType) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-error">Attribute Type Not Found</h2>
          <p>The attribute type you&apos;re looking for doesn&apos;t exist.</p>
          <div className="card-actions justify-end mt-4">
            <Link to="/dashboard/profile" className="btn btn-primary">
              Back to Training Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {attributePrompts.length === 0 ? (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>No prompts available for this attribute type.</span>
        </div>
      ) : (
        attributePrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            value={formValues[prompt.id] || ''}
            onChange={(value) => handleFormValueChange(prompt.id, value)}
            validationMessage={''}
            isValid={true}
          />
        ))
      )}

      {/* Scroll target for auto-scroll functionality */}
      <div ref={nextSectionRef} className="scroll-mt-4" />

      {saveSuccess && (
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Changes saved successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{saveError}</span>
        </div>
      )}

      <div className="card-actions justify-end mt-6 pt-4">
        <Link to="/dashboard/profile" className="btn">
          Cancel
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isFormDirty || !isValid || isSaving}
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
