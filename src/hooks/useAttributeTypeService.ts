import { AttributeTypeService } from "@/domain/interfaces/services/AttributeTypeService";
import { AttributeTypeServiceImpl } from "@/services/attributeType/AttributeTypeServiceImpl";
import { useMemo } from "react";
import { useApiService } from "./useApiService";

/**
 * Hook to access the AttributeTypeService functionality
 * @returns An instance of the AttributeTypeService with attribute type-related methods
 */
export function useAttributeTypeService(): AttributeTypeService {
  // Get the API service
  const apiService = useApiService();

  // Create a memoized instance of the service that persists across renders
  const attributeTypeService = useMemo(() => {
    return new AttributeTypeServiceImpl(apiService);
  }, [apiService]);

  return attributeTypeService;
}
