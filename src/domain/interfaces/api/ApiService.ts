/**
 * ApiService interface defines the contract for API interactions.
 * This is part of the domain layer and should not contain implementation details.
 */
export interface ApiService {
  /**
   * Performs a GET request to the specified endpoint
   * @param endpoint The API endpoint to call
   * @param params Optional query parameters
   * @returns A promise that resolves to the response data
   */
  get<T>(endpoint: string, params?: Record<string, string>): Promise<T>;

  /**
   * Performs a POST request to the specified endpoint
   * @param endpoint The API endpoint to call
   * @param data The data to send in the request body
   * @returns A promise that resolves to the response data
   */
  post<T, D extends Record<string, unknown>>(
    endpoint: string,
    data: D,
  ): Promise<T>;

  /**
   * Performs a PUT request to the specified endpoint
   * @param endpoint The API endpoint to call
   * @param data The data to send in the request body
   * @returns A promise that resolves to the response data
   */
  put<T, D extends Record<string, unknown>>(
    endpoint: string,
    data: D,
  ): Promise<T>;

  /**
   * Performs a DELETE request to the specified endpoint
   * @param endpoint The API endpoint to call
   * @returns A promise that resolves to the response data
   */
  delete<T>(endpoint: string): Promise<T>;
}
