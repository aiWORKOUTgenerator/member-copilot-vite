"use client";

import { ApiService } from "@/domain/interfaces/api/ApiService";
import { MemberService } from "@/domain/interfaces/services/MemberService";
import { PusherService } from "@/domain/interfaces/services/PusherService";
import { RewardService } from "@/domain/interfaces/services/RewardService";
import { ApiServiceImpl } from "@/services/api/ApiServiceImpl";
import { MockApiService } from "@/services/api/MockApiService";
import { MemberServiceImpl } from "@/services/member/MemberServiceImpl";
import { MockMemberService } from "@/services/member/MockMemberService";
import { PusherServiceImpl } from "@/services/pusher/PusherServiceImpl";
import { RewardServiceImpl } from "@/services/rewards/RewardServiceImpl";
import { createContext, ReactNode, useContext } from "react";

/**
 * ServiceContainer interface defines the shape of our service container.
 * All services should be added to this interface.
 */
export interface ServiceContainer {
  apiService: ApiService;
  memberService: MemberService;
  pusherService: PusherService;
  rewardService: RewardService;
  // Add more services here as they're created
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useServices hook which performs a null check.
 */
const ServiceContext = createContext<ServiceContainer | undefined>(undefined);

/**
 * Determine if we should use mocks based on environment or query params
 */
const shouldUseMocks = (): boolean => {
  return false;
};

/**
 * Factory for creating services
 */
const createServices = (): ServiceContainer => {
  const useMocks = shouldUseMocks();

  // Create the API service first since other services depend on it
  const apiService = useMocks ? new MockApiService() : new ApiServiceImpl();

  // Create PusherService
  const pusherService = new PusherServiceImpl();

  // Initialize the PusherService
  if (!useMocks) {
    pusherService.initialize();
  }

  // Create reward service (currently always using implementation)
  const rewardService = new RewardServiceImpl();

  // Create higher-level services, injecting dependencies
  return {
    apiService,
    memberService: useMocks
      ? new MockMemberService()
      : new MemberServiceImpl(apiService),
    pusherService,
    rewardService,
    // Add more services here as they're created
  };
};

/**
 * Default services implementation.
 * Services are created lazily to ensure proper environment detection.
 */
let defaultServices: ServiceContainer | null = null;

const getDefaultServices = (): ServiceContainer => {
  if (!defaultServices) {
    defaultServices = createServices();
  }
  return defaultServices;
};

interface ServiceProviderProps {
  children: ReactNode;
  services?: Partial<ServiceContainer>;
}

/**
 * ServiceProvider component that makes services available to all child components.
 * It accepts optional service overrides through the services prop, useful for testing.
 */
export function ServiceProvider({
  children,
  services = {},
}: ServiceProviderProps) {
  // Merge default services with any overrides provided through props
  const value: ServiceContainer = {
    ...getDefaultServices(),
    ...services,
  };

  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
}

/**
 * Custom hook to access the services from the ServiceContext.
 * Throws an error if used outside of a ServiceProvider.
 */
export function useServices(): ServiceContainer {
  const context = useContext(ServiceContext);

  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }

  return context;
}

/**
 * Convenience hook to access just the ApiService.
 * This pattern can be repeated for other services to avoid destructuring.
 */
export function useApiService(): ApiService {
  const { apiService } = useServices();
  return apiService;
}

/**
 * Convenience hook to access just the MemberService.
 */
export function useMemberService(): MemberService {
  const { memberService } = useServices();
  return memberService;
}

/**
 * Convenience hook to access just the PusherService.
 */
export function usePusherService(): PusherService {
  const { pusherService } = useServices();
  return pusherService;
}

/**
 * Convenience hook to access just the RewardService.
 */
export function useRewardService(): RewardService {
  const { rewardService } = useServices();
  return rewardService;
}
