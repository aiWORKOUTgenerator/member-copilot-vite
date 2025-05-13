import { renderHook } from "@testing-library/react";
import { useMemberService } from "../useMemberService";
import { useApiService } from "../useApiService";
import { MemberServiceImpl } from "../../services/member/MemberServiceImpl";

// Mock the dependencies
jest.mock("../useApiService");

describe("useMemberService", () => {
  // Mock API service to return from the useApiService hook
  const mockApiService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    // Configure useApiService mock to return our mock service
    (useApiService as jest.Mock).mockReturnValue(mockApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a MemberService instance", () => {
    // Render the hook
    const { result } = renderHook(() => useMemberService());

    // Verify a MemberService was returned
    expect(result.current).toBeInstanceOf(MemberServiceImpl);
  });

  it("should use the API service from useApiService", () => {
    // Render the hook
    const { result } = renderHook(() => useMemberService());

    // Call a method on the member service
    result.current.getUserInfo();

    // Verify that the API service's get method was called with correct endpoint
    expect(mockApiService.get).toHaveBeenCalledWith("/members/user-info");
  });

  it("should memoize the MemberService instance", () => {
    // Render the hook and rerender
    const { result, rerender } = renderHook(() => useMemberService());

    // Get the initial instance
    const firstInstance = result.current;

    // Rerender without changing dependencies
    rerender();

    // Get the instance after rerender
    const secondInstance = result.current;

    // They should be the same object (memoized)
    expect(secondInstance).toBe(firstInstance);
  });
});
