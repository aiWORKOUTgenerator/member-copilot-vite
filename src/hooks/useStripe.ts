import { useContext } from "react";
import { StripeContext, StripeContextType } from "@/contexts/stripe.types";

export const useStripe = (): StripeContextType => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error("useStripe must be used within a StripeProvider");
  }
  return context;
};
