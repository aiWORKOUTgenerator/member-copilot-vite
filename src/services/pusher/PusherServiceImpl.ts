import Pusher from 'pusher-js';
import * as PusherTypes from 'pusher-js';
import { PusherService } from '@/domain/interfaces/services/PusherService';

export class PusherServiceImpl implements PusherService {
  private pusherInstance: PusherTypes.default | null = null;
  private channels: Map<string, PusherTypes.Channel> = new Map();

  constructor() {
    // Defer initialization to allow for proper environment loading in Next.js
  }

  initialize(): void {
    if (this.pusherInstance) {
      return; // Already initialized
    }

    const appKey = import.meta.env.VITE_PUSHER_APP_KEY;
    const cluster = import.meta.env.VITE_PUSHER_CLUSTER;

    if (!appKey) {
      throw new Error('VITE_PUSHER_APP_KEY environment variable is not set');
    }

    if (!cluster) {
      throw new Error('VITE_PUSHER_CLUSTER environment variable is not set');
    }

    const authEndpoint = import.meta.env.VITE_PUSHER_AUTH_ENDPOINT;

    const options: PusherTypes.Options = {
      cluster,
    };

    // Add channel authorization if auth endpoint is provided
    if (authEndpoint) {
      options.channelAuthorization = {
        endpoint: authEndpoint,
        transport: 'ajax',
      };
    }

    this.pusherInstance = new Pusher(appKey, options);
  }

  subscribe(channelName: string): PusherTypes.Channel {
    if (!this.pusherInstance) {
      this.initialize();
    }

    if (!this.pusherInstance) {
      throw new Error('Pusher instance not initialized');
    }

    // Check if we're already subscribed to this channel
    const existingChannel = this.channels.get(channelName);
    if (existingChannel) {
      return existingChannel;
    }

    // Subscribe to the channel
    const channel = this.pusherInstance.subscribe(channelName);
    this.channels.set(channelName, channel);

    return channel;
  }

  unsubscribe(channelName: string): void {
    if (!this.pusherInstance) {
      return; // Nothing to unsubscribe if not initialized
    }

    this.pusherInstance.unsubscribe(channelName);
    this.channels.delete(channelName);
  }

  getChannel(channelName: string): PusherTypes.Channel | undefined {
    return this.channels.get(channelName);
  }

  getPusher(): PusherTypes.default {
    if (!this.pusherInstance) {
      this.initialize();
    }

    if (!this.pusherInstance) {
      throw new Error('Pusher instance not initialized');
    }

    return this.pusherInstance;
  }
}
