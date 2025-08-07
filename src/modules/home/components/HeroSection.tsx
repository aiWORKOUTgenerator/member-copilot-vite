'use client';

import { useAuth } from '@/hooks/auth';
import { Link } from 'react-router';
import { Button } from '@/ui';
import { HOMEPAGE_CONTENT } from '../constants';

interface HeroSectionProps {
  onHeroCTAClick: () => void;
}

export function HeroSection({ onHeroCTAClick }: HeroSectionProps) {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="hero min-h-[70vh] bg-transparent w-full">
      <div className="hero-content text-center w-full max-w-none px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {HOMEPAGE_CONTENT.hero.title}
          </h1>
          <p className="py-4 sm:py-6 text-base sm:text-lg leading-relaxed">
            {HOMEPAGE_CONTENT.hero.description}
          </p>

          {isLoaded && !isSignedIn && (
            <div className="mt-4">
              <Link to="/conversion/signup" onClick={onHeroCTAClick}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {HOMEPAGE_CONTENT.hero.ctaButton}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
