import { ApiService } from "@/domain/interfaces/api/ApiService";
import { MemberService } from "@/domain/interfaces/services/MemberService";
import { PusherService } from "@/domain/interfaces/services/PusherService";
import { createContext } from "react";

/**
 * ServiceContainer interface defines the shape of our service container.
 * All services should be added to this interface.
 */
export interface ServiceContainer {
  apiService: ApiService;
  memberService: MemberService;
  pusherService: PusherService;
  // Add more services here as they're created
}

/**
 * Create the context with a default undefined value.
 * This forces consumers to use the useServices hook which performs a null check.
 */
export const ServiceContext = createContext<ServiceContainer | undefined>(
  undefined,
);
