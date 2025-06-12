"use client";

import { useAttributesLoaded } from "@/contexts/AttributeContext";
import {
  useAttributeTypesData,
  useAttributeTypesLoaded,
} from "@/contexts/AttributeTypeContext";
import { useContactData } from "@/contexts/ContactContext";
import { usePromptsData, usePromptsLoaded } from "@/contexts/PromptContext";
import { useTitle } from "@/contexts/TitleContext";
import { ContactUtils } from "@/domain";
import { useUserAccess } from "@/hooks";
import { UserButton } from "@clerk/clerk-react";
import { MenuIcon } from "lucide-react";
import React, { ReactNode, useMemo } from "react";
import { Link, useLocation } from "react-router";

interface NavigationItem {
  name: string;
  href: string;
  badgeCount?: number;
  enhanced?: boolean;
  isUpgrade?: boolean;
}

interface StackedLayoutProps {
  children: ReactNode;
  title?: string;
  navigation?: NavigationItem[];
  logo?: string;
  containerStyle?: "default" | "none" | string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const StackedLayout: React.FC<StackedLayoutProps> = ({
  children,
  title,
  containerStyle = "default",
}) => {
  const pathname = useLocation().pathname || "";
  // Get title from context if not provided as prop
  const { title: contextTitle } = useTitle();
  const displayTitle = title || contextTitle;

  // Get necessary data for calculating incomplete attributes
  const contact = useContactData();
  const attributeTypes = useAttributeTypesData();
  const prompts = usePromptsData();
  const promptsLoaded = usePromptsLoaded();
  const attributeTypesLoaded = useAttributeTypesLoaded();
  const attributesLoaded = useAttributesLoaded();

  // Get user access data
  const { activeLicenses } = useUserAccess();

  // Check if user is on basic/free tier
  const isOnBasicTier = useMemo(() => {
    const basicPriceId = import.meta.env.VITE_STRIPE_PRICE_BASIC;
    if (!basicPriceId || activeLicenses.length === 0) return false;

    return activeLicenses.some(
      (license) => license.policy?.stripe_price_id === basicPriceId
    );
  }, [activeLicenses]);

  // Calculate attribute completion status and count incomplete attributes
  const incompleteAttributesCount = useMemo(() => {
    if (
      !contact ||
      !promptsLoaded ||
      !attributeTypesLoaded ||
      !attributesLoaded
    )
      return 0;

    const attributeCompletions = ContactUtils.getAttributeCompletionStatus(
      contact,
      attributeTypes,
      prompts
    );

    return attributeCompletions.filter(
      (completion) => completion.percentComplete < 100
    ).length;
  }, [
    contact,
    attributeTypes,
    prompts,
    promptsLoaded,
    attributeTypesLoaded,
    attributesLoaded,
  ]);

  // Create navigation with badge for profile if there are incomplete attributes
  const navigation = useMemo(() => {
    return [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Workouts", href: "/dashboard/workouts" },
      {
        name: "Profile",
        href: "/dashboard/profile",
        badgeCount:
          incompleteAttributesCount > 0 ? incompleteAttributesCount : undefined,
      },
      {
        name: "AI Trainer",
        href: "/dashboard/trainer",
      },
      {
        name: isOnBasicTier ? "Upgrade Now $10/mo" : "Billing",
        href: "/dashboard/billing",
        enhanced: true,
        isUpgrade: isOnBasicTier,
      },
    ];
  }, [incompleteAttributesCount, isOnBasicTier]);

  // Determine container class based on containerStyle prop
  const getContainerClass = () => {
    if (containerStyle === "none") return "";
    if (containerStyle === "default")
      return "bg-base-100 shadow-xl border-1 border-base-200  sm:rounded-lg min-h-96 relative";
    return containerStyle; // Custom class string
  };

  return (
    <div className="min-h-full bg-base-300">
      <div className="bg-primary pb-12 sm:pb-32">
        <div className="navbar border-b border-secondary-focus/25 bg-primary">
          <div className="navbar-start">
            <div className="flex items-center">
              <div className="hidden lg:ml-10 lg:block">
                <div className="flex space-x-2 border-secondary-focus/50 pb-1">
                  {navigation.map((item) => {
                    const isCurrentPage =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          "btn text-white hover:btn-secondary",
                          isCurrentPage
                            ? "btn-active btn-secondary"
                            : "btn-ghost",
                          item.enhanced && !item.isUpgrade
                            ? "animate-pulse border border-secondary hover:animate-none"
                            : "",
                          item.isUpgrade
                            ? "btn-accent font-bold text-accent-content border-2 border-warning animate-pulse hover:animate-none hover:btn-warning hover:scale-105 transition-all duration-200"
                            : "",
                          "rounded-md font-medium"
                        )}
                        aria-current={isCurrentPage ? "page" : undefined}
                      >
                        {item.name}
                        {item.badgeCount !== undefined &&
                          item.badgeCount > 0 && (
                            <span className="badge badge-secondary ml-1">
                              {item.badgeCount}
                            </span>
                          )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="navbar-end">
            {/* User profile dropdown */}
            <div className="hidden lg:flex lg:items-center lg:ml-4">
              <UserButton />
            </div>

            {/* Mobile menu dropdown */}
            <div className="dropdown dropdown-end lg:hidden">
              <label tabIndex={0} className="btn btn-ghost text-white">
                <MenuIcon className="h-6 w-6" />
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
              >
                {navigation.map((item) => {
                  const isCurrentPage =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={classNames(
                          isCurrentPage
                            ? "menu-active bg-primary text-white"
                            : "hover:bg-primary/10",
                          item.enhanced && !item.isUpgrade
                            ? "border border-secondary"
                            : "",
                          item.isUpgrade
                            ? "bg-accent text-accent-content font-bold border-2 border-warning hover:bg-warning hover:text-warning-content"
                            : ""
                        )}
                      >
                        {item.name}
                        {item.badgeCount !== undefined &&
                          item.badgeCount > 0 && (
                            <span className="badge badge-secondary ml-1">
                              {item.badgeCount}
                            </span>
                          )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <header className="py-2 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              {displayTitle}
            </h1>
          </div>
        </header>
      </div>

      <main className="-mt-12 sm:-mt-32">
        <div className="mx-auto max-w-7xl">
          <div className="sm:p-4">
            {containerStyle === "none" ? (
              children
            ) : (
              <div className={getContainerClass()}>{children}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StackedLayout;
