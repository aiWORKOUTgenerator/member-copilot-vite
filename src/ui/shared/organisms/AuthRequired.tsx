"use client";

import React from "react";
import { Link } from "react-router";
import { Button } from "../atoms";
interface AuthRequiredProps {
  title?: string;
  subtitle?: string;
  signInLink?: string;
  homeLink?: string;
}

export const AuthRequired: React.FC<AuthRequiredProps> = ({
  title = "Authentication Required",
  subtitle = "You need to be signed in to access this page",
  signInLink = "/sign-in",
  homeLink = "/",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-lg w-full">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center mb-1">
              {title}
            </h2>
            <p className="text-center text-base-content/70 mb-6">{subtitle}</p>
            <div className="space-y-4">
              <Link to={signInLink} className="block w-full">
                <Button variant="primary" fullWidth aria-label="Sign in">
                  Sign in or Create Account
                </Button>
              </Link>
              <Link to={homeLink} className="block w-full">
                <Button variant="ghost" fullWidth aria-label="Return to home">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
