"use client";

import {
  Button,
  ErrorIcon,
  FormContainer,
  FormLoading,
  InfoIcon,
  Input,
  SuccessIcon,
} from "@/ui";
import { useSignIn } from "@clerk/clerk-react";
import { isClerkAPIResponseError } from "@clerk/clerk-react/errors";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function EmailOTPSignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [codeValidationError, setCodeValidationError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isExistingAccount, setIsExistingAccount] = useState(false);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Update validation message when email changes
  useEffect(() => {
    if (emailAddress && !validateEmail(emailAddress)) {
      setValidationError("Please enter a valid email address");
    } else {
      setValidationError("");
    }
  }, [emailAddress]);

  // Code validation
  useEffect(() => {
    if (code && !/^\d{6}$/.test(code)) {
      setCodeValidationError("Please enter a valid 6-digit code");
    } else {
      setCodeValidationError("");
    }
  }, [code]);

  // Pre-fill from URL params and check if coming from sign-up
  useEffect(() => {
    const emailParam = searchParams?.get("email");
    const fromSignUp = searchParams?.get("from") === "signup";

    // Set isExistingAccount based on the from parameter
    if (fromSignUp) {
      setIsExistingAccount(true);
    }

    // Just pre-fill the email address, don't auto-submit
    if (emailParam && validateEmail(emailParam)) {
      setEmailAddress(emailParam);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded || !signIn) return;

    // Don't submit if email is invalid
    if (!validateEmail(emailAddress)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Start the sign-in process using the email
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
      });

      // Check if supportedFirstFactors exists
      if (!signInAttempt.supportedFirstFactors) {
        throw new Error("No authentication methods available");
      }

      // Find the email code factor
      const emailCodeFactor = signInAttempt.supportedFirstFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (!emailCodeFactor || emailCodeFactor.strategy !== "email_code") {
        throw new Error("Email code authentication not available");
      }

      // Send the verification code email
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailCodeFactor.emailAddressId,
      });

      // Switch to verification mode to collect the OTP code
      setVerifying(true);
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));

      if (err instanceof Error) {
        if (isClerkAPIResponseError(err)) {
          setError(
            err.errors[0]?.longMessage ||
              "An error occurred sending the verification code.",
          );
        } else {
          setError(err.message || "An error occurred. Please try again.");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded || !signIn) return;

    if (!/^\d{6}$/.test(code)) {
      setCodeValidationError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Attempt to verify with the code provided by the user
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      // If verification was completed successfully
      if (result.status === "complete") {
        setSuccess(true);

        // Set the session as active
        await setActive({ session: result.createdSessionId });

        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        // Handle incomplete verification
        console.log("Verification incomplete:", result);
        setError("Verification could not be completed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));

      if (err instanceof Error) {
        if (isClerkAPIResponseError(err)) {
          // Check specifically for expired session errors
          const isExpiredSession = err.errors.some(
            (error) =>
              error.code === "resource_forbidden" ||
              error.message?.includes("not allowed on older sign ins"),
          );

          if (isExpiredSession) {
            setError(
              "Your verification session has expired. Please request a new code.",
            );
            // Return to email input mode to allow requesting a new code
            setVerifying(false);
            return;
          }

          setError(
            err.errors[0]?.longMessage ||
              "Invalid verification code. Please try again.",
          );
        } else {
          setError(err.message || "An error occurred. Please try again.");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // For resending the verification code
  async function resendCode() {
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setError("");

    try {
      // Create a fresh sign-in attempt to ensure we have a current session
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
      });

      // Check if supportedFirstFactors exists
      if (!signInAttempt.supportedFirstFactors) {
        throw new Error("No authentication methods available");
      }

      const emailCodeFactor = signInAttempt.supportedFirstFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (!emailCodeFactor || emailCodeFactor.strategy !== "email_code") {
        throw new Error("Email code authentication not available");
      }

      // Send the verification code email with the fresh session
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailCodeFactor.emailAddressId,
      });

      // Reset code input
      setCode("");
      setError("");
      setCodeValidationError("");
    } catch (err) {
      console.error("Error resending code:", JSON.stringify(err, null, 2));
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <FormContainer title="Sign in">
        <FormLoading message="Loading sign-in form..." />
      </FormContainer>
    );
  }

  if (error) {
    return (
      <FormContainer
        title="Oops! Something went wrong"
        subtitle="We weren't able to process your request"
      >
        <div className="alert alert-error">
          <ErrorIcon size="md" className="shrink-0" />
          <span>{error}</span>
        </div>
        <div className="mt-6">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setError("")}
            aria-label="Try again"
          >
            Try again
          </Button>
        </div>
      </FormContainer>
    );
  }

  if (success) {
    return (
      <FormContainer
        title="Successfully signed in!"
        subtitle="Welcome back to your account"
      >
        <div className="alert alert-success">
          <SuccessIcon size="md" className="shrink-0" />
          <span>Welcome back! You&apos;re now signed in.</span>
        </div>
        <div className="mt-6">
          <div className="text-center">
            <span className="loading loading-dots loading-md"></span>
            <p className="text-sm mt-2">Redirecting to dashboard...</p>
          </div>
        </div>
      </FormContainer>
    );
  }

  if (verifying) {
    return (
      <FormContainer
        title="Verify your email"
        subtitle={`We've sent a verification code to ${emailAddress}`}
      >
        <form onSubmit={handleVerification} className="space-y-6">
          <Input
            type="text"
            label="Verification code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
            }
            placeholder="Enter 6-digit code"
            required
            autoComplete="one-time-code"
            error={codeValidationError}
            fullWidth
            autoFocus
            isLoading={loading}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            aria-label="Verification code"
            aria-required="true"
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            disabled={code.length !== 6 || loading || !!codeValidationError}
            aria-label="Verify code"
          >
            Verify code
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-base-content/70 mb-2">
            Didn&apos;t receive a code or your code expired?
          </p>
          <Button
            onClick={resendCode}
            variant="ghost"
            size="sm"
            className="p-0 underline"
            disabled={loading}
          >
            Resend code
          </Button>
        </div>

        <div className="divider my-6"></div>

        <div className="text-center">
          <Button
            onClick={() => {
              setVerifying(false);
              setCode("");
              setCodeValidationError("");
            }}
            variant="ghost"
            size="sm"
            disabled={loading}
          >
            Use a different email
          </Button>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title={isExistingAccount ? "Welcome back!" : "Sign in to your account"}
      subtitle={
        isExistingAccount
          ? "We found an existing account with this email"
          : undefined
      }
      altAuthText="Don't have an account?"
      altAuthLink="/conversion"
      altAuthLinkText="Sign up"
    >
      {isExistingAccount && (
        <div className="alert alert-info mb-6">
          <InfoIcon size="md" className="shrink-0" />
          <span>
            We found an existing account with this email. Click &quot;Continue
            with email&quot; to sign in.
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="yourname@example.com"
          required
          autoComplete="email"
          error={validationError}
          fullWidth
          autoFocus
          isLoading={loading}
          aria-label="Email address"
          aria-required="true"
          helperText="We'll send you a verification code"
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={loading}
          disabled={!!validationError || !emailAddress || loading}
          aria-label="Continue with email"
        >
          Continue with email
        </Button>
      </form>
    </FormContainer>
  );
}
