'use client';

import { useAttributesLoaded } from '@/hooks/useAttributes';
import {
  useAttributeTypesData,
  useAttributeTypesLoaded,
} from '@/hooks/useAttributeTypes';
import { useContactData } from '@/hooks/useContact';
import { usePromptsData, usePromptsLoaded } from '@/hooks/usePrompts';
import { useTitle } from '@/hooks/useTitle';
import { ContactUtils } from '@/domain';
import { useUserAccess } from '@/hooks';
import { UserButton } from '@clerk/clerk-react';
import { MenuIcon } from 'lucide-react';
import React, { ReactNode, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { useAppConfig } from '@/hooks/useConfiguration';

interface NavigationItem {
  name: string;
  href: string;
  badgeCount?: number | string;
  badgeVariant?: string;
  enhanced?: boolean;
  isUpgrade?: boolean;
}

interface StackedLayoutProps {
  children: ReactNode;
  title?: string;
  navigation?: NavigationItem[];
  logo?: string;
  containerStyle?: 'default' | 'none' | string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const StackedLayout: React.FC<StackedLayoutProps> = ({
  children,
  title,
  logo,
  containerStyle = 'default',
}) => {
  const pathname = useLocation().pathname || '';
  // Get title from context if not provided as prop
  const { title: contextTitle } = useTitle();
  const displayTitle = title || contextTitle;

  // App config (for logoUrl)
  const appConfig = useAppConfig();
  const logoSrc = useMemo(() => {
    const candidates: Array<string | null | undefined> = [
      logo,
      appConfig?.logoUrl,
      appConfig?.logo,
    ];
    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate;
      }
    }
    return '';
  }, [logo, appConfig?.logoUrl, appConfig?.logo]);

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

  // Check if AI Trainer should show NEW badge (for one month from June 16, 2025)
  const showTrainerNewBadge = useMemo(() => {
    const now = new Date();
    const launchDate = new Date('2025-06-16'); // June 16, 2025
    const oneMonthAfterLaunch = new Date('2025-07-16'); // One month later

    return now >= launchDate && now <= oneMonthAfterLaunch;
  }, []);

  // Create navigation with badge for profile if there are incomplete attributes
  const navigation = useMemo(() => {
    return [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Workouts', href: '/dashboard/workouts' },
      {
        name: 'Profile',
        href: '/dashboard/profile',
        badgeCount:
          incompleteAttributesCount > 0 ? incompleteAttributesCount : undefined,
      },
      {
        name: 'AI Trainer',
        href: '/dashboard/trainer',
        badgeCount: showTrainerNewBadge ? 'NEW' : undefined,
        badgeVariant: 'accent',
      },
      {
        name: isOnBasicTier ? 'Upgrade Now $10/mo' : 'Billing',
        href: '/dashboard/billing',
        enhanced: true,
        isUpgrade: isOnBasicTier,
      },
    ];
  }, [incompleteAttributesCount, isOnBasicTier, showTrainerNewBadge]);

  // Determine container class based on containerStyle prop
  const getContainerClass = () => {
    if (containerStyle === 'none') return '';
    if (containerStyle === 'default')
      return 'bg-base-100 shadow-xl border-1 border-base-200  sm:rounded-lg min-h-96 relative';
    return containerStyle; // Custom class string
  };

  return (
    <div className="min-h-full bg-base-300 w-full max-w-full overflow-x-hidden [text-size-adjust:100%] [-webkit-text-size-adjust:100%]">
      <div className="bg-primary pb-12 sm:pb-32 w-full">
        <div className="navbar border-b border-secondary-focus/25 bg-primary w-full">
          <div className="navbar-start">
            <div className="flex items-center">
              {/* Mobile logo */}
              {logoSrc ? (
                <Link to="/dashboard" className="lg:hidden ml-2">
                  <img src={logoSrc} alt="App logo" className="h-8 w-auto" />
                </Link>
              ) : null}
              <div className="hidden lg:ml-10 lg:block">
                <div className="flex space-x-2 border-secondary-focus/50 pb-1">
                  {navigation.map((item) => {
                    const isCurrentPage =
                      pathname === item.href ||
                      (item.href !== '/dashboard' &&
                        pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          'btn text-white hover:btn-secondary',
                          isCurrentPage
                            ? 'btn-active btn-secondary'
                            : 'btn-ghost',
                          item.enhanced && !item.isUpgrade
                            ? 'animate-pulse border border-secondary hover:animate-none'
                            : '',
                          item.isUpgrade
                            ? 'btn-accent font-bold text-accent-content border-2 border-warning animate-pulse hover:animate-none hover:btn-warning hover:scale-105 transition-all duration-200'
                            : '',
                          'rounded-md font-medium'
                        )}
                        aria-current={isCurrentPage ? 'page' : undefined}
                      >
                        {item.name}
                        {item.badgeCount !== undefined &&
                          (typeof item.badgeCount === 'string' ||
                            item.badgeCount > 0) && (
                            <span
                              className={`badge ${
                                item.badgeVariant
                                  ? `badge-${item.badgeVariant}`
                                  : 'badge-secondary'
                              } ml-1`}
                            >
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
              <label
                tabIndex={0}
                className="btn btn-ghost hover:btn-secondary text-white"
              >
                <MenuIcon className="h-6 w-6" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {navigation.map((item) => {
                  const isCurrentPage =
                    pathname === item.href ||
                    (item.href !== '/dashboard' &&
                      pathname.startsWith(item.href));
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => {
                          // Remove focus from dropdown to close it
                          const activeElement =
                            document.activeElement as HTMLElement;
                          if (activeElement) {
                            activeElement.blur();
                          }
                        }}
                        className={classNames(
                          isCurrentPage
                            ? 'menu-active bg-primary text-white'
                            : 'hover:bg-primary/10',
                          item.enhanced && !item.isUpgrade
                            ? 'border border-secondary'
                            : '',
                          item.isUpgrade
                            ? 'bg-accent text-accent-content font-bold border-2 border-warning hover:bg-warning hover:text-warning-content'
                            : ''
                        )}
                      >
                        {item.name}
                        {item.badgeCount !== undefined &&
                          (typeof item.badgeCount === 'string' ||
                            item.badgeCount > 0) && (
                            <span
                              className={`badge ${
                                item.badgeVariant
                                  ? `badge-${item.badgeVariant}`
                                  : 'badge-secondary'
                              } ml-1`}
                            >
                              {item.badgeCount}
                            </span>
                          )}
                      </Link>
                    </li>
                  );
                })}
                {/* User profile for mobile */}
                <li className="mt-2 pt-2 border-t border-base-200">
                  <div className="flex justify-center">
                    <UserButton />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <header className="py-2 sm:py-10 w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white break-words">
              {displayTitle}
            </h1>
            {/* Desktop logo */}
            {logoSrc ? (
              <div className="hidden lg:block">
                <img src={logoSrc} alt="App logo" className="h-12 w-auto" />
              </div>
            ) : null}
          </div>
        </header>
      </div>

      <main className="-mt-12 sm:-mt-32 w-full">
        <div className="mx-auto max-w-7xl w-full px-2 sm:px-0">
          <div className="sm:p-4 w-full">
            {containerStyle === 'none' ? (
              <div className="w-full max-w-full overflow-x-hidden">
                {children}
              </div>
            ) : (
              <div
                className={`${getContainerClass()} w-full max-w-full overflow-x-hidden`}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StackedLayout;
