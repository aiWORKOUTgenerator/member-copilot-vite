import { Contact } from "@/domain";
import {
  MemberInfo,
  MemberService,
} from "@/domain/interfaces/services/MemberService";
import { GeneratedWorkout } from "@/domain/entities/generatedWorkout";

/**
 * Mock implementation of the MemberService interface for testing and development.
 * This implementation returns mock data instead of making API requests.
 */
export class MockMemberService implements MemberService {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Fetches current user's member information
   * @returns Promise resolving to the member information
   */
  async getUserInfo(): Promise<MemberInfo> {
    await this.delay(200); // Simulate network delay

    return {
      id: "current-user-123",
      email: "current@example.com",
    };
  }

  /**
   * Retrieves or creates a contact for the current user
   * @returns Promise resolving to the contact information
   */
  async getOrCreateContact(): Promise<Contact> {
    await this.delay(300); // Simulate network delay

    return {
      email: "current@example.com",
      first_name: "John",
      last_name: "Doe",
      phone_number: "1234567890",
      source: "website",
      status: "new",
      attributes: {
        age: "32",
        goal: ["BUILDING MUSCLE"],
        gender: ["MALE"],
        height: "5'11",
        weight: "185",
        injuries: [
          "No, I do not have any injuries that will affect my ability to perform exercise",
        ],
        liability: "yes",
        current_activity: [
          "MODERATELY ACTIVE: regular light to moderate physical activities",
        ],
        offer_preference: ["YES, I'm interested in personal training programs"],
        medical_clearance: ["YES"],
      },
      registration_status: "registered",
      workout_count: 5,
      last_workout_date: new Date().toISOString(),
    };
  }

  async getGeneratedWorkouts(): Promise<GeneratedWorkout[]> {
    await this.delay(300); // Simulate network delay

    return [];
  }
}
