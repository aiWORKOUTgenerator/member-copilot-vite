import { LicenseServiceImpl } from "../LicenseService";
import { LicensePolicyService } from "../LicensePolicyService";
import { ApiService } from "../../../domain/interfaces/api/ApiService";
import {
  License,
  LicensePolicy,
  LicenseStatus,
  LicenseSourceType,
} from "../../../domain/entities/license";
import { MeteredFeature } from "../../../domain/entities/meteredFeatures";

// Create a mock implementation of LicensePolicyService
jest.mock("../LicensePolicyService");

describe("LicenseServiceImpl", () => {
  // Setup
  let licenseService: LicenseServiceImpl;
  let mockApiService: jest.Mocked<ApiService>;
  let mockPolicyService: jest.Mocked<LicensePolicyService>;

  // Mock license policy data
  const mockLicensePolicies: LicensePolicy[] = [
    {
      uuid: "policy-1",
      name: "Basic Plan",
      features: {
        generator: true,
        ai_assistant: false,
        reporting: false,
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
        reporting: false,
      },
      usage_limits: {
        [MeteredFeature.WORKOUTS_GENERATED]: 20,
        [MeteredFeature.PROFILE_AI_GENERATIONS]: 10,
      },
      stripe_price_id: "price_456",
      is_public: true,
    },
  ];

  // Mock license data
  const mockLicenses: License[] = [
    {
      uuid: "license-1",
      contact_id: "contact-1",
      license_policy_id: "policy-1",
      status: LicenseStatus.ACTIVE,
      source_type: LicenseSourceType.MANUAL,
      source_reference: "manual-1",
      valid_from: new Date("2023-01-01"),
      valid_to: new Date("2023-12-31"),
      policy: mockLicensePolicies[0],
    },
    {
      uuid: "license-2",
      contact_id: "contact-2",
      license_policy_id: "policy-2",
      status: LicenseStatus.ACTIVE,
      source_type: LicenseSourceType.STRIPE,
      source_reference: "sub_123",
      valid_from: new Date("2023-01-01"),
      valid_to: new Date("2023-12-31"),
      policy: mockLicensePolicies[1],
    },
    {
      uuid: "license-3",
      contact_id: "contact-3",
      license_policy_id: "policy-1",
      status: LicenseStatus.EXPIRED,
      source_type: LicenseSourceType.MANUAL,
      source_reference: "manual-2",
      valid_from: new Date("2022-01-01"),
      valid_to: new Date("2022-12-31"),
      policy: mockLicensePolicies[0],
    },
  ];

  beforeEach(() => {
    // Create mock services
    mockApiService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    // Reset and create mock policy service
    jest.clearAllMocks();
    mockPolicyService = new LicensePolicyService(
      mockApiService
    ) as jest.Mocked<LicensePolicyService>;
    mockPolicyService.getLicensePolicies = jest.fn();
    mockPolicyService.getLicensePolicy = jest.fn();

    // Create a new instance for each test
    licenseService = new LicenseServiceImpl(mockApiService, mockPolicyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getActiveLicenses", () => {
    it("should return licenses from the API", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(mockLicenses);

      // Act
      const result = await licenseService.getActiveLicenses();

      // Assert
      expect(result).toEqual(mockLicenses);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith("/members/licenses");
    });

    it("should return empty array when API call fails", async () => {
      // Arrange
      mockApiService.get.mockRejectedValueOnce(new Error("API error"));

      // Act
      const result = await licenseService.getActiveLicenses();

      // Assert
      expect(result).toEqual([]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when API returns null", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(null);

      // Act
      const result = await licenseService.getActiveLicenses();

      // Assert
      expect(result).toEqual([]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when API returns empty array", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce([]);

      // Act
      const result = await licenseService.getActiveLicenses();

      // Assert
      expect(result).toEqual([]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("getContactLicenses", () => {
    it("should return licenses for a specific contact", async () => {
      // Arrange
      const contactId = "contact-1";
      mockApiService.get.mockResolvedValueOnce([mockLicenses[0]]);

      // Act
      const result = await licenseService.getContactLicenses(contactId);

      // Assert
      expect(result).toEqual([mockLicenses[0]]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith(
        `/api/licenses/contact/${contactId}`
      );
    });

    it("should return empty array when API call fails", async () => {
      // Arrange
      const contactId = "invalid-contact";
      mockApiService.get.mockRejectedValueOnce(new Error("API error"));

      // Act
      const result = await licenseService.getContactLicenses(contactId);

      // Assert
      expect(result).toEqual([]);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("getLicensePolicy", () => {
    it("should delegate to policyService.getLicensePolicy", async () => {
      // Arrange
      const policyId = "policy-1";
      mockPolicyService.getLicensePolicy.mockResolvedValueOnce(
        mockLicensePolicies[0]
      );

      // Act
      const result = await licenseService.getLicensePolicy(policyId);

      // Assert
      expect(result).toEqual(mockLicensePolicies[0]);
      expect(mockPolicyService.getLicensePolicy).toHaveBeenCalledTimes(1);
      expect(mockPolicyService.getLicensePolicy).toHaveBeenCalledWith(policyId);
    });
  });

  describe("getLicensePolicies", () => {
    it("should delegate to policyService.getLicensePolicies with default parameter", async () => {
      // Arrange
      mockPolicyService.getLicensePolicies.mockResolvedValueOnce(
        mockLicensePolicies
      );

      // Act
      const result = await licenseService.getLicensePolicies();

      // Assert
      expect(result).toEqual(mockLicensePolicies);
      expect(mockPolicyService.getLicensePolicies).toHaveBeenCalledTimes(1);
      expect(mockPolicyService.getLicensePolicies).toHaveBeenCalledWith(
        undefined
      );
    });

    it("should delegate to policyService.getLicensePolicies with specified parameter", async () => {
      // Arrange
      mockPolicyService.getLicensePolicies.mockResolvedValueOnce(
        mockLicensePolicies
      );

      // Act
      const result = await licenseService.getLicensePolicies(true);

      // Assert
      expect(result).toEqual(mockLicensePolicies);
      expect(mockPolicyService.getLicensePolicies).toHaveBeenCalledTimes(1);
      expect(mockPolicyService.getLicensePolicies).toHaveBeenCalledWith(true);
    });
  });

  describe("canAccessFeature", () => {
    it("should return false when no active licenses", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce([]);

      // Act
      const result = await licenseService.canAccessFeature("generator");

      // Assert
      expect(result).toBe(false);
    });

    it("should return true when at least one license has access to the feature", async () => {
      // Arrange - both licenses have generator access
      mockApiService.get.mockResolvedValueOnce([
        mockLicenses[0],
        mockLicenses[1],
      ]);

      // Act
      const result = await licenseService.canAccessFeature("generator");

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when no license has access to the feature", async () => {
      // Arrange - neither license has reporting access
      mockApiService.get.mockResolvedValueOnce([
        mockLicenses[0],
        mockLicenses[1],
      ]);

      // Act
      const result = await licenseService.canAccessFeature("reporting");

      // Assert
      expect(result).toBe(false);
    });

    it("should handle licenses with missing policy", async () => {
      // Arrange - license without policy
      const licenseWithoutPolicy = { ...mockLicenses[0], policy: undefined };
      mockApiService.get.mockResolvedValueOnce([licenseWithoutPolicy]);

      // Act
      const result = await licenseService.canAccessFeature("generator");

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("isWithinUsageLimit", () => {
    it("should return true when no licenses are provided (empty array)", () => {
      // Act
      const result = licenseService.isWithinUsageLimit("generator", []);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true when at least one active license has access to the feature", () => {
      // Arrange - mock licenses with active status and feature access
      const licenses = [mockLicenses[0], mockLicenses[1]]; // Both active with generator access

      // Act
      const result = licenseService.isWithinUsageLimit("generator", licenses);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when no active license has access to the feature", () => {
      // Arrange - no active licenses with reporting access
      const licenses = [mockLicenses[0], mockLicenses[1]]; // Both active but no reporting access

      // Act
      const result = licenseService.isWithinUsageLimit("reporting", licenses);

      // Assert
      expect(result).toBe(false);
    });

    it("should ignore expired licenses", () => {
      // Arrange - only expired license
      const licenses = [mockLicenses[2]]; // Expired license

      // Act
      const result = licenseService.isWithinUsageLimit("generator", licenses);

      // Assert
      expect(result).toBe(false);
    });

    it("should handle licenses with missing policy", () => {
      // Arrange - license without policy
      const licenseWithoutPolicy = { ...mockLicenses[0], policy: undefined };

      // Act
      const result = licenseService.isWithinUsageLimit("generator", [
        licenseWithoutPolicy,
      ]);

      // Assert
      expect(result).toBe(false);
    });
  });
});
