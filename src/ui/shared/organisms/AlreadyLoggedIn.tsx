'use client';

import { useNavigate } from 'react-router';
import { Button } from '../atoms';
import { FormContainer } from './FormContainer';

export const AlreadyLoggedIn = () => {
  const navigate = useNavigate();

  return (
    <FormContainer
      title="Already Signed In"
      subtitle="You are already logged in to your account"
    >
      <div className="alert alert-info mb-6">
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
          ></path>
        </svg>
        <span>
          You can go to your dashboard or sign out if you want to use a
          different account.
        </span>
      </div>

      <div className="space-y-4">
        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate('/dashboard')}
          aria-label="Go to dashboard"
        >
          Go to Dashboard
        </Button>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/api/auth/signout')}
          aria-label="Sign out"
        >
          Sign out
        </Button>
      </div>
    </FormContainer>
  );
};
