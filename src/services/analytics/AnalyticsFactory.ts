import { AnalyticsService } from "./AnalyticsService";
import { RudderstackAnalyticsService } from "./RudderstackAnalyticsService";

/**
 * Factory service for creating and managing analytics service implementations
 */
export class AnalyticsFactory {
  private static instance: AnalyticsService | null = null;

  /**
   * Create a new analytics service or return the existing one
   *
   * @param type The type of analytics service to create
   * @param options Configuration options for the analytics service
   * @returns An analytics service implementation
   */
  public static createAnalytics(
    type: "rudderstack",
    options: {
      writeKey: string;
      dataPlaneUrl: string;
      configOptions?: Record<string, unknown>;
    }
  ): AnalyticsService {
    if (AnalyticsFactory.instance) {
      return AnalyticsFactory.instance;
    }

    // Create the appropriate implementation based on the type
    switch (type) {
      case "rudderstack":
        AnalyticsFactory.instance = new RudderstackAnalyticsService(
          options.writeKey,
          options.dataPlaneUrl,
          options.configOptions || {}
        );
        break;
      default:
        throw new Error(`Analytics type "${type}" is not supported`);
    }

    return AnalyticsFactory.instance;
  }

  /**
   * Get the current analytics service instance if it exists
   *
   * @returns The current analytics service instance or null if none has been created
   */
  public static getInstance(): AnalyticsService | null {
    return AnalyticsFactory.instance;
  }
}
