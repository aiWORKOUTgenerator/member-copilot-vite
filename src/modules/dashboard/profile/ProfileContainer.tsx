import {
  useAttributeTypesData,
  useAttributeTypesLoading,
} from "@/contexts/AttributeTypeContext";
import { useContactData } from "@/contexts/ContactContext";
import { usePromptsData } from "@/contexts/PromptContext";
import { useTitle } from "@/contexts/TitleContext";
import { AttributeCompletion, ContactUtils } from "@/domain";
import {
  RadioGroupOfCards,
  SelectableItem,
} from "@/ui/shared/molecules/RadioGroupOfCards";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function TrainingProfileLayout() {
  const { setTitle } = useTitle();
  const attributeTypes = useAttributeTypesData();
  const isAttributeTypesLoading = useAttributeTypesLoading();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [defaultSelected, setDefaultSelected] = useState<
    SelectableItem | undefined
  >(undefined);

  // Get contact and prompts data
  const contact = useContactData();
  const prompts = usePromptsData();

  // Set the page title
  useEffect(() => {
    setTitle("Training Profile");
  }, [setTitle]);

  // Calculate attribute completion status
  const attributeCompletions = useMemo<AttributeCompletion[]>(() => {
    return ContactUtils.getAttributeCompletionStatus(
      contact,
      attributeTypes,
      prompts
    );
  }, [contact, attributeTypes, prompts]);

  // Extract attributeTypeId from the path if we're in a specific attribute type route
  useEffect(() => {
    if (attributeTypes.length > 0 && pathname) {
      const pathParts = pathname.split("/");
      const attributeTypeId = pathParts[pathParts.length - 1];

      // Check if we're in a specific attribute type route
      if (
        pathname.startsWith("/dashboard/profile/") &&
        attributeTypeId !== "profile"
      ) {
        const selectedAttributeType = attributeTypes.find(
          (type) => type.id.toString() === attributeTypeId
        );

        if (selectedAttributeType) {
          setDefaultSelected({
            id: selectedAttributeType.id,
            title: selectedAttributeType.name,
            description: selectedAttributeType.description || "",
          });
        }
      }
    }
  }, [pathname, attributeTypes]);

  const analytics = useAnalytics();

  // Track profile page views
  useEffect(() => {
    analytics.track("Profile Page Viewed", {
      tracked_at: new Date().toISOString(),
    });
  }, [analytics]);

  // User is authenticated, show Training Profile page
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Training Profile</h2>
      <p className="text-sm text-base-content/70">
        Provide information about your fitness goals, injuries, preferences, and
        other details that will help the AI generate better workouts for you.
      </p>

      {isAttributeTypesLoading ? (
        <div className="flex justify-center my-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <RadioGroupOfCards
          items={attributeTypes.map((attributeType) => {
            // Find completion info for this attribute type
            const completion = attributeCompletions.find(
              (c) => c.attributeType.id === attributeType.id
            );

            return {
              id: attributeType.id,
              title: attributeType.name,
              description: attributeType.description || "",
              tertiary: completion ? (
                <div className="flex flex-col g">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">
                      {completion.completedPrompts}/{completion.totalPrompts}{" "}
                      complete
                    </span>
                    <span className="text-xs">
                      {completion.percentComplete}%
                    </span>
                  </div>
                  <progress
                    className={`progress ${
                      completion.percentComplete === 100
                        ? "progress-success"
                        : completion.hasProvidedValue
                        ? "progress-primary"
                        : "progress-secondary"
                    }`}
                    value={completion.percentComplete}
                    max="100"
                  ></progress>
                </div>
              ) : null,
            } as SelectableItem;
          })}
          selected={defaultSelected}
          onChange={(selected: SelectableItem | SelectableItem[]) => {
            // Navigate to the selected attribute page
            if (!Array.isArray(selected)) {
              // For single selection, navigate to the attribute page
              navigate(`/dashboard/profile/${selected.id}`);
            }
          }}
        />
      )}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
