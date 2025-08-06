import { AttributeType } from '@/domain/entities/attributeType';
import { AttributeTypeProps } from '@/domain/entities/attributeType';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { AttributeTypeService } from '@/domain/interfaces/services/AttributeTypeService';

/**
 * AttributeTypeServiceImpl implements domain logic for managing attribute types
 * Follows Single Responsibility Principle by focusing only on attribute type-related operations
 */
export class AttributeTypeServiceImpl implements AttributeTypeService {
  readonly serviceName = 'AttributeTypeService';
  private readonly apiService: ApiService;
  private readonly baseEndpoint = '/members';

  /**
   * Creates a new instance of AttributeTypeServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Get all attribute types
   * @returns Promise that resolves to an array of AttributeType entities
   */
  async getAllAttributeTypes(): Promise<AttributeType[]> {
    try {
      // Get attribute types from API
      const attributeTypesData = await this.apiService.get<
        AttributeTypeProps[]
      >(`${this.baseEndpoint}/attribute-types/`);

      console.log('attributeTypesData', attributeTypesData);

      // Map the API response to domain entities
      return attributeTypesData.map((data) => new AttributeType(data));
    } catch (error) {
      console.error('Error in getAllAttributeTypes:', error);
      throw new Error('Failed to fetch attribute types');
    }
  }

  /**
   * Get attribute type by ID
   * @param id The ID of the attribute type to retrieve
   * @returns Promise that resolves to an AttributeType entity or null if not found
   */
  async getAttributeTypeById(id: string): Promise<AttributeType | null> {
    try {
      // Get all attribute types and find the one with matching ID
      // Note: In a real API, we might have a dedicated endpoint for getting a single attribute type
      const attributeTypes = await this.getAllAttributeTypes();
      return attributeTypes.find((type) => type.id === id) || null;
    } catch (error) {
      console.error(`Error in getAttributeTypeById for id ${id}:`, error);
      throw new Error(`Failed to fetch attribute type with id ${id}`);
    }
  }
}
