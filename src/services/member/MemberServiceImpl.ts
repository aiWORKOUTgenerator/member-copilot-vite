import { Contact } from "@/domain";
import { ApiService } from "@/domain/interfaces/api/ApiService";
import {
  MemberInfo,
  MemberService,
} from "@/domain/interfaces/services/MemberService";

/**
 * Implementation of the MemberService interface.
 * This class uses the ApiService to make HTTP requests and adds domain-specific logic.
 */
export class MemberServiceImpl implements MemberService {
  private readonly apiService: ApiService;
  private readonly baseEndpoint = "/members";

  /**
   * Creates a new instance of MemberServiceImpl
   * @param apiService The API service to use for HTTP requests
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Fetches current user's member information
   * @returns Promise resolving to the member information
   */
  async getUserInfo(): Promise<MemberInfo> {
    return this.apiService.get<MemberInfo>(`${this.baseEndpoint}/user-info`);
  }

  /**
   * Retrieves or creates a contact for the current user
   * @returns Promise resolving to the contact information
   */
  async getOrCreateContact(): Promise<Contact> {
    return this.apiService.post<Contact, Record<string, unknown>>(
      `${this.baseEndpoint}/contact/`,
      {},
    );
  }
}
