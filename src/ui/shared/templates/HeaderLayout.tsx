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
import React, { ReactNode, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { useAppConfig } from '@/hooks/useConfiguration';
import { MobileNavDropdown } from '@/ui/shared/molecules/MobileNavDropdown';

interface NavigationItem {
  name: string;
  href: string;
  badgeCount?: number | string;
  badgeVariant?: string;
  enhanced?: boolean;
  isUpgrade?: boolean;
}

interface HeaderLayoutProps {
  children: ReactNode;
  title?: string;
  navigation?: NavigationItem[];
  logo?: string;
  containerStyle?: 'default' | 'none' | string;
  headerStyle?: 'white' | 'base' | string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  children,
  title,
  logo,
  containerStyle = 'default',
  headerStyle = 'white',
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
      return 'bg-base-100 shadow-xl border border-base-200 rounded-lg min-h-96 relative';
    return containerStyle; // Custom class string
  };

  // Determine header class based on headerStyle prop
  const getHeaderClass = () => {
    if (headerStyle === 'white')
      return 'bg-base-100 shadow-sm border-b border-base-300';
    if (headerStyle === 'base')
      return 'bg-base-200 shadow-sm border-b border-base-300';
    return headerStyle; // Custom class string
  };

  return (
    <div className="min-h-full bg-base-200">
      {/* Navigation Header */}
      <nav className="bg-primary border-b border-primary-focus/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              {/* Logo */}
              <div className="shrink-0">
                {logoSrc ? (
                  <Link to="/dashboard">
                    <img src={logoSrc} alt="App logo" className="h-8 w-auto" />
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-xl font-bold text-white"
                  >
                    App
                  </Link>
                )}
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
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
                          'relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                          isCurrentPage
                            ? 'bg-primary-focus text-white shadow-md'
                            : 'text-primary-content/90 hover:bg-white/10 hover:text-white',
                          item.enhanced && !item.isUpgrade
                            ? 'ring-2 ring-secondary/50 hover:ring-secondary'
                            : '',
                          item.isUpgrade
                            ? 'bg-gradient-to-r from-accent to-warning text-accent-content font-bold border-2 border-warning/50 hover:border-warning hover:scale-105 transition-all duration-200'
                            : ''
                        )}
                        aria-current={isCurrentPage ? 'page' : undefined}
                      >
                        {item.name}
                        {item.badgeCount !== undefined &&
                          (typeof item.badgeCount === 'string' ||
                            item.badgeCount > 0) && (
                            <span
                              className={`badge badge-sm ${
                                item.badgeVariant
                                  ? `badge-${item.badgeVariant}`
                                  : 'badge-secondary'
                              } font-bold shadow-sm`}
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

            {/* Desktop User Menu */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* User profile dropdown */}
                <div className="flex items-center">
                  <UserButton />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <MobileNavDropdown navigation={navigation} />
            </div>
          </div>
        </div>
      </nav>

      {/* Page Title Header */}
      <header className={`relative ${getHeaderClass()}`}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-base-content break-words">
              {displayTitle}
            </h1>
            {/* Optional: Add breadcrumbs or additional header content here */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        <div className="mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
          {containerStyle === 'none' ? (
            <div className="w-full max-w-full overflow-x-hidden">
              {children}
            </div>
          ) : (
            <div
              className={`${getContainerClass()} w-full max-w-full overflow-x-hidden p-6`}
            >
              {children}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HeaderLayout;
