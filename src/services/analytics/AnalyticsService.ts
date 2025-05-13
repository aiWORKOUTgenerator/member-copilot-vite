/**
 * Interface for analytics services to implement
 * This abstraction allows us to swap between different analytics providers easily
 */
export interface AnalyticsService {
  /**
   * Initialize the analytics service
   */
  initialize(): void;

  /**
   * Track page views
   * @param properties Optional properties to include with the page call
   */
  page(properties?: Record<string, unknown>): void;

  /**
   * Track specific events
   * @param event Name of the event to track
   * @param properties Optional properties to include with the event
   */
  track(event: string, properties?: Record<string, unknown>): void;

  /**
   * Identify a user
   * @param userId Unique identifier for the user
   * @param traits Optional user traits/properties
   */
  identify(userId: string, traits?: Record<string, unknown>): void;

  /**
   * Reset the current user
   */
  reset(): void;
}
