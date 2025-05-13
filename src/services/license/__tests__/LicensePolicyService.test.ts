import { LicensePolicyService } from "../LicensePolicyService";
import { ApiService } from "../../../domain/interfaces/api/ApiService";
import { LicensePolicy } from "../../../domain/entities/license";
import { MeteredFeature } from "../../../domain/entities/meteredFeatures";

describe("LicensePolicyService", () => {
  // Setup
  let licensePolicyService: LicensePolicyService;
  let mockApiService: jest.Mocked<ApiService>;

  // Mock data
  const mockLicensePolicies: LicensePolicy[] = [
    {
      uuid: "policy-1",
      name: "Basic Plan",
      features: {
        generator: true,
        ai_assistant: false,
      },
      usage_limits: {
        [MeteredFeature.WORKOUTS_GENERATED]: 5,
        [MeteredFeature.PROFILE_AI_GENERATIONS]: 2,
      },
      stripe_price_id: "price_123",
      is_public: true,
    },
    {
      uuid: "policy-2",
      name: "Premium Plan",
      features: {
        generator: true,
        ai_assistant: true,
      },
      usage_limits: {
        [MeteredFeature.WORKOUTS_GENERATED]: 20,
        [MeteredFeature.PROFILE_AI_GENERATIONS]: 10,
      },
      stripe_price_id: "price_456",
      is_public: true,
    },
    {
      uuid: "policy-3",
      name: "Enterprise Plan",
      features: {
        generator: true,
        ai_assistant: true,
        admin_dashboard: true,
      },
      usage_limits: {
        [MeteredFeature.WORKOUTS_GENERATED]: 100,
        [MeteredFeature.PROFILE_AI_GENERATIONS]: 50,
      },
      stripe_price_id: null,
      is_public: false,
    },
  ];

  beforeEach(() => {
    // Create a mock API service
    mockApiService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    // Create a new instance for each test
    licensePolicyService = new LicensePolicyService(mockApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLicensePolicies", () => {
    it("should return license policies from the API", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(mockLicensePolicies);

      // Act
      const result = await licensePolicyService.getLicensePolicies();

      // Assert
      expect(result).toEqual(mockLicensePolicies);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith(
        "/members/license-policies"
      );
    });

    it("should include query parameter when includeNonPublic is true", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(mockLicensePolicies);

      // Act
      const result = await licensePolicyService.getLicensePolicies(true);

      // Assert
      expect(result).toEqual(mockLicensePolicies);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith(
        "/members/license-policies?includeNonPublic=true"
      );
    });

    it("should return empty array when API call fails", async () => {
      // Arrange
      mockApiService.get.mockRejectedValueOnce(new Error("API error"));

      // Act
      const result = await licensePolicyService.getLicensePolicies();

      // Assert
      expect(result).toEqual([]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when API returns null", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(null);

      // Act
      const result = await licensePolicyService.getLicensePolicies();

      // Assert
      expect(result).toEqual([]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("getLicensePolicy", () => {
    it("should return a license policy by ID", async () => {
      // Arrange
      const policyId = "policy-2";
      mockApiService.get.mockResolvedValueOnce(mockLicensePolicies[1]);

      // Act
      const result = await licensePolicyService.getLicensePolicy(policyId);

      // Assert
      expect(result).toEqual(mockLicensePolicies[1]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith(
        `/members/license-policies/${policyId}`
      );
    });

    it("should return null when API call fails", async () => {
      // Arrange
      const policyId = "non-existent-policy";
      mockApiService.get.mockRejectedValueOnce(new Error("API error"));

      // Act
      const result = await licensePolicyService.getLicensePolicy(policyId);

      // Assert
      expect(result).toBeNull();
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith(
        `/members/license-policies/${policyId}`
      );
    });
  });
});
