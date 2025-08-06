import { AnalyticsFactory } from './AnalyticsFactory';
import { AnalyticsService } from './AnalyticsService';

/**
 * Initialize the analytics service for the application
 * @returns The initialized analytics service
 */
export function initAnalytics(): AnalyticsService {
  // Check if we already have an instance
  const existingInstance = AnalyticsFactory.getInstance();
  if (existingInstance) {
    return existingInstance;
  }

  // Get environment variables for Rudderstack configuration
  const writeKey = import.meta.env.VITE_RUDDERSTACK_WRITE_KEY;
  const dataPlaneUrl = import.meta.env.VITE_RUDDERSTACK_DATA_PLANE_URL;

  if (!writeKey || !dataPlaneUrl) {
    throw new Error(
      'Rudderstack configuration is missing. Please set RUDDERSTACK_WRITE_KEY and RUDDERSTACK_DATA_PLANE_URL environment variables.'
    );
  }

  // Create and initialize the analytics service
  const analyticsService = AnalyticsFactory.createAnalytics('rudderstack', {
    writeKey,
    dataPlaneUrl,
    configOptions: {
      logLevel:
        import.meta.env.VITE_NODE_ENV === 'production' ? 'error' : 'debug',
    },
  });

  // Initialize the service
  analyticsService.initialize();

  return analyticsService;
}

/**
 * Get the analytics service instance
 * Will initialize it if not already initialized
 */
export function getAnalytics(): AnalyticsService {
  const instance = AnalyticsFactory.getInstance();
  if (instance) {
    return instance;
  }
  return initAnalytics();
}
