import { ApiService } from "../../../domain/interfaces/api/ApiService";
import { MemberServiceImpl } from "../MemberServiceImpl";
import { MemberInfo } from "../../../domain/interfaces/services/MemberService";
import { Contact } from "@/domain";

// Create a mock implementation of ApiService
const createMockApiService = () => {
  const mockApiService: jest.Mocked<ApiService> = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return mockApiService;
};

describe("MemberServiceImpl", () => {
  let mockApiService: jest.Mocked<ApiService>;
  let memberService: MemberServiceImpl;

  beforeEach(() => {
    mockApiService = createMockApiService();
    memberService = new MemberServiceImpl(mockApiService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getUserInfo", () => {
    it("should call apiService.get with the correct endpoint", async () => {
      // Mock data
      const mockMemberInfo: MemberInfo = {
        id: "user-123",
        email: "test@example.com",
      };

      // Configure mock to return our data
      mockApiService.get.mockResolvedValueOnce(mockMemberInfo);

      // Call the method
      const result = await memberService.getUserInfo();

      // Verify the API was called correctly
      expect(mockApiService.get).toHaveBeenCalledWith("/members/user-info");
      expect(result).toEqual(mockMemberInfo);
    });
  });

  describe("getOrCreateContact", () => {
    it("should call apiService.post with the correct endpoint", async () => {
      // Mock data
      const mockContact: Contact = {
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        phone_number: "1234567890",
        source: "website",
        status: "new",
        attributes: {
          age: "30",
          goal: ["LOSING WEIGHT"],
          gender: ["MALE"],
          height: "6'0",
          weight: "180",
          injuries: [
            "No, I do not have any injuries that will affect my ability to perform exercise",
          ],
          liability: "yes",
          current_activity: [
            "LIGHTLY ACTIVE: occasional light physical activities",
          ],
          offer_preference: ["NO, I was just curious about the workout."],
          medical_clearance: ["NO"],
        },
        registration_status: "anonymous",
        workout_count: 1,
        last_workout_date: "2025-03-30T14:44:07.762779Z",
      };

      // Configure mock to return our data
      mockApiService.post.mockResolvedValueOnce(mockContact);

      // Call the method
      const result = await memberService.getOrCreateContact();

      // Verify the API was called correctly
      expect(mockApiService.post).toHaveBeenCalledWith("/members/contact/", {});
      expect(result).toEqual(mockContact);
    });
  });
});
