'use client';

import { useAuth } from '@/hooks/auth';
import { Link } from 'react-router';
import { Button, DashboardIcon } from '@/ui';
import { HOMEPAGE_CONTENT } from '../constants';

interface HomeNavbarProps {
  onSignInClick: () => void;
  onDashboardClick: () => void;
  onCreateAccountClick: () => void;
  onLogoClick: () => void;
}

export function HomeNavbar({
  onSignInClick,
  onDashboardClick,
  onCreateAccountClick,
  onLogoClick,
}: HomeNavbarProps) {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="navbar bg-base-100 bg-opacity-70 backdrop-blur-sm sticky top-0 z-10 w-full">
      <div className="navbar-start min-w-0 flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-base sm:text-xl truncate"
          onClick={onLogoClick}
        >
          <span className="hidden sm:inline">
            {HOMEPAGE_CONTENT.navbar.logo}
          </span>
          <span className="sm:hidden">AI Workout</span>
        </Link>
      </div>

      <div className="navbar-end flex-shrink-0">
        {isLoaded ? (
          isSignedIn ? (
            <Link to="/dashboard" onClick={onDashboardClick}>
              <Button variant="primary" size="sm">
                <DashboardIcon size="sm" className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  {HOMEPAGE_CONTENT.navbar.myWorkouts}
                </span>
                <span className="sm:hidden">Workouts</span>
              </Button>
            </Link>
          ) : (
            <div className="flex gap-1 sm:gap-2">
              <Link
                to="/sign-in"
                className="btn btn-ghost btn-sm sm:btn-md"
                onClick={onSignInClick}
              >
                {HOMEPAGE_CONTENT.navbar.signIn}
              </Link>
              <Link to="/conversion" onClick={onCreateAccountClick}>
                <Button variant="primary" size="sm">
                  <span className="hidden sm:inline">
                    {HOMEPAGE_CONTENT.navbar.createAccount}
                  </span>
                  <span className="sm:hidden">Sign Up</span>
                </Button>
              </Link>
            </div>
          )
        ) : (
          <div className="h-8 w-24 sm:h-10 sm:w-32 bg-base-300 rounded"></div>
        )}
      </div>
    </nav>
  );
}
