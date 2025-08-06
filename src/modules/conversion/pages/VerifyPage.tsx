'use client';

import {
  Button,
  ErrorIcon,
  FormContainer,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@/ui';
import { useClerk } from '@clerk/clerk-react';
import {
  EmailLinkErrorCodeStatus,
  isEmailLinkError,
} from '@clerk/clerk-react/errors';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function VerifyEmailLink() {
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const { handleEmailLinkVerification, loaded } = useClerk();

  const verify = useCallback(async () => {
    try {
      // Dynamically set the host domain for dev and prod
      const protocol = window.location.protocol;
      const host = window.location.host;

      await handleEmailLinkVerification({
        // URL to navigate to if sign-up flow needs more requirements, such as MFA
        redirectUrl: `${protocol}//${host}/conversion/signup`,
      });

      // If not redirected at this point,
      // the flow has completed
      setVerificationStatus('verified');
    } catch (err) {
      let status = 'failed';

      if (err instanceof Error && isEmailLinkError(err)) {
        // If link expired, set status to expired
        if (err.code === EmailLinkErrorCodeStatus.Expired) {
          status = 'expired';
        } else if (err.code === EmailLinkErrorCodeStatus.ClientMismatch) {
          // This check is only required if you have
          // the 'Require the same device and browser' setting
          // enabled in the Clerk Dashboard
          status = 'client_mismatch';
        }
      }

      setVerificationStatus(status);
    }
  }, [handleEmailLinkVerification]);

  useEffect(() => {
    if (!loaded) return;
    verify();
  }, [loaded, verify]);

  if (verificationStatus === 'loading') {
    return (
      <FormContainer title="Verifying your email">
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-center">
            Please wait while we verify your email...
          </p>
        </div>
      </FormContainer>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <FormContainer
        title="Verification failed"
        subtitle="We couldn't verify your email"
      >
        <div className="alert alert-error mb-6">
          <ErrorIcon size="md" className="shrink-0" />
          <span>The email link verification failed.</span>
        </div>
        <Link to="/conversion/signup" className="block w-full">
          <Button variant="primary" fullWidth aria-label="Try signing up again">
            Try signing up again
          </Button>
        </Link>
      </FormContainer>
    );
  }

  if (verificationStatus === 'expired') {
    return (
      <FormContainer
        title="Link expired"
        subtitle="Your verification link has expired"
      >
        <div className="alert alert-warning mb-6">
          <WarningIcon size="md" className="shrink-0" />
          <span>The email link has expired. Please request a new one.</span>
        </div>
        <Link to="/conversion/signup" className="block w-full">
          <Button variant="primary" fullWidth aria-label="Request a new link">
            Request a new link
          </Button>
        </Link>
      </FormContainer>
    );
  }

  // This check is only required if you have
  // the 'Require the same device and browser' setting
  // enabled in the Clerk Dashboard
  if (verificationStatus === 'client_mismatch') {
    return (
      <FormContainer
        title="Device mismatch"
        subtitle="You need to use the same device"
      >
        <div className="alert alert-info mb-6">
          <InfoIcon size="md" className="shrink-0" />
          <span>
            You must complete the email link sign-up on the same device and
            browser that you started it on.
          </span>
        </div>
        <Link to="/conversion/signup" className="block w-full">
          <Button variant="primary" fullWidth aria-label="Sign up again">
            Sign up again
          </Button>
        </Link>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title="Email verified"
      subtitle="Your email has been successfully verified"
    >
      <div className="alert alert-success mb-6">
        <SuccessIcon size="md" className="shrink-0" />
        <span>
          Successfully signed up. Return to the original tab to continue.
        </span>
      </div>
      <div className="mt-4 text-center text-base-content/70">
        <p>You can safely close this tab.</p>
      </div>
    </FormContainer>
  );
}
