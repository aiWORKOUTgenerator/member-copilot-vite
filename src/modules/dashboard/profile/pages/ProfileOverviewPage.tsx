'use client';

import { useAttributeTypesData } from '@/hooks/useAttributeTypes';
import { useContactData } from '@/hooks/useContact';
import { usePromptsData } from '@/hooks/usePrompts';
import { AttributeCompletion, ContactUtils, Contact } from '@/domain';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AttributeCard } from '../components/AttributeCard';
import {
  User,
  Target,
  Heart,
  Dumbbell,
  Clock,
  Settings,
  Activity,
  Zap,
} from 'lucide-react';

// Icon mapping for different attribute types
const getAttributeIcon = (attributeName: string) => {
  const name = attributeName.toLowerCase();

  if (name.includes('goal') || name.includes('target')) {
    return <Target className="w-5 h-5" />;
  }
  if (
    name.includes('fitness') ||
    name.includes('exercise') ||
    name.includes('workout')
  ) {
    return <Dumbbell className="w-5 h-5" />;
  }
  if (
    name.includes('health') ||
    name.includes('medical') ||
    name.includes('injury')
  ) {
    return <Heart className="w-5 h-5" />;
  }
  if (
    name.includes('time') ||
    name.includes('schedule') ||
    name.includes('availability')
  ) {
    return <Clock className="w-5 h-5" />;
  }
  if (
    name.includes('preference') ||
    name.includes('setting') ||
    name.includes('custom')
  ) {
    return <Settings className="w-5 h-5" />;
  }
  if (
    name.includes('experience') ||
    name.includes('level') ||
    name.includes('skill')
  ) {
    return <Activity className="w-5 h-5" />;
  }
  if (
    name.includes('energy') ||
    name.includes('intensity') ||
    name.includes('power')
  ) {
    return <Zap className="w-5 h-5" />;
  }

  // Default icon
  return <User className="w-5 h-5" />;
};

// Utility function to get user responses for a specific attribute type
const getUserResponsesForAttribute = (
  contact: Contact | null,
  attributeTypeId: string | number,
  prompts: Array<{
    attributeType: { id: number | string } | null;
    variableName: string;
    text: string;
    choices?: Array<{ id: string; text: string }>;
  }>
): Array<{ promptText: string; response: string; promptId: string }> => {
  if (!contact) return [];

  // Get prompts for this attribute type
  const attributePrompts = prompts.filter(
    (prompt) => prompt.attributeType?.id === attributeTypeId
  );

  return attributePrompts
    .map((prompt) => {
      const response = contact.attributes[prompt.variableName];

      // Skip if no response
      if (response === undefined || response === null || response === '') {
        return null;
      }

      // Format the response based on type
      let formattedResponse = '';
      if (Array.isArray(response)) {
        // Handle array responses (multiple selections)
        formattedResponse = response.join(', ');
      } else if (typeof response === 'boolean') {
        // Handle boolean responses
        formattedResponse = response ? 'Yes' : 'No';
      } else {
        // Handle string/number responses
        formattedResponse = String(response);
      }

      // If we have choices, try to find the text for the id
      if (prompt.choices && prompt.choices.length > 0) {
        const choice = prompt.choices.find((c) => c.id === formattedResponse);
        if (choice) {
          formattedResponse = choice.text;
        }
      }

      return {
        promptText: prompt.text,
        response: formattedResponse,
        promptId: prompt.variableName,
      };
    })
    .filter(
      (
        item
      ): item is { promptText: string; response: string; promptId: string } =>
        item !== null
    );
};

export default function ProfileOverviewPage() {
  const attributeTypes = useAttributeTypesData();
  const contact = useContactData();
  const prompts = usePromptsData();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  // Calculate attribute completion status
  const attributeCompletions = useMemo<AttributeCompletion[]>(() => {
    return ContactUtils.getAttributeCompletionStatus(
      contact,
      attributeTypes,
      prompts
    );
  }, [contact, attributeTypes, prompts]);

  // Handle attribute card click
  const handleAttributeClick = (
    attributeTypeId: string,
    attributeName: string
  ) => {
    analytics.track('Profile Attribute Card Selected', {
      attributeTypeId,
      attributeTypeName: attributeName,
      location: 'profile_overview',
    });

    navigate(`/dashboard/profile/${attributeTypeId}`);
  };

  // Sort attributes by completion status (incomplete first, then by completion percentage)
  const sortedAttributeCompletions = useMemo(() => {
    return [...attributeCompletions].sort((a, b) => {
      // Incomplete attributes first
      if (a.percentComplete < 100 && b.percentComplete === 100) return -1;
      if (a.percentComplete === 100 && b.percentComplete < 100) return 1;

      // Then sort by completion percentage (ascending)
      return a.percentComplete - b.percentComplete;
    });
  }, [attributeCompletions]);

  if (attributeCompletions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-base-content/50 mb-4">
          <User className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          No Profile Attributes Found
        </h3>
        <p className="text-base-content/70">
          Profile attributes are being loaded. Please check back in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-base-content mb-2">
          Profile Attributes
        </h2>
        <p className="text-base-content/70">
          Complete your profile attributes to get personalized workout
          recommendations
        </p>
      </div>

      {/* Attribute Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAttributeCompletions.map((completion) => {
          const attributeType = completion.attributeType;
          const icon = getAttributeIcon(attributeType.name);

          // Get user responses for this attribute type
          const userResponses = getUserResponsesForAttribute(
            contact,
            attributeType.id,
            prompts.map((prompt) => ({
              attributeType: prompt.attributeType,
              variableName: prompt.variableName,
              text: prompt.text,
              choices: prompt.choices,
            }))
          );

          return (
            <AttributeCard
              key={attributeType.id}
              id={attributeType.id.toString()}
              name={attributeType.name}
              completionPercentage={completion.percentComplete}
              completedPrompts={completion.completedPrompts}
              totalPrompts={completion.totalPrompts}
              onClick={() =>
                handleAttributeClick(
                  attributeType.id.toString(),
                  attributeType.name
                )
              }
              icon={icon}
              hasErrors={false} // TODO: Add error detection logic if needed
              userResponses={userResponses}
            />
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-base-200/10 via-base-100/5 to-base-200/5 backdrop-blur-sm border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">
              {
                attributeCompletions.filter((c) => c.percentComplete === 100)
                  .length
              }
            </div>
            <div className="text-sm text-base-content/70">Complete</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning mb-1">
              {
                attributeCompletions.filter(
                  (c) => c.percentComplete > 0 && c.percentComplete < 100
                ).length
              }
            </div>
            <div className="text-sm text-base-content/70">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-info mb-1">
              {
                attributeCompletions.filter((c) => c.percentComplete === 0)
                  .length
              }
            </div>
            <div className="text-sm text-base-content/70">Not Started</div>
          </div>
        </div>
      </div>
    </div>
  );
}
