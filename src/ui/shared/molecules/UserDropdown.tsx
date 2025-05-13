"use client";

import React, { ReactNode } from "react";
import { ArrowDownIcon, SignOutIcon, UserIcon } from "../atoms/IconSet";
import { useAuth } from "@/hooks/auth";
import { Button } from "../atoms";
export interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  danger?: boolean;
  component?: ReactNode;
}

export interface UserDropdownProps {
  menuItems?: MenuItem[];
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  menuItems = [],
}) => {
  const { user, isSigningOut, signOut } = useAuth();

  if (!user) return null;

  // Default menu items
  const defaultMenuItems: MenuItem[] = [
    {
      label: "Profile Settings",
      href: "/user",
      icon: <UserIcon size="sm" className="mr-2" />,
    },
    {
      label: "Sign out",
      danger: true,
      icon: <SignOutIcon size="sm" className="mr-2" />,
      onClick: () => signOut(),
    },
  ];

  // Combine custom menu items with defaults
  const allMenuItems = [
    ...menuItems,
    ...defaultMenuItems.filter(
      (item) => !menuItems.some((mi) => mi.label === item.label)
    ),
  ];

  return (
    <div className="dropdown dropdown-end">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center m-1"
        tabIndex={0}
        role="button"
        disabled={isSigningOut}
      >
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        <span>{user.firstName || user.emailAddresses[0]?.emailAddress}</span>
        <ArrowDownIcon size="sm" className="ml-1" />
      </Button>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {allMenuItems.map((item, index) => (
          <li key={index}>
            {item.component ? (
              item.component
            ) : (
              <a
                href={item.href}
                onClick={item.onClick}
                className={`flex items-center ${
                  item.danger ? "text-error" : ""
                }`}
              >
                {item.icon && item.icon}
                {item.label}
                {item.label === "Sign out" && isSigningOut && (
                  <span className="loading loading-spinner loading-xs ml-2"></span>
                )}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
