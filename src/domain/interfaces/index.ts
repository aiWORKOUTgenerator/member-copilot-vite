/**
 * External Interfaces
 *
 * This module defines interfaces for external services that the domain layer depends on.
 * Implementations of these interfaces are provided by the infrastructure layer.
 *
 * Examples: StorageService, LoggingService, NotificationService
 */

// External storage service
export interface StorageService {
  store(key: string, data: unknown): Promise<void>;
  retrieve<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
}

// External logging service
export interface LoggingService {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
}

// Export all API interfaces
export * from "./api/ApiService";

// Export all service interfaces
export * from "./services/AttributeService";
export * from "./services/PromptService";
export * from "./services/WorkoutFeedbackService";
export * from "./services/RewardService";

export * from "./license/LicenseService";
