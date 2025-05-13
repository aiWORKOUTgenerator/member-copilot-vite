export interface PusherBeamsService {
  /**
   * Starts the Pusher Beams client and registers the device
   * @returns Promise that resolves when started
   */
  start(): Promise<void>;

  /**
   * Adds a device interest
   * @param interest The interest to add
   * @returns Promise that resolves when interest is added
   */
  addDeviceInterest(interest: string): Promise<void>;

  /**
   * Removes a device interest
   * @param interest The interest to remove
   * @returns Promise that resolves when interest is removed
   */
  removeDeviceInterest(interest: string): Promise<void>;

  /**
   * Gets all device interests
   * @returns Promise that resolves to an array of interests
   */
  getDeviceInterests(): Promise<string[]>;

  /**
   * Clears all device interests
   * @returns Promise that resolves when all interests are cleared
   */
  clearDeviceInterests(): Promise<void>;

  /**
   * Stops the Pusher Beams client
   * @returns Promise that resolves when stopped
   */
  stop(): Promise<void>;
}
