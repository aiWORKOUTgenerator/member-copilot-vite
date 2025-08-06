import { useContext } from 'react';
import { ApiService } from '@/domain/interfaces/api/ApiService';
import { MemberService } from '@/domain/interfaces/services/MemberService';
import { PusherService } from '@/domain/interfaces/services/PusherService';
import { ServiceContext, ServiceContainer } from '@/contexts/service.types';

/**
 * Custom hook to access the services from the ServiceContext.
 * Throws an error if used outside of a ServiceProvider.
 */
export function useServices(): ServiceContainer {
  const context = useContext(ServiceContext);

  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
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
