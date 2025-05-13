import { Attribute } from "@/domain/entities";

/**
 * Interface for AttributeService
 * Following Interface Segregation Principle from SOLID
 */
export interface AttributeService {
  getAllAttributes(): Promise<Attribute[]>;
  getAttributeById(id: string): Promise<Attribute | null>;
}
