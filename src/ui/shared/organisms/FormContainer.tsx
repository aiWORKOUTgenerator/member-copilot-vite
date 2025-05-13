"use client";

import React, { ReactNode } from "react";
import { Link } from "react-router";
import { Card } from "../molecules/Card";

interface FormContainerProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  altAuthText?: string;
  altAuthLink?: string;
  altAuthLinkText?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  children,
  footer,
  altAuthText,
  altAuthLink,
  altAuthLinkText,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-400 px-4 py-12">
      <div className="w-full max-w-md">
        <Card
          title={title}
          subtitle={subtitle}
          footer={footer}
          className="w-full bg-white"
        >
          {children}

          {altAuthText && altAuthLink && altAuthLinkText && (
            <div className="mt-6 text-center text-sm">
              {altAuthText}{" "}
              <Link
                to={altAuthLink}
                className="link link-primary font-semibold"
              >
                {altAuthLinkText}
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
