"use client";

import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { createContext, useContext, useEffect, useState } from "react";
import { PusherBeamsService } from "../domain/interfaces/services/PusherBeamsService";
import { PusherBeamsServiceImpl } from "../services/pusher/PusherBeamsServiceImpl";
interface PusherBeamsProviderProps {
  /**
   * Initial interests to subscribe to
   */
  initialInterests?: string[];

  /**
   * Optional children to render
   */
  children?: React.ReactNode;

  /**
   * Optional callback when initialization is complete
   */
  onInitialized?: () => void;
}

interface PusherBeamsState {
  client: PusherPushNotifications.Client | undefined;
  service: PusherBeamsService | undefined;
}

/**
 * A component that initializes Pusher Beams and provides device registration.
 * Automatically handles initialization and cleanup.
 *
 * @example
 * ```tsx
 * <PusherBeamsProvider initialInterests={["hello"]}>
 *   <App />
 * </PusherBeamsProvider>
 * ```
 */
export function PusherBeamsProvider({
  initialInterests = [],
  children,
}: PusherBeamsProviderProps) {
  const [client, setClient] = useState<PusherPushNotifications.Client>();
  const [service, setService] = useState<PusherBeamsService>();

  useEffect(() => {
    // Initialize and start Pusher Beams
    const initializeBeams = async () => {
      try {
        const beamsClient = new PusherPushNotifications.Client({
          instanceId: import.meta.env.VITE_PUSHER_BEAMS_INSTANCE_ID || "",
        });

        setClient(beamsClient);

        const service = new PusherBeamsServiceImpl(beamsClient);
        setService(service);

        await service.start();

        // Add initial interests if provided
        for (const interest of initialInterests) {
          await service.addDeviceInterest(interest);
        }

        console.log("Pusher Beams initialized and subscribed to interests");
      } catch (error) {
        console.error("Failed to initialize Pusher Beams:", error);
      }
    };

    initializeBeams();

    // Cleanup on unmount
    return () => {
      // We don't stop the service on unmount because it should persist
      // throughout the app's lifecycle
    };
  }, [initialInterests]);

  // Render children
  return (
    <PusherBeamsContext.Provider value={{ client, service }}>
      {children}
    </PusherBeamsContext.Provider>
  );
}

const PusherBeamsContext = createContext<PusherBeamsState>({
  client: undefined,
  service: undefined,
});

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
