// Validation limits for security
export const VALIDATION_LIMITS = {
  MAX_STRING_LENGTH: 1000,
  MAX_ARRAY_LENGTH: 50,
  MAX_RATING_VALUE: 10,
  MIN_RATING_VALUE: 1,
  MAX_DURATION: 300,
  MIN_DURATION: 5,
} as const;

// Sanitize analytics data to prevent injection attacks
export function sanitizeAnalyticsData(data: unknown): unknown {
  if (typeof data === 'string') {
    return data.slice(0, VALIDATION_LIMITS.MAX_STRING_LENGTH);
  }
  
  if (Array.isArray(data)) {
    return data
      .slice(0, VALIDATION_LIMITS.MAX_ARRAY_LENGTH)
      .map(item => sanitizeAnalyticsData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (typeof key === 'string' && key.length <= 100) {
        sanitized[key] = sanitizeAnalyticsData(value);
      }
    });
    return sanitized;
  }
  
  return data;
}

// Validate rating values
export function validateRating(value: unknown): value is number {
  return typeof value === 'number' && 
         value >= VALIDATION_LIMITS.MIN_RATING_VALUE && 
         value <= VALIDATION_LIMITS.MAX_RATING_VALUE;
}

// Validate duration values
export function validateDuration(value: unknown): value is number {
  return typeof value === 'number' && 
         value >= VALIDATION_LIMITS.MIN_DURATION && 
         value <= VALIDATION_LIMITS.MAX_DURATION;
} 