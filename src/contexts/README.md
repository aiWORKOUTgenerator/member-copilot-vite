# Dependency Injection in our React Application

This directory contains our dependency injection (DI) system built with React Context. The system follows SOLID principles and Clean Architecture patterns to provide a flexible, testable, and maintainable application structure.

## Core Concepts

- **Interfaces**: All services are defined through interfaces in the domain layer
- **Implementations**: Concrete implementations are kept in the services layer
- **Context Provider**: A React Context Provider makes services available throughout the app
- **Custom Hooks**: Helper hooks provide type-safe access to services
- **Service Hierarchy**: Services can depend on other services (e.g., domain services use the ApiService)

## Available Services

The DI container provides:

- **ApiService**: Low-level service for handling HTTP requests
- **UserService**: Domain-specific service for user management operations

## Service Hierarchy

Our DI system implements a hierarchical service pattern:

1. **Infrastructure Services** (like ApiService): Handle low-level concerns like HTTP, storage, etc.
2. **Domain Services** (like UserService): Implement business logic and use infrastructure services
3. **Application Services**: Handle application-specific workflows (combining multiple domain services)

This separation allows each service to focus on a single responsibility, following the Single Responsibility Principle.

## Using Services in Components

### Option 1: Use the general `useServices` hook

```tsx
import { useServices } from "@/lib/context/ServiceContext";

function MyComponent() {
  const { userService } = useServices();

  // Use userService...
}
```

### Option 2: Use a specialized hook (recommended)

```tsx
import { useUserService } from "@/lib/context/ServiceContext";

function MyComponent() {
  const userService = useUserService();

  // Use userService...
}
```

## Mock Services for Development and Testing

The system automatically uses mock implementations in development mode. You can toggle between real and mock implementations by:

1. **URL Parameter**: Add `?use_mocks=true` or `?use_mocks=false` to the URL
2. **Environment**: Mocks are enabled by default in `development` environment

## Adding a Domain-Specific Service

To add a new domain-specific service to the DI system:

1. **Define the interface**: Create an interface in `src/domain/interfaces/services/` defining all operations
2. **Create the implementation**: Implement the service in `src/services/[feature]/` (injecting ApiService or other dependencies)
3. **Create a mock**: Create a mock implementation for testing and development
4. **Update ServiceContext**: Add the service to `ServiceContainer` and `createServices` function
5. **Create convenience hook**: Add a specialized hook like `useMyFeatureService()`

### Example: Adding a ProductService

```typescript
// 1. Create src/domain/interfaces/services/ProductService.ts
export interface ProductService {
  getProducts(): Promise<Product[]>;
  // ...other methods
}

// 2. Create src/services/product/ProductServiceImpl.ts
export class ProductServiceImpl implements ProductService {
  constructor(private apiService: ApiService) {}

  async getProducts(): Promise<Product[]> {
    return this.apiService.get<Product[]>("/api/products");
  }
  // ...other methods
}

// 3. Create src/services/product/MockProductService.ts
export class MockProductService implements ProductService {
  // Mock implementation...
}

// 4. Update ServiceContext.tsx
export interface ServiceContainer {
  apiService: ApiService;
  userService: UserService;
  productService: ProductService; // Add this
}

// In createServices():
return {
  apiService,
  userService: useMocks
    ? new MockUserService()
    : new UserServiceImpl(apiService),
  productService: useMocks
    ? new MockProductService()
    : new ProductServiceImpl(apiService),
};

// 5. Add convenience hook
export function useProductService(): ProductService {
  const { productService } = useServices();
  return productService;
}
```

## Testing with Service Overrides

You can easily override services in tests:

```tsx
import { render } from "@testing-library/react";
import { ServiceProvider } from "@/lib/context/ServiceContext";
import UserManagement from "./UserManagement";

// Create a mock service
const mockUserService = {
  getUsers: jest.fn().mockResolvedValue([]),
  createUser: jest.fn(),
  // ...other methods
};

test("UserManagement component uses userService", () => {
  render(
    <ServiceProvider services={{ userService: mockUserService }}>
      <UserManagement />
    </ServiceProvider>
  );

  expect(mockUserService.getUsers).toHaveBeenCalled();
});
```

## Best Practices

1. **Layer Separation**: Keep interfaces in domain layer, implementations in services layer
2. **Dependency Direction**: Always inject from lower-level services to higher-level services (e.g., ApiService → UserService)
3. **Focused Services**: Each service should have a single responsibility
4. **Use Hooks**: Always access services through hooks, never directly
5. **Mock for Tests**: Provide mock implementations for testing and development
6. **Composition**: Use composition over inheritance for service implementation
7. **Error Handling**: Handle errors at the appropriate level, don't expose low-level errors to UI
