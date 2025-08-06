import { PusherBeamsService } from '@/domain/interfaces/services/PusherBeamsService';
import * as PusherPushNotifications from '@pusher/push-notifications-web';

export class PusherBeamsServiceImpl implements PusherBeamsService {
  constructor(private beamsClient: PusherPushNotifications.Client) {
    this.beamsClient = beamsClient;
    // Defer initialization to allow for proper environment loading in Next.js
  }

  async start(): Promise<void> {
    return this.beamsClient.start();
  }

  async addDeviceInterest(interest: string): Promise<void> {
    if (!this.beamsClient) {
      await this.start();
    }

    if (!this.beamsClient) {
      throw new Error('Pusher Beams client not initialized');
    }

    return this.beamsClient.addDeviceInterest(interest);
  }

  async removeDeviceInterest(interest: string): Promise<void> {
    if (!this.beamsClient) {
      throw new Error('Pusher Beams client not initialized');
    }

    return this.beamsClient.removeDeviceInterest(interest);
  }

  async getDeviceInterests(): Promise<string[]> {
    if (!this.beamsClient) {
      throw new Error('Pusher Beams client not initialized');
    }

    return this.beamsClient.getDeviceInterests();
  }

  async clearDeviceInterests(): Promise<void> {
    if (!this.beamsClient) {
      throw new Error('Pusher Beams client not initialized');
    }

    return this.beamsClient.clearDeviceInterests();
  }

  async stop(): Promise<void> {
    if (!this.beamsClient) {
      return; // Nothing to stop
    }

    return this.beamsClient.stop();
  }
}
