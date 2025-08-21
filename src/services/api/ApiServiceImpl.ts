import { ApiService } from '@/domain/interfaces/api/ApiService';
import { TokenProvider } from '@/domain/interfaces/api/TokenProvider';

/**
 * Implementation of the ApiService interface.
 * This class handles the actual HTTP requests to the API.
 */
export class ApiServiceImpl implements ApiService {
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;
  private readonly tokenProvider?: TokenProvider;

  /**
   * Creates a new instance of ApiServiceImpl
   * @param baseUrl The base URL for API requests
   * @param headers Optional default headers to include with every request
   * @param tokenProvider Optional provider for authentication tokens
   */
  constructor(
    baseUrl: string = import.meta.env.VITE_API_URL || '',
    headers: HeadersInit = {
      'Content-Type': 'application/json',
    },
    tokenProvider?: TokenProvider
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = headers;
    this.tokenProvider = tokenProvider;
  }

  /**
   * Formats the complete URL for an API endpoint
   * @param endpoint The API endpoint path
   * @param params Optional query parameters
   * @returns The complete URL string
   */
  private formatUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Gets headers for a request, including authentication if available
   * @returns Promise resolving to headers object
   */
  private async getHeaders(): Promise<HeadersInit> {
    const headers = { ...this.defaultHeaders } as Record<string, string>;

    // Always include the token if available, regardless of endpoint
    if (this.tokenProvider) {
      const token = await this.tokenProvider.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        // Debug logging removed - authentication issue resolved
      } else {
        console.log('🔑 API Request Headers: No token available');
      }
    }

    return headers;
  }

  /**
   * Performs a GET request to the specified endpoint
   * @param endpoint The API endpoint to call
   * @param params Optional query parameters
   * @returns A promise that resolves to the response data
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = this.formatUrl(endpoint, params);
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Performs a POST request to the specified endpoint
   * @param endpoint The API endpoint to call
   * @param data The data to send in the request body
   * @returns A promise that resolves to the response data
   */
  async post<T, D extends Record<string, unknown>>(
    endpoint: string,
    data: D
  ): Promise<T> {
    const url = this.formatUrl(endpoint);
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Performs a PUT request to the specified endpoint
   * @param endpoint The API endpoint to call
   * @param data The data to send in the request body
   * @returns A promise that resolves to the response data
   */
  async put<T, D extends Record<string, unknown>>(
    endpoint: string,
    data: D
  ): Promise<T> {
    const url = this.formatUrl(endpoint);
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Performs a DELETE request to the specified endpoint
   * @param endpoint The API endpoint to call
   * @returns A promise that resolves to the response data
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.formatUrl(endpoint);
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}
