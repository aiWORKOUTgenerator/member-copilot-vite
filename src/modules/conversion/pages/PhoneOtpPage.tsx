'use client';

import { PhoneNumberInput } from '@/components/PhoneNumberInput';
import {
  Button,
  ErrorIcon,
  FormContainer,
  FormLoading,
  SuccessIcon,
} from '@/ui';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { isClerkAPIResponseError } from '@clerk/clerk-react/errors';
import { PhoneCodeFactor, SignInFirstFactor } from '@clerk/types';
import React, { useEffect, useMemo, useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useNavigate, useSearchParams } from 'react-router';

type AuthMode = 'sign-in' | 'sign-up' | null;

export default function PhoneOTPSignUnifiedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [codeValidationError, setCodeValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const allLoaded = isSignInLoaded && isSignUpLoaded;

  // Pre-fill from URL params if provided
  useEffect(() => {
    const phoneParam = searchParams?.get('phone');
    if (phoneParam) {
      setPhone(phoneParam);
    }
  }, [searchParams]);

  // Validate phone input reactively
  useEffect(() => {
    if (phone && !isValidPhoneNumber(phone)) {
      setValidationError('Please enter a valid phone number');
    } else {
      setValidationError('');
    }
  }, [phone]);

  // Validate code reactively
  useEffect(() => {
    if (code && !/^\d{6}$/.test(code)) {
      setCodeValidationError('Please enter a valid 6-digit code');
    } else {
      setCodeValidationError('');
    }
  }, [code]);

  const pageTitle = useMemo(() => {
    if (authMode === 'sign-in') return 'Sign in with your phone';
    if (authMode === 'sign-up') return 'Create your account';
    return 'Continue with phone';
  }, [authMode]);

  async function beginSignInFlow() {
    if (!signIn) return false;

    const { supportedFirstFactors } = await signIn.create({
      identifier: phone,
    });

    const isPhoneCodeFactor = (
      factor: SignInFirstFactor
    ): factor is PhoneCodeFactor => factor.strategy === 'phone_code';

    const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

    if (!phoneCodeFactor) return false;

    await signIn.prepareFirstFactor({
      strategy: 'phone_code',
      phoneNumberId: phoneCodeFactor.phoneNumberId,
    });

    setAuthMode('sign-in');
    setVerifying(true);
    return true;
  }

  async function beginSignUpFlow() {
    if (!signUp) return false;

    await signUp.create({ phoneNumber: phone });
    await signUp.preparePhoneNumberVerification();

    setAuthMode('sign-up');
    setVerifying(true);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allLoaded) return;

    if (!isValidPhoneNumber(phone)) {
      setValidationError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try sign-in path first; if user not found, fallback to sign-up
      const signedInStarted = await beginSignInFlow().catch((err) => {
        throw err;
      });

      if (!signedInStarted) {
        await beginSignUpFlow();
      }
    } catch (err) {
      // If identifier not found for sign-in, attempt sign-up
      if (isClerkAPIResponseError(err)) {
        const code = err.errors[0]?.code;
        const message = err.errors[0]?.message || '';

        if (
          code === 'form_identifier_not_found' ||
          message.toLowerCase().includes('not found')
        ) {
          try {
            await beginSignUpFlow();
            return;
          } catch (signUpErr) {
            if (isClerkAPIResponseError(signUpErr)) {
              setError(
                signUpErr.errors[0]?.longMessage ||
                  'Unable to start sign up. Please try again.'
              );
            } else if (signUpErr instanceof Error) {
              setError(signUpErr.message);
            } else {
              setError('Unable to start sign up. Please try again.');
            }
          }
        } else if (code === 'form_identifier_exists') {
          // If identifier exists on sign-up, fallback to sign-in
          try {
            const ok = await beginSignInFlow();
            if (!ok) {
              setError('Phone authentication not available.');
            }
          } catch (signInErr) {
            if (isClerkAPIResponseError(signInErr)) {
              setError(
                signInErr.errors[0]?.longMessage ||
                  'Unable to start sign in. Please try again.'
              );
            } else if (signInErr instanceof Error) {
              setError(signInErr.message);
            } else {
              setError('Unable to start sign in. Please try again.');
            }
          }
        } else {
          setError(
            err.errors[0]?.longMessage || 'An error occurred. Please try again.'
          );
        }
      } else if (err instanceof Error) {
        setError(err.message || 'An error occurred. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();
    if (!allLoaded) return;

    if (!/^\d{6}$/.test(code)) {
      setCodeValidationError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (authMode === 'sign-in' && signIn) {
        const result = await signIn.attemptFirstFactor({
          strategy: 'phone_code',
          code,
        });

        if (result.status === 'complete') {
          setSuccess(true);
          await setActive({ session: result.createdSessionId });
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setError('Verification could not be completed. Please try again.');
        }
        return;
      }

      if (authMode === 'sign-up' && signUp) {
        const result = await signUp.attemptPhoneNumberVerification({ code });
        if (result.status === 'complete') {
          setSuccess(true);
          await setActive({ session: result.createdSessionId });
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setError('Verification could not be completed. Please try again.');
        }
        return;
      }

      setError('Unexpected state. Please restart the flow.');
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const isExpired = err.errors.some(
          (e) =>
            e.code === 'resource_forbidden' ||
            (e.message || '').includes('not allowed on older sign ins')
        );
        if (isExpired) {
          setError(
            'Your verification session has expired. Please request a new code.'
          );
          setVerifying(false);
          return;
        }
        setError(
          err.errors[0]?.longMessage ||
            'Invalid verification code. Please try again.'
        );
      } else if (err instanceof Error) {
        setError(err.message || 'An error occurred. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    if (!allLoaded) return;
    setLoading(true);
    setError('');

    try {
      if (authMode === 'sign-in' && signIn) {
        const { supportedFirstFactors } = await signIn.create({
          identifier: phone,
        });
        const isPhoneCodeFactor = (
          factor: SignInFirstFactor
        ): factor is PhoneCodeFactor => factor.strategy === 'phone_code';
        const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);
        if (!phoneCodeFactor) throw new Error('Phone code not available.');
        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId: phoneCodeFactor.phoneNumberId,
        });
      } else if (authMode === 'sign-up' && signUp) {
        await signUp.preparePhoneNumberVerification();
      } else {
        throw new Error('Cannot resend in current state.');
      }

      setCode('');
      setCodeValidationError('');
    } catch (e) {
      console.error('Failed to resend code:', e);
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!allLoaded) {
    return (
      <FormContainer title="Continue with phone">
        <FormLoading message="Loading phone authentication..." />
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
            onClick={() => setError('')}
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
      <FormContainer title="Success!" subtitle="You're now authenticated">
        <div className="alert alert-success">
          <SuccessIcon size="md" className="shrink-0" />
          <span>Welcome! You&apos;re now signed in.</span>
        </div>
        <div className="mt-6 text-center">
          <span className="loading loading-dots loading-md"></span>
          <p className="text-sm mt-2">Redirecting to dashboard...</p>
        </div>
      </FormContainer>
    );
  }

  if (verifying) {
    return (
      <FormContainer
        title="Verify your phone"
        subtitle={
          authMode === 'sign-in'
            ? "We've sent a verification code via SMS to your phone number"
            : "We've sent a verification code via SMS to create your account"
        }
      >
        <form onSubmit={handleVerification} className="space-y-6">
          <label className="label">
            <span className="label-text">Verification code</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${codeValidationError ? 'input-error' : ''}`}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
            }
            placeholder="Enter 6-digit code"
            required
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            aria-label="Verification code"
            aria-required="true"
          />
          {codeValidationError && (
            <p className="text-error text-sm">{codeValidationError}</p>
          )}
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
              setCode('');
              setCodeValidationError('');
            }}
            variant="ghost"
            size="sm"
            disabled={loading}
          >
            Use a different phone number
          </Button>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title={pageTitle}
      subtitle="Enter your phone number to receive a 6-digit verification code via SMS."
      altAuthText="Prefer email?"
      altAuthLink="/conversion/email-otp"
      altAuthLinkText="Use email instead"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">
            <span className="label-text">Phone number</span>
          </label>
          <PhoneNumberInput
            value={phone}
            onChange={(v) => setPhone(v || '')}
            placeholder="Enter phone number"
            required
            error={validationError}
            className=""
            aria-label="Phone number"
          />
          {validationError && (
            <p className="text-error text-sm mt-2">{validationError}</p>
          )}
          <div className="mt-2 text-xs text-base-content/70">
            We&apos;ll send a verification code by SMS.
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={loading}
          disabled={!!validationError || !phone || loading}
          aria-label="Continue with phone"
        >
          Continue with phone
        </Button>
      </form>
    </FormContainer>
  );
}
