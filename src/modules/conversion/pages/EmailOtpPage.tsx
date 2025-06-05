"use client";

import { Button, FormContainer, Input } from "@/ui";
import { useSignUp } from "@clerk/clerk-react";
import { isClerkAPIResponseError } from "@clerk/clerk-react/errors";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

export default function EmailOTPSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
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
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

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

  // Pre-fill email from URL parameters
  useEffect(() => {
    const emailParam = searchParams?.get("email");

    if (emailParam && validateEmail(emailParam)) {
      setEmailAddress(emailParam);
    }
  }, [searchParams]);

  // Code validation
  useEffect(() => {
    if (code && !/^\d{6}$/.test(code)) {
      setCodeValidationError("Please enter a valid 6-digit code");
    } else {
      setCodeValidationError("");
    }
  }, [code]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isLoaded || !signUp) return;

      // Don't submit if email is invalid
      if (!validateEmail(emailAddress)) {
        setValidationError("Please enter a valid email address");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Start the sign-up process using the email method
        await signUp.create({
          emailAddress,
        });

        // Send the verification code email
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        // Switch to verification mode to collect the OTP code
        setVerifying(true);
      } catch (err) {
        console.error("Error:", JSON.stringify(err, null, 2));

        if (err instanceof Error) {
          if (isClerkAPIResponseError(err)) {
            // Check if the error is due to user already existing
            const identifierExists = err.errors.some(
              (error) => error.code === "form_identifier_exists"
            );

            if (identifierExists) {
              // If user exists, redirect to the email verification sign-in page with email prefilled
              // This will create a fresh authentication session through the standard sign-in flow
              console.log("User already exists, redirecting to sign-in...");

              // Use a short timeout to ensure any pending state updates are complete before navigation
              setTimeout(() => {
                navigate(
                  `/sign-in/email-otp?email=${encodeURIComponent(
                    emailAddress
                  )}&from=signup`
                );
              }, 100);
              return;
            }

            // For other errors, display the message
            setError(
              err.errors[0]?.longMessage ||
                "An error occurred sending the verification code."
            );
          } else {
            setError("An error occurred. Please try again.");
          }
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [isLoaded, signUp, emailAddress, navigate]
  );

  // Auto-submit form if auto-submit=1 parameter is present with valid email
  useEffect(() => {
    const autoSubmitParam = searchParams?.get("auto-submit");

    if (
      autoSubmitParam === "1" &&
      emailAddress &&
      validateEmail(emailAddress) &&
      !hasAutoSubmitted &&
      !verifying &&
      !loading &&
      isLoaded &&
      signUp
    ) {
      setHasAutoSubmitted(true);
      // Trigger form submission
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      handleSubmit(syntheticEvent);
    }
  }, [
    emailAddress,
    searchParams,
    hasAutoSubmitted,
    verifying,
    loading,
    isLoaded,
    signUp,
    handleSubmit,
  ]);

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded || !signUp) return;

    if (!/^\d{6}$/.test(code)) {
      setCodeValidationError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Attempt to verify with the code provided by the user
      const result = await signUp.attemptEmailAddressVerification({
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
          setError(
            err.errors[0]?.longMessage ||
              "Invalid verification code. Please try again."
          );
        } else {
          setError("An error occurred. Please try again.");
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
    if (!isLoaded || !signUp) return;

    setLoading(true);
    setError("");

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error resending code:", JSON.stringify(err, null, 2));
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <FormContainer title="Sign up">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
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
        title="Successfully verified!"
        subtitle="Your account has been created"
      >
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Welcome! You&apos;re all set.</span>
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
    const verificationMessage = searchParams?.get("verification-message");

    return (
      <FormContainer
        title="Verify your email"
        subtitle={
          verificationMessage
            ? undefined
            : `We've sent a verification code to ${emailAddress}`
        }
      >
        {verificationMessage && (
          <div className="mb-6">
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{verificationMessage}</span>
            </div>
          </div>
        )}
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
            Didn&apos;t receive a code?
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
            onClick={() => setVerifying(false)}
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
    <FormContainer title="Create your account">
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

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/sign-in" className="link link-primary font-semibold">
          Sign in
        </Link>
      </div>
    </FormContainer>
  );
}
