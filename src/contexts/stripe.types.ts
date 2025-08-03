import { createContext } from "react";
import { Stripe } from "@stripe/stripe-js";

export interface StripeContextType {
  stripe: Stripe | null;
  isLoading: boolean;
  error: Error | null;
}

export const StripeContext = createContext<StripeContextType | undefined>(
  undefined
);
