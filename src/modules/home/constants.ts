/**
 * Homepage content constants
 * 
 * This file contains all text content used in the homepage component.
 * Extracting these constants makes the content easier to maintain and
 * prepares for future internationalization support.
 */

export const HOMEPAGE_CONTENT = {
  // Navigation
  navbar: {
    logo: "AI Workout Generator",
    signIn: "Sign In",
    createAccount: "Create Account",
    myWorkouts: "My Workouts",
  },
  
  // Hero Section
  hero: {
    title: "Your Personal AI Workout Generator",
    description: "Get detailed workout plans tailored to your fitness level, goals, and available equipment. Powered by advanced AI to optimize your training and results.",
    ctaButton: "Generate Your First Workout",
  },
} as const;

// Analytics event names for consistency
export const ANALYTICS_EVENTS = {
  LANDING_PAGE_VIEWED: "Landing Page Viewed",
  SIGN_IN_CTA_CLICKED: "Sign In CTA Clicked",
  DASHBOARD_NAVIGATION_CLICKED: "Dashboard Navigation Clicked",
  CREATE_ACCOUNT_CTA_CLICKED: "Create Account CTA Clicked",
  HERO_CTA_CLICKED: "Hero CTA Clicked",
  LOGO_CLICKED: "Logo Clicked",
} as const; 