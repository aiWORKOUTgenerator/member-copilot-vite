"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { StripeContext } from "./stripe.types";

// Initialize Stripe outside of component render
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_UFaFBvMgE623tTbU6oT367qN"
);

export const StripeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to initialize Stripe")
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, []);

  const value = {
    stripe,
    isLoading,
    error,
  };

  return (
    <StripeContext.Provider value={value}>{children}</StripeContext.Provider>
  );
};
