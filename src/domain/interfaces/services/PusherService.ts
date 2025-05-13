import * as PusherTypes from "pusher-js";

export interface PusherService {
  /**
   * Initializes the Pusher client
   */
  initialize(): void;

  /**
   * Subscribes to a channel
   * @param channelName The name of the channel to subscribe to
   * @returns The Pusher channel instance
   */
  subscribe(channelName: string): PusherTypes.Channel;

  /**
   * Unsubscribes from a channel
   * @param channelName The name of the channel to unsubscribe from
   */
  unsubscribe(channelName: string): void;

  /**
   * Gets a channel by name if already subscribed
   * @param channelName The name of the channel to get
   * @returns The Pusher channel instance or undefined if not subscribed
   */
  getChannel(channelName: string): PusherTypes.Channel | undefined;

  /**
   * Gets the Pusher instance
   * @returns The Pusher instance
   */
  getPusher(): PusherTypes.default;
}
