'use client';

import {
  Button,
  ErrorIcon,
  FormContainer,
  FormLoading,
  InfoIcon,
  Input,
} from '@/ui';
import { useSignIn } from '@clerk/clerk-react';
import { isClerkAPIResponseError } from '@clerk/clerk-react/errors';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function MagicLinkSignInPage() {
  const [emailAddress, setEmailAddress] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [validation, setValidation] = useState<string>('');
  const { signIn, isLoaded } = useSignIn();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Update validation message when email changes
  useEffect(() => {
    if (emailAddress && !validateEmail(emailAddress)) {
      setValidation('Please enter a valid email address');
    } else {
      setValidation('');
    }
  }, [emailAddress]);

  if (!isLoaded || !signIn) {
    return (
      <FormContainer title="Sign in">
        <FormLoading message="Loading sign-in form..." />
      </FormContainer>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Don't submit if email is invalid
    if (!validateEmail(emailAddress)) {
      setValidation('Please enter a valid email address');
      return;
    }

    // Reset states in case user resubmits form mid sign-in
    setError('');
    setVerifying(true);

    try {
      // Check if the user exists
      const signInAttempt = await signIn!.create({
        identifier: emailAddress,
      });

      // Check if magic link sign-in is supported for this user
      const magicLinkFactor = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === 'email_link'
      );

      if (!magicLinkFactor) {
        throw new Error('Magic link sign-in is not available for this account');
      }

      // Dynamically set the host domain for dev and prod
      const protocol = window.location.protocol;
      const host = window.location.host;

      // Send the magic link email
      await signIn!.prepareFirstFactor({
        strategy: 'email_link',
        emailAddressId:
          magicLinkFactor.strategy === 'email_link'
            ? magicLinkFactor.emailAddressId
            : '',
        redirectUrl: `${protocol}//${host}/dashboard`,
      });
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));

      if (err instanceof Error) {
        if (isClerkAPIResponseError(err)) {
          console.log('Clerk error:', err.errors[0]?.longMessage);
          setError(
            err.errors[0]?.longMessage ||
              'An error occurred with authentication.'
          );
        } else {
          console.log('Error:', err);
          setError(err.message || 'An error occurred. Please try again.');
        }
      } else {
        setError('An error occurred. Please try again.');
      }
      setVerifying(false);
    }
  }

  function reset(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(false);
    setEmailAddress('');
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

  if (verifying) {
    return (
      <FormContainer
        title="Check your email"
        subtitle="We've sent you a link to sign in"
      >
        <div className="alert alert-info mb-6">
          <InfoIcon size="md" className="shrink-0" />
          <span>Click the link in your email to continue.</span>
        </div>
        <form onSubmit={reset}>
          <Button
            variant="secondary"
            fullWidth
            type="submit"
            aria-label="Start over"
          >
            Start over
          </Button>
        </form>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title="Sign in to your account"
      subtitle="Enter your email to get started"
      altAuthText="Don't have an account?"
      altAuthLink="/conversion"
      altAuthLinkText="Sign up"
    >
      <form onSubmit={submit} className="space-y-6">
        <Input
          type="email"
          label="Email address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="yourname@example.com"
          required
          autoComplete="email"
          error={validation}
          fullWidth
          autoFocus
          isLoading={verifying}
          aria-label="Email address"
          aria-required="true"
          helperText="We'll send you a magic link to sign in"
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={verifying}
          disabled={!!validation || !emailAddress || verifying}
          aria-label="Continue with email"
        >
          Continue with email
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/conversion" className="link link-primary font-semibold">
          Sign up
        </Link>
      </div>
    </FormContainer>
  );
}
