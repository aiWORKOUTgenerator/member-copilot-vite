import { useContext } from 'react';
import {
  SubscriptionContext,
  SubscriptionContextType,
} from '@/contexts/subscription.types';

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider'
    );
  }
  return context;
};
