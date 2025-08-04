"use client";

import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useEffect, useState } from "react";
import { PusherBeamsService } from "../domain/interfaces/services/PusherBeamsService";
import { PusherBeamsServiceImpl } from "../services/pusher/PusherBeamsServiceImpl";
import { PusherBeamsContext } from "./pusher-beams.types";
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
