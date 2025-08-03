import { useContext, useEffect, useState } from "react";
import { PusherBeamsContext } from "@/contexts/pusher-beams.types";

/**
 * Hook for managing device interests in Pusher Beams
 *
 * @example
 * ```tsx
 * function NotificationsComponent() {
 *   const {
 *     addInterest,
 *     removeInterest,
 *     clearInterests,
 *     interests
 *   } = usePusherBeamsInterests(["initial-interest"]);
 *
 *   return (
 *     <div>
 *       <button onClick={() => addInterest("new-topic")}>
 *         Subscribe to new topic
 *       </button>
 *       <div>Current interests: {interests.join(", ")}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePusherBeamsInterests(initialInterests: string[] = []) {
  const { service } = useContext(PusherBeamsContext);
  const [interests, setInterests] = useState<string[]>([]);

  // Initialize interests
  useEffect(() => {
    const initInterests = async () => {
      if (!service) {
        console.error("Pusher Beams service not initialized");
        return;
      }

      try {
        // First make sure the service is started
        await service?.start();

        // Add initial interests
        for (const interest of initialInterests) {
          await service?.addDeviceInterest(interest);
        }

        // Get the current interests
        const currentInterests = await service?.getDeviceInterests();
        setInterests(currentInterests);
      } catch (error) {
        console.error("Error initializing Pusher Beams interests:", error);
      }
    };

    initInterests();
  }, [service, initialInterests]);

  // Function to add an interest
  const addInterest = async (interest: string) => {
    try {
      await service?.addDeviceInterest(interest);
      const updatedInterests = await service?.getDeviceInterests();
      setInterests(updatedInterests || []);
    } catch (error) {
      console.error(`Error adding interest ${interest}:`, error);
    }
  };

  // Function to remove an interest
  const removeInterest = async (interest: string) => {
    try {
      await service?.removeDeviceInterest(interest);
      const updatedInterests = await service?.getDeviceInterests();
      setInterests(updatedInterests || []);
    } catch (error) {
      console.error(`Error removing interest ${interest}:`, error);
    }
  };

  // Function to clear all interests
  const clearInterests = async () => {
    try {
      await service?.clearDeviceInterests();
      setInterests([]);
    } catch (error) {
      console.error("Error clearing interests:", error);
    }
  };

  return {
    interests,
    addInterest,
    removeInterest,
    clearInterests,
  };
}
