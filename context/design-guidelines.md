# 🎨 UI/UX Design Checklist

_For B2B2C Gym Member App built with React + TailwindCSS + DaisyUI + Vite_

---

## CSS & Styling Architecture

- [ ] Choose a scalable CSS methodology (utility-first with Tailwind + DaisyUI)
- [ ] Use **design tokens** (`primary`, `secondary`, `accent`, `base-content`, etc.) instead of hardcoded colors
- [ ] Keep overrides limited to DaisyUI’s CSS variables for theming (`--color-primary`, `--color-primary-content`, etc.)
- [ ] Encapsulate styles in **React components** (e.g., `WorkoutCard`, `NavBar`) to enforce consistency
- [ ] Use DaisyUI’s prebuilt semantic components (`btn`, `card`, `progress`) for speed and maintainability

---

## Theming & Multi-Gym Branding

- [ ] Use DaisyUI’s **semantic color classes** (`bg-primary`, `text-accent`) everywhere
- [ ] Load a **theme CSS file per gym** from the backend with DaisyUI variable overrides
- [ ] Support multiple DaisyUI themes (`data-theme="gymName"`) for dynamic brand switching
- [ ] Test all components with each theme for sufficient contrast & accessibility
- [ ] Keep themes modular – no custom CSS per gym, only variable overrides

---

## Mobile-First & Responsive Design

- [ ] Prioritize **mobile-first layouts** with Tailwind responsive utilities (`sm:`, `md:`, `lg:`)
- [ ] Use **one-column layouts** on mobile; scale up to multi-column on larger screens
- [ ] Implement **bottom navigation bar** (3–5 main tabs) for easy thumb access
- [ ] Ensure **large, tappable buttons** (min 44x44px touch targets)
- [ ] Optimize text size, spacing, and contrast for small screens
- [ ] Test across multiple screen sizes and orientations

---

## Onboarding & User Flow

- [ ] Keep onboarding **fast and frictionless** – under 1 minute to first workout
- [ ] Highlight app **benefits upfront** (“AI workouts tailored for you”)
- [ ] Use **smart defaults** (pre-fill common goals/preferences)
- [ ] Allow skipping non-critical steps (e.g., detailed profile setup)
- [ ] Show clear **progress indicators** if multiple onboarding steps
- [ ] Use **motivational copy and visuals** to energize the user

---

## UI & Navigation Principles

- [ ] Keep **one core task per screen** – avoid clutter
- [ ] Use **bold, obvious CTAs** for main actions (e.g., “Start Workout”)
- [ ] Use a **bottom tab nav** with clear labels and icons
- [ ] Keep secondary actions in menus or smaller buttons
- [ ] Make the **home screen a hub**: show workout of the day or suggested plan prominently
- [ ] Provide consistent orientation cues (headers, nav bar always visible)

---

## Gamification & Playfulness

- [ ] Add **badges, points, levels** for milestones (streaks, workouts completed)
- [ ] Provide **challenges** (weekly/monthly goals with progress bars)
- [ ] Use **progress bars** and DaisyUI’s `progress` components for goal tracking
- [ ] Add **micro-interactions** (animations, confetti, haptic feedback on achievements)
- [ ] Keep gamification **optional and balanced** – motivational but not overwhelming
- [ ] Use fun visual cues: emojis, icons, vibrant accent colors from theme

---

## Progress Tracking & Feedback

- [ ] Show a **progress dashboard** with workouts completed, streaks, milestones
- [ ] Visualize data with **simple charts/graphs** (weekly frequency, strength trends)
- [ ] Use DaisyUI/Tailwind for styled **progress indicators** (bars, radial, badges)
- [ ] Provide **instant feedback** when workouts are completed (“+20 points earned!”)
- [ ] Highlight **streaks and personal records** on home or progress screen
- [ ] Focus on **clarity and minimalism** – only surface key metrics

---

## Personalization & Delight

- [ ] Greet users by **name and motivational messages**
- [ ] Show **AI-recommended workouts** (“Suggested for you today”)
- [ ] Highlight when plans are **adapted based on progress**
- [ ] Use **casual, positive tone** with playful copy and emojis where appropriate
- [ ] Respect user context: support **dark mode, units (kg/lb), language** preferences
- [ ] Add delightful microcopy and subtle animations to celebrate milestones

---

✅ Following this checklist ensures the app remains **modern, mobile-first, themable, and engaging** for gym members across different branded deployments.
