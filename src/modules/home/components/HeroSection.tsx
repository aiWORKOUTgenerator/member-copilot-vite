"use client";

import { useAuth } from "@/hooks/auth";
import { Link } from "react-router";
import { Button } from "@/ui";
import { HOMEPAGE_CONTENT } from "../constants";

interface HeroSectionProps {
  onHeroCTAClick: () => void;
}

export function HeroSection({ onHeroCTAClick }: HeroSectionProps) {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="hero min-h-[70vh] bg-transparent">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold">
            {HOMEPAGE_CONTENT.hero.title}
          </h1>
          <p className="py-6 text-lg">
            {HOMEPAGE_CONTENT.hero.description}
          </p>

          {isLoaded && !isSignedIn && (
            <div className="mt-4">
              <Link to="/conversion/signup" onClick={onHeroCTAClick}>
                <Button variant="primary" size="lg">
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