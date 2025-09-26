'use client';

import { PhoneNumberInput } from '@/components/PhoneNumberInput';
import {
  Button,
  ErrorIcon,
  FormContainer,
  FormLoading,
  SuccessIcon,
} from '@/ui';
import { useSignIn } from '@clerk/clerk-react';
import { isClerkAPIResponseError } from '@clerk/clerk-react/errors';
import { PhoneCodeFactor, SignInFirstFactor } from '@clerk/types';
import React, { useEffect, useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useNavigate, useSearchParams } from 'react-router';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function PhoneOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const analytics = useAnalytics();

  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [codeValidationError, setCodeValidationError] = useState('');
  const [success, setSuccess] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignInLoaded || !signIn) return;

    if (!isValidPhoneNumber(phone)) {
      setValidationError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Track phone authentication attempt
      analytics.track('Sign In Phone Method Selected', {
        method: 'phone',
        location: 'signin_page',
      });

      const { supportedFirstFactors } = await signIn.create({
        identifier: phone,
      });

      const isPhoneCodeFactor = (
        factor: SignInFirstFactor
      ): factor is PhoneCodeFactor => factor.strategy === 'phone_code';

      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (!phoneCodeFactor) {
        setError(
          'Phone authentication is not available for this account. Please try a different sign-in method.'
        );
        return;
      }

      await signIn.prepareFirstFactor({
        strategy: 'phone_code',
        phoneNumberId: phoneCodeFactor.phoneNumberId,
      });

      setVerifying(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const errorCode = err.errors[0]?.code;
        const errorMessage = err.errors[0]?.message || '';

        if (
          errorCode === 'form_identifier_not_found' ||
          errorMessage.toLowerCase().includes('not found')
        ) {
          setError(
            'No account found with this phone number. Please check your number or sign up for a new account.'
          );
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
    if (!isSignInLoaded || !signIn) return;

    if (!/^\d{6}$/.test(code)) {
      setCodeValidationError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'phone_code',
        code,
      });

      if (result.status === 'complete') {
        setSuccess(true);
        await setActive({ session: result.createdSessionId });

        // Track successful sign-in
        analytics.track('Sign In Success', {
          method: 'phone',
          tracked_at: new Date().toISOString(),
        });

        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError('Verification could not be completed. Please try again.');
      }
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
    if (!isSignInLoaded || !signIn) return;
    setLoading(true);
    setError('');

    try {
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

      setCode('');
      setCodeValidationError('');
    } catch (e) {
      console.error('Failed to resend code:', e);
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isSignInLoaded) {
    return (
      <FormContainer title="Sign in with phone">
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
      <FormContainer title="Success!" subtitle="You're now signed in">
        <div className="alert alert-success">
          <SuccessIcon size="md" className="shrink-0" />
          <span>Welcome back! You&apos;re now signed in.</span>
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
        subtitle="We've sent a verification code via SMS to your phone number"
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
      title="Sign in with your phone"
      subtitle="Enter your phone number to receive a 6-digit verification code via SMS."
      altAuthText="Prefer email?"
      altAuthLink="/sign-in/email-otp"
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
