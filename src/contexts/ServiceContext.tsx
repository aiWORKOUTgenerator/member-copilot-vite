"use client";

import { ApiServiceImpl } from "@/services/api/ApiServiceImpl";
import { MockApiService } from "@/services/api/MockApiService";
import { MemberServiceImpl } from "@/services/member/MemberServiceImpl";
import { MockMemberService } from "@/services/member/MockMemberService";
import { PusherServiceImpl } from "@/services/pusher/PusherServiceImpl";
import { ReactNode } from "react";
import { ServiceContext, ServiceContainer } from "./service.types";

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

  // Create higher-level services, injecting dependencies
  return {
    apiService,
    memberService: useMocks
      ? new MockMemberService()
      : new MemberServiceImpl(apiService),
    pusherService,
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
