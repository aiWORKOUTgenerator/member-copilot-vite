import { Entity } from './entity';

// Example implementation that can be extended
export abstract class BaseEntity<T> implements Entity<T> {
  constructor(public readonly id: T) {}

  equals(entity: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (!(entity instanceof BaseEntity)) {
      return false;
    }
    return this.id === entity.id;
  }
}
