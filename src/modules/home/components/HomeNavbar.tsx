"use client";

import { useAuth } from "@/hooks/auth";
import { Link } from "react-router";
import { Button, DashboardIcon } from "@/ui";
import { HOMEPAGE_CONTENT } from "../constants";

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
    <nav className="navbar bg-base-100 bg-opacity-70 backdrop-blur-sm sticky top-0 z-10">
      <div className="navbar-start">
        <Link
          to="/"
          className="btn btn-ghost text-xl"
          onClick={onLogoClick}
        >
          {HOMEPAGE_CONTENT.navbar.logo}
        </Link>
      </div>

      <div className="navbar-end">
        {isLoaded ? (
          isSignedIn ? (
            <Link to="/dashboard" onClick={onDashboardClick}>
              <Button variant="primary">
                <DashboardIcon size="sm" className="mr-2" />
                {HOMEPAGE_CONTENT.navbar.myWorkouts}
              </Button>
            </Link>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="btn btn-ghost mr-2"
                onClick={onSignInClick}
              >
                {HOMEPAGE_CONTENT.navbar.signIn}
              </Link>
              <Link to="/conversion" onClick={onCreateAccountClick}>
                <Button variant="primary">{HOMEPAGE_CONTENT.navbar.createAccount}</Button>
              </Link>
            </>
          )
        ) : (
          <div className="h-10 w-32 bg-base-300 rounded"></div>
        )}
      </div>
    </nav>
  );
} 