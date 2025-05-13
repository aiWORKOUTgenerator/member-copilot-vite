/**
 * Value Objects
 *
 * Value objects are immutable objects that have no conceptual identity.
 * They are defined by their attributes and are replaceable when these attributes change.
 *
 * Examples: Money, Address, DateRange
 */

// Export value object interface
export interface ValueObject {
  equals(valueObject: ValueObject): boolean;
}

// Example implementation that can be extended
export abstract class BaseValueObject implements ValueObject {
  equals(valueObject: ValueObject): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(valueObject);
  }
}
