import { PusherBeamsService } from '@/domain/interfaces/services/PusherBeamsService';

export class MockPusherBeamsService implements PusherBeamsService {
  private interests: Set<string> = new Set();
  private isInitialized = false;
  private isStarted = false;

  async initialize(): Promise<void> {
    console.log('[MockPusherBeamsService] Initializing');
    this.isInitialized = true;
    return Promise.resolve();
  }

  async start(): Promise<void> {
    console.log('[MockPusherBeamsService] Starting');
    if (!this.isInitialized) {
      await this.initialize();
    }
    this.isStarted = true;
    return Promise.resolve();
  }

  async addDeviceInterest(interest: string): Promise<void> {
    console.log(`[MockPusherBeamsService] Adding interest: ${interest}`);
    if (!this.isStarted) {
      await this.start();
    }
    this.interests.add(interest);
    return Promise.resolve();
  }

  async removeDeviceInterest(interest: string): Promise<void> {
    console.log(`[MockPusherBeamsService] Removing interest: ${interest}`);
    this.interests.delete(interest);
    return Promise.resolve();
  }

  async getDeviceInterests(): Promise<string[]> {
    console.log('[MockPusherBeamsService] Getting interests');
    return Promise.resolve(Array.from(this.interests));
  }

  async clearDeviceInterests(): Promise<void> {
    console.log('[MockPusherBeamsService] Clearing interests');
    this.interests.clear();
    return Promise.resolve();
  }

  async stop(): Promise<void> {
    console.log('[MockPusherBeamsService] Stopping');
    this.isStarted = false;
    return Promise.resolve();
  }
}
