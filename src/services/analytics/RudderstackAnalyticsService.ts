import {
  ApiObject,
  IdentifyTraits,
  RudderAnalytics,
} from "@rudderstack/analytics-js";
import { AnalyticsService } from "./AnalyticsService";

/**
 * RudderStack implementation of the analytics service
 */
export class RudderstackAnalyticsService implements AnalyticsService {
  private analytics: RudderAnalytics | null = null;
  private isInitialized = false;

  constructor(
    private readonly writeKey: string,
    private readonly dataPlaneUrl: string,
    private readonly options: Record<string, unknown> = {},
  ) {}

  /**
   * Initialize the RudderStack analytics instance
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.analytics = new RudderAnalytics();
      this.analytics.load(this.writeKey, this.dataPlaneUrl, this.options);
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize RudderStack analytics:", error);
    }
  }

  /**
   * Track page views
   */
  page(properties?: Record<string, unknown>): void {
    this.ensureInitialized();
    try {
      this.analytics?.page(properties as ApiObject);
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }

  /**
   * Track specific events
   */
  track(event: string, properties?: Record<string, unknown>): void {
    this.ensureInitialized();
    try {
      this.analytics?.track(event, properties as ApiObject);
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  }

  /**
   * Identify a user
   */
  identify(userId: string, traits?: Record<string, unknown>): void {
    this.ensureInitialized();
    try {
      this.analytics?.identify(userId, traits as IdentifyTraits);
    } catch (error) {
      console.error("Failed to identify user:", error);
    }
  }

  /**
   * Reset the current user
   */
  reset(): void {
    this.ensureInitialized();
    try {
      this.analytics?.reset();
    } catch (error) {
      console.error("Failed to reset user:", error);
    }
  }

  /**
   * Ensure analytics is initialized before use
   * @private
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      this.initialize();
    }
  }
}
