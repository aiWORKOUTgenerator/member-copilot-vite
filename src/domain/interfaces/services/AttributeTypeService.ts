import { AttributeType } from '@/domain/entities/attributeType';

/**
 * AttributeTypeService defines the contract for operations on attribute types
 */
export interface AttributeTypeService {
  readonly serviceName: string;

  /**
   * Retrieve all attribute types
   * @returns Promise that resolves to an array of AttributeType entities
   */
  getAllAttributeTypes(): Promise<AttributeType[]>;

  /**
   * Retrieve a specific attribute type by ID
   * @param id The ID of the attribute type to retrieve
   * @returns Promise that resolves to an AttributeType entity or null if not found
   */
  getAttributeTypeById(id: string): Promise<AttributeType | null>;
}
