/**
 * Domain Layer - Core business logic
 *
 * This layer contains the business logic of the application independent of
 * the UI, frameworks, or external concerns. It represents the core domain
 * concepts and business rules of the application.
 */

// Re-export all domain entities, value objects, aggregates, etc.
export * from './entities/index';
export * from './value-objects/index';
export * from './interfaces/index';

// Re-export entities
export * from './entities';
export * from './entities/phoneVerification';

// Re-export interfaces
export * from './interfaces/api/ApiService';
export * from './interfaces/services/AttributeService';
export * from './interfaces/services/PromptService';
