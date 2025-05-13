import { ApiService } from "@/domain/interfaces/api/ApiService";

/**
 * Mock implementation of the ApiService interface for testing and development.
 * This avoids making actual HTTP requests to external services.
 */
export class MockApiService implements ApiService {
  private mockData: Record<string, unknown[]> = {
    "/api/users": [
      { id: 1, name: "Alice Smith", email: "alice@example.com" },
      { id: 2, name: "Bob Johnson", email: "bob@example.com" },
    ],
  };

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    // Simulate network delay
    await this.delay(500);

    // Filter data based on params if provided
    if (params && Object.keys(params).length > 0 && endpoint in this.mockData) {
      const data = this.mockData[endpoint] as Record<string, unknown>[];
      const filtered = data.filter((item) =>
        Object.entries(params).every(
          ([key, value]) =>
            // Check if item has the key and its string value matches
            key in item && String(item[key]) === value
        )
      );
      return filtered as unknown as T;
    }

    // Check if we have mock data for this endpoint
    if (endpoint in this.mockData) {
      return this.mockData[endpoint] as unknown as T;
    }

    throw new Error(`Mock API error: No mock data for endpoint ${endpoint}`);
  }

  async post<T, D extends Record<string, unknown>>(
    endpoint: string,
    data: D
  ): Promise<T> {
    await this.delay(500);

    // For user creation
    if (endpoint === "/api/users") {
      const users = this.mockData[endpoint] as Record<string, unknown>[];
      const newId =
        users.length > 0
          ? Math.max(...users.map((u) => u.id as number)) + 1
          : 1;

      const newUser = {
        id: newId,
        ...data,
      };

      users.push(newUser);
      return newUser as unknown as T;
    }

    throw new Error(
      `Mock API error: POST not implemented for endpoint ${endpoint}`
    );
  }

  async put<T, D extends Record<string, unknown>>(
    endpoint: string,
    data: D
  ): Promise<T> {
    await this.delay(500);

    // Extract ID from endpoint like '/api/users/1'
    const match = endpoint.match(/\/api\/(\w+)\/(\d+)/);

    if (match) {
      const [, resource, idStr] = match;
      const id = parseInt(idStr, 10);
      const collection = this.mockData[`/api/${resource}`];

      if (Array.isArray(collection)) {
        const index = collection.findIndex(
          (item) => (item as Record<string, unknown>).id === id
        );

        if (index !== -1) {
          const existingItem = collection[index] as Record<string, unknown>;
          const updatedItem = {
            ...existingItem,
            ...data,
          };

          collection[index] = updatedItem;
          return updatedItem as unknown as T;
        }
      }
    }

    throw new Error(
      `Mock API error: PUT not implemented for endpoint ${endpoint}`
    );
  }

  async delete<T>(endpoint: string): Promise<T> {
    await this.delay(500);

    // Extract ID from endpoint like '/api/users/1'
    const match = endpoint.match(/\/api\/(\w+)\/(\d+)/);

    if (match) {
      const [, resource, idStr] = match;
      const id = parseInt(idStr, 10);
      const resourcePath = `/api/${resource}`;
      const collection = this.mockData[resourcePath];

      if (Array.isArray(collection)) {
        const index = collection.findIndex(
          (item) => (item as Record<string, unknown>).id === id
        );

        if (index !== -1) {
          const deletedItem = collection[index];
          this.mockData[resourcePath] = collection.filter(
            (item) => (item as Record<string, unknown>).id !== id
          );
          return deletedItem as unknown as T;
        }
      }
    }

    throw new Error(
      `Mock API error: DELETE not implemented for endpoint ${endpoint}`
    );
  }
}
