import { MeteredUsageServiceImpl } from "../MeteredUsageServiceImpl";
import { MeteredUsage } from "../../../domain/entities/MeteredUsage";
import { ApiService } from "../../../domain/interfaces/api/ApiService";

describe("MeteredUsageServiceImpl", () => {
  // Setup
  let meteredUsageService: MeteredUsageServiceImpl;
  let mockApiService: jest.Mocked<ApiService>;

  beforeEach(() => {
    // Create a mock API service
    mockApiService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    // Create a new instance for each test
    meteredUsageService = new MeteredUsageServiceImpl(mockApiService);
  });

  describe("getMeteredUsage", () => {
    it("should return metered usage data from the API", async () => {
      // Arrange
      const mockUsageData: MeteredUsage[] = [
        {
          id: "usage1",
          aggregated_value: 10,
          end_time: 1630000000,
          meter: "api_calls",
          start_time: 1629900000,
        },
        {
          id: "usage2",
          aggregated_value: 5,
          end_time: 1630100000,
          meter: "storage",
          start_time: 1630000000,
        },
      ];

      mockApiService.get.mockResolvedValueOnce(mockUsageData);

      // Act
      const result = await meteredUsageService.getMeteredUsage();

      // Assert
      expect(result).toEqual(mockUsageData);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith(
        "/members/meter-event-summaries"
      );
    });

    it("should return empty array when API call fails", async () => {
      // Arrange
      mockApiService.get.mockRejectedValueOnce(new Error("API error"));

      // Act
      const result = await meteredUsageService.getMeteredUsage();

      // Assert
      expect(result).toEqual([]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith(
        "/members/meter-event-summaries"
      );
    });

    it("should return empty array when API returns null or undefined", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(null);

      // Act
      const result = await meteredUsageService.getMeteredUsage();

      // Assert
      expect(result).toEqual([]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });
  });
});
