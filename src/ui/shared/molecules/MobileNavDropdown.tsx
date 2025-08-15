import React from 'react';
import { Link, useLocation } from 'react-router';
import {
  MenuIcon,
  LayoutDashboard,
  Dumbbell,
  User,
  Bot,
  CreditCard,
  Crown,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  badgeCount?: number | string;
  badgeVariant?: string;
  enhanced?: boolean;
  isUpgrade?: boolean;
}

interface MobileNavDropdownProps {
  navigation: NavigationItem[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getNavigationIcon(item: NavigationItem) {
  // Map based on href for most reliable matching
  if (item.href === '/dashboard') return LayoutDashboard;
  if (item.href.includes('/workouts')) return Dumbbell;
  if (item.href.includes('/profile')) return User;
  if (item.href.includes('/trainer')) return Bot;
  if (item.href.includes('/billing')) {
    // Use Crown for upgrade, CreditCard for regular billing
    return item.isUpgrade ? Crown : CreditCard;
  }

  // Fallback to LayoutDashboard
  return LayoutDashboard;
}

export const MobileNavDropdown: React.FC<MobileNavDropdownProps> = ({
  navigation,
}) => {
  const pathname = useLocation().pathname || '';

  const handleLinkClick = () => {
    // Remove focus from dropdown to close it
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
  };

  return (
    <div className="dropdown dropdown-end lg:hidden">
      <div
        role="button"
        tabIndex={0}
        className="btn btn-ghost text-white hover:bg-white/10 transition-colors duration-200"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }
        }}
      >
        <MenuIcon className="h-6 w-6" />
      </div>

      <div
        role="menu"
        tabIndex={0}
        className="dropdown-content z-50 mt-3 w-screen max-w-sm -translate-x-4"
      >
        <div className="overflow-hidden rounded-3xl bg-base-100 shadow-2xl border border-base-300">
          <div className="p-2">
            {navigation.map((item) => {
              const isCurrentPage =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <div key={item.name} className="p-1">
                  <Link
                    to={item.href}
                    onClick={handleLinkClick}
                    className={classNames(
                      'group relative flex items-center gap-x-4 rounded-2xl p-4 transition-all duration-200',
                      isCurrentPage
                        ? 'bg-primary text-primary-content shadow-md'
                        : 'hover:bg-base-200 active:bg-base-300',
                      item.isUpgrade
                        ? 'bg-gradient-to-r from-accent to-warning text-accent-content font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] border-2 border-warning/30'
                        : '',
                      item.enhanced && !item.isUpgrade && !isCurrentPage
                        ? 'ring-2 ring-secondary/30 hover:ring-secondary/50'
                        : ''
                    )}
                  >
                    {/* Navigation icon */}
                    <div
                      className={classNames(
                        'flex h-11 w-11 flex-none items-center justify-center rounded-xl transition-colors duration-200',
                        isCurrentPage
                          ? 'bg-primary-content/20'
                          : 'bg-base-300 group-hover:bg-base-content/10',
                        item.isUpgrade
                          ? 'bg-warning/20 group-hover:bg-warning/30'
                          : ''
                      )}
                    >
                      {React.createElement(getNavigationIcon(item), {
                        className: classNames(
                          'h-6 w-6 transition-colors duration-200',
                          isCurrentPage
                            ? 'text-primary-content'
                            : 'text-base-content/70 group-hover:text-primary',
                          item.isUpgrade ? 'text-warning-content' : ''
                        ),
                      })}
                    </div>

                    <div className="flex-auto">
                      <div className="flex items-center gap-2">
                        <span
                          className={classNames(
                            'font-semibold text-base',
                            isCurrentPage
                              ? 'text-primary-content'
                              : 'text-base-content group-hover:text-primary',
                            item.isUpgrade ? 'text-accent-content' : ''
                          )}
                        >
                          {item.name}
                        </span>

                        {item.badgeCount !== undefined &&
                          (typeof item.badgeCount === 'string' ||
                            item.badgeCount > 0) && (
                            <span
                              className={classNames(
                                'badge badge-sm font-bold',
                                item.badgeVariant
                                  ? `badge-${item.badgeVariant}`
                                  : isCurrentPage
                                    ? 'badge-accent'
                                    : 'badge-primary',
                                'shadow-sm'
                              )}
                            >
                              {item.badgeCount}
                            </span>
                          )}
                      </div>

                      {/* Optional description - you can add descriptions to navigation items */}
                      <p
                        className={classNames(
                          'mt-1 text-sm',
                          isCurrentPage
                            ? 'text-primary-content/70'
                            : 'text-base-content/60 group-hover:text-base-content/80',
                          item.isUpgrade ? 'text-accent-content/80' : ''
                        )}
                      >
                        {item.isUpgrade
                          ? 'Unlock premium features'
                          : item.enhanced
                            ? 'Enhanced features available'
                            : ''}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavDropdown;
