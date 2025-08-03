"use client";

import { useEffect } from "react";
import { usePusherService } from "@/hooks/useServices";

interface PusherEventProps {
  /**
   * The name of the channel to subscribe to
   */
  channel: string;

  /**
   * The name of the event to listen for
   */
  event: string;

  /**
   * Callback function to handle the event
   */
  onEvent: (data: unknown) => void;

  /**
   * Optional children to render
   */
  children?: React.ReactNode;
}

/**
 * A component that subscribes to a Pusher channel and event.
 * Automatically handles subscription and unsubscription on mount/unmount.
 *
 * @example
 * ```tsx
 * <PusherEvent
 *   channel="my-channel"
 *   event="my-event"
 *   onEvent={(data) => console.log('New event:', data)}
 * >
 *   Optional content
 * </PusherEvent>
 * ```
 */
export function PusherEvent({
  channel,
  event,
  onEvent,
  children,
}: PusherEventProps) {
  const pusherService = usePusherService();

  useEffect(() => {
    // Subscribe to the channel
    const pusherChannel = pusherService.subscribe(channel);

    // Bind to the event
    pusherChannel.bind(event, onEvent);

    // Cleanup function to unbind and possibly unsubscribe when component unmounts
    return () => {
      pusherChannel.unbind(event, onEvent);

      // Optional: unsubscribe from the channel entirely if needed
      // This depends on your app's needs - unsubscribe if this is the only
      // component listening to this channel, otherwise you might want to
      // keep the subscription alive for other components
      //
      // pusherService.unsubscribe(channel);
    };
  }, [channel, event, onEvent, pusherService]);

  // Render children if any
  return <>{children}</>;
}

/**
 * A hook that subscribes to a Pusher channel and event.
 * Automatically handles subscription and unsubscription on mount/unmount.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   usePusherEvent("my-channel", "my-event", (data) => {
 *     console.log('New event:', data);
 *   });
 *
 *   return <div>Listening for events...</div>;
 * }
 * ```
 */
export function usePusherEvent(
  channel: string,
  event: string,
  onEvent: (data: unknown) => void
): void {
  const pusherService = usePusherService();

  useEffect(() => {
    // Subscribe to the channel
    const pusherChannel = pusherService.subscribe(channel);

    // Bind to the event
    pusherChannel.bind(event, onEvent);

    // Cleanup function to unbind and possibly unsubscribe when component unmounts
    return () => {
      pusherChannel.unbind(event, onEvent);

      // Note: Not unsubscribing from the channel here to avoid breaking other
      // components that might be using the same channel
    };
  }, [channel, event, onEvent, pusherService]);
}
