/**
 * Authentication service that wraps Clerk's auth functionality
 * with additional features and consistent behavior
 */

import { useClerk, useUser } from "@clerk/clerk-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

/**
 * Custom hook that provides authentication functionality
 */
export function useAuth() {
  const { signOut } = useClerk();
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  /**
   * Sign out the user and redirect to the specified path
   */
  const handleSignOut = useCallback(
    async (redirectPath = "/") => {
      try {
        setIsSigningOut(true);
        await signOut();
        // After sign out, redirect to the specified path
        navigate(redirectPath);
      } catch (error) {
        console.error("Error signing out:", error);
        setIsSigningOut(false);
      }
    },
    [signOut, navigate],
  );

  return {
    user,
    isLoaded,
    isSignedIn,
    isSigningOut,
    signOut: handleSignOut,
  };
}
