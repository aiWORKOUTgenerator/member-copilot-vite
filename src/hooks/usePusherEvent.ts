import { useEffect } from "react";
import { usePusherService } from "@/hooks/useServices";

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
