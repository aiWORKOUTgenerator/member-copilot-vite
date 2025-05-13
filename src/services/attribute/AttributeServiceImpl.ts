import {
  AttributeService,
  ApiService,
  Attribute,
  AttributeProps,
} from "@/domain";

export class AttributeServiceImpl implements AttributeService {
  readonly serviceName = "AttributeService";
  private readonly apiService: ApiService;
  private readonly baseEndpoint = "/members";

  /**
   * Creates a new instance of AttributeServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Get all attributes
   * @returns Promise that resolves to an array of Attribute entities
   */
  async getAllAttributes(): Promise<Attribute[]> {
    try {
      // Get attributes from API
      const attributesData = await this.apiService.get<AttributeProps[]>(
        `${this.baseEndpoint}/attributes/`
      );

      // Map the API response to domain entities
      return attributesData.map((data) => new Attribute(data));
    } catch (error) {
      console.error("Error in getAllAttributes:", error);
      throw new Error("Failed to fetch attributes");
    }
  }

  /**
   * Get attribute by ID
   * @param id The ID of the attribute to retrieve
   * @returns Promise that resolves to an Attribute entity or null if not found
   */
  async getAttributeById(id: string): Promise<Attribute | null> {
    try {
      // Get all attributes and find the one with matching ID
      // Note: In a real API, we might have a dedicated endpoint for getting a single attribute
      const attributes = await this.getAllAttributes();
      return attributes.find((attr) => attr.id === id) || null;
    } catch (error) {
      console.error(`Error in getAttributeById for id ${id}:`, error);
      throw new Error(`Failed to fetch attribute with id ${id}`);
    }
  }
}
