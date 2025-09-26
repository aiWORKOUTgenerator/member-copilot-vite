# Analytics Events Documentation

This document provides a comprehensive overview of all analytics events tracked in the application, their properties, and suggestions for creating Mixpanel dashboards and reports.

## Event Categories

### 1. Page Navigation Events

**Automatically tracked via `AnalyticsProvider`**

> ⚠️ **IMPORTANT**: Page views are automatically tracked by the `AnalyticsProvider` and include deduplication logic to prevent multiple API calls per page. Do NOT add redundant page view tracking events in individual components.

#### `page` (Page Views)

- **Description**: Tracks page navigation throughout the application with automatic deduplication
- **Location**: `AnalyticsContext.tsx:47-61` (automatic tracking)
- **Properties**:
  - `path` (string): Current page path (e.g., "/dashboard/workouts")
  - `url` (string): Full URL with query parameters
  - `search` (string): Query parameters string
  - `title` (string): Document title
  - `tenant` (string): Current tenant slug
- **Implementation Notes**:
  - Uses `lastTrackedPageRef` to prevent duplicate calls during React re-renders
  - Only triggers when the URL actually changes
  - Replaces all previous manual page view events (Profile Page Viewed, Workout Generation Page Viewed, etc.)

### 2. User Authentication Events

**Automatically tracked via `AnalyticsProvider`**

#### `identify` (User Identification)

- **Description**: Identifies users when they sign in
- **Properties**:
  - `userId` (string): Clerk user ID
  - `email` (string): User's primary email address
  - `firstName` (string): User's first name
  - `lastName` (string): User's last name
  - `createdAt` (string): User account creation timestamp
  - `tenant` (string): Current tenant slug

---

## 3. Workout Generation Events

### Essential Workout Flow Events

#### `workout_setup_started`

- **Description**: Tracks when users begin workout creation process
- **Location**: `GeneratePage.tsx:57`
- **Properties**:
  - `mode` (string): "quick" | "detailed"
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `workout_path_selected`

- **Description**: Tracks selection between quick vs detailed workout modes
- **Location**: `GeneratePage.tsx:66`
- **Properties**:
  - `path` (string): "quick" | "detailed"
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `setup_step_completed`

- **Description**: Tracks completion of individual setup steps with timing
- **Location**: `GeneratePage.tsx:101,107`
- **Properties**:
  - `step` (string): Step identifier (e.g., "focus-energy", "duration-equipment")
  - `stepTiming` (number): Time spent on step (milliseconds)
  - `mode` (string): "quick" | "detailed"
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `workout_generated`

- **Description**: Tracks successful workout creation with performance metrics
- **Location**: `GeneratePage.tsx:139`
- **Properties**:
  - `mode` (string): "quick" | "detailed"
  - `workoutId` (string): Generated workout ID
  - `duration` (number): Generation time in milliseconds
  - `totalFields` (number): Number of customization fields completed
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `workout_setup_completed`

- **Description**: Tracks successful completion of entire workout setup process
- **Location**: `useWorkoutAnalytics.ts:180`
- **Properties**:
  - `mode` (string): "quick" | "detailed"
  - `totalDuration` (number): Total time from start to completion
  - `fieldsCompleted` (number): Number of fields completed
  - `totalFields` (number): Total fields available
  - `completionRate` (number): Percentage of fields completed
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `workout_setup_abandoned`

- **Description**: Tracks when users abandon workout setup before completion
- **Location**: `useWorkoutAnalytics.ts:218`
- **Properties**:
  - `mode` (string): "quick" | "detailed"
  - `lastStep` (string): Last step reached before abandonment
  - `duration` (number): Time spent before abandoning
  - `fieldsCompleted` (number): Number of fields completed
  - `totalFields` (number): Total fields available
  - `completionRate` (number): Progress percentage at abandonment
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

### Field Selection Events

#### `workout_field_selected`

- **Description**: Tracks individual field selections during workout customization
- **Location**: `useWorkoutAnalytics.ts:100`
- **Properties**:
  - `field` (string): Field identifier
  - `value` (unknown): Selected value (arrays show length)
  - `valueType` (string): "single-select" | "multi-select" | "rating" | "duration" | "text"
  - `mode` (string): "quick" | "detailed"
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

---

## 4. Trainer Persona Events

#### `trainer_persona_created`

- **Description**: Tracks successful AI trainer persona generation
- **Location**: `GeneratingTrainerPage.tsx:36`
- **Properties**:
  - `personaId` (string): Generated trainer persona ID
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

---

## 5. Workout Viewing & Interaction Events

#### `structured_workout_viewed`

- **Description**: Tracks when users view workouts in structured format
- **Location**: `WorkoutDetailPage.tsx:410`
- **Properties**:
  - `workoutId` (string): Workout ID being viewed
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `short_workout_viewed`

- **Description**: Tracks when users view workouts in simple/very-simple format
- **Location**: `WorkoutDetailPage.tsx:417`
- **Properties**:
  - `workoutId` (string): Workout ID being viewed
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `step_by_step_workout_viewed`

- **Description**: Tracks when users view workouts in guided step-by-step format
- **Location**: `WorkoutDetailPage.tsx:413`
- **Properties**:
  - `workoutId` (string): Workout ID being viewed
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `workout_shared`

- **Description**: Tracks workout sharing activity
- **Location**: `WorkoutDetailPage.tsx:354`
- **Properties**:
  - `workoutId` (string): Shared workout ID
  - `shareMethod` (string): "copy" | "social" | "email"
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

### Workout Execution Events

#### `workout_log_started`

- **Description**: Tracks when users begin logging a workout session
- **Properties**:
  - `workoutId` (string): Workout being logged
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `exercise_marked_as_complete`

- **Description**: Tracks exercise completion during workout logging
- **Properties**:
  - `workoutId` (string): Active workout ID
  - `exerciseName` (string): Completed exercise name
  - `sets` (number, optional): Number of sets completed
  - `reps` (number, optional): Number of reps completed
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

### Audio Engagement Events

#### `audio_play_started`

- **Description**: Tracks when users start playing exercise audio instructions
- **Properties**:
  - `exerciseName` (string): Exercise with audio being played
  - `workoutId` (string, optional): Associated workout ID
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `audio_play_finished`

- **Description**: Tracks completion of audio instruction playback
- **Properties**:
  - `exerciseName` (string): Exercise audio that finished
  - `duration` (number): Audio duration in milliseconds
  - `workoutId` (string, optional): Associated workout ID
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

### Advanced Workout Events

#### `workout_regenerated`

- **Description**: Tracks when users regenerate/recreate workouts
- **Properties**:
  - `workoutId` (string, optional): New workout ID
  - `previousWorkoutId` (string, optional): Previous workout being replaced
  - `mode` (string): "quick" | "detailed"
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `exercise_swapped`

- **Description**: Tracks exercise substitutions within workouts
- **Properties**:
  - `workoutId` (string, optional): Workout being modified
  - `exerciseName` (string): Original exercise name
  - `newExerciseName` (string): Replacement exercise name
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

---

## 6. Billing & Subscription Events

#### `billing_subscription_page_viewed`

- **Description**: Tracks when users view the subscription/pricing page
- **Location**: `BillingSubscriptionTab.tsx:19`
- **Properties**:
  - `currentPlan` (string | null): User's current subscription plan name
  - `currentPlanPrice` (string | null): Current plan price
  - `availablePlans` (array): Array of available plan objects with id, name, price, isPopular
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `billing_tab_selected`

- **Description**: Tracks navigation between billing page tabs
- **Location**: `BillingContainer.tsx:57`
- **Properties**:
  - `tab` (string): Selected tab ("subscription" | "payment" | "history" | "usage")
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `billing_pricing_tier_clicked`

- **Description**: Tracks clicks on pricing tier buttons
- **Location**: `PricingComponent.tsx:27`
- **Properties**:
  - `clickedPlan` (string): Name of the clicked plan
  - `clickedPlanPrice` (string): Price of the clicked plan
  - `clickedPlanId` (string): ID of the clicked plan
  - `currentPlan` (string | null): User's current plan name
  - `isUpgrade` (boolean | null): Whether this represents an upgrade
  - `isDowngrade` (boolean | null): Whether this represents a downgrade
  - `stripePriceId` (string): Stripe price ID
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `billing_subscription_upgrade_started`

- **Description**: Tracks initiation of subscription upgrades
- **Location**: `BillingSubscriptionTab.tsx:41`
- **Properties**:
  - `fromPlan` (string | null): Current plan name
  - `fromPlanPrice` (string | null): Current plan price
  - `toPlan` (string): Target plan name
  - `toPlanPrice` (string): Target plan price
  - `planId` (string): Target plan ID
  - `stripePriceId` (string): Stripe price ID
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `billing_checkout_session_created`

- **Description**: Tracks successful Stripe checkout session creation
- **Location**: `BillingSubscriptionTab.tsx:62`
- **Properties**:
  - `fromPlan` (string | null): Current plan name
  - `toPlan` (string): Target plan name
  - `planId` (string): Target plan ID
  - `stripePriceId` (string): Stripe price ID
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

#### `billing_subscription_upgrade_failed`

- **Description**: Tracks failed subscription upgrade attempts
- **Location**: `BillingSubscriptionTab.tsx:79`
- **Properties**:
  - `fromPlan` (string | null): Current plan name
  - `toPlan` (string): Attempted target plan name
  - `planId` (string): Target plan ID
  - `stripePriceId` (string): Stripe price ID
  - `error` (string): Error message
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

### Feedback & Rating Events

#### `user_satisfaction_rating`

- **Description**: Tracks user feedback and satisfaction ratings
- **Properties**:
  - `rating` (number): Numeric rating given by user
  - `context` (string): Context where rating was provided
  - `workoutId` (string, optional): Associated workout ID if applicable
  - `tenant` (string): Current tenant slug
  - `eventTimestamp` (number): Unix timestamp

---

## Mixpanel Dashboard Recommendations

### 1. **Workout Generation Funnel Dashboard**

**Purpose**: Track conversion through the workout creation process and identify drop-off points.

**Key Reports**:

```javascript
// Conversion Funnel
Events: [
  'page', // Filter by path: '/dashboard/workouts/generate'
  'workout_setup_started',
  'setup_step_completed',
  'workout_generated'
]
Breakdown by: mode (quick vs detailed), tenant
```

**Metrics to Track**:

- Overall conversion rate from start to workout generated
- Drop-off rate at each step
- Average time to complete workout generation
- Completion rate by mode (quick vs detailed)
- Tenant-by-tenant conversion comparison

**Suggested Charts**:

- Funnel chart showing step-by-step conversion
- Line chart of conversion rates over time
- Bar chart comparing quick vs detailed mode success rates
- Heatmap of abandonment points by tenant

### 2. **User Engagement & Feature Adoption Dashboard**

**Purpose**: Understand how users interact with different workout formats and features.

**Key Reports**:

```javascript
// Feature Usage Analysis
Events: [
  'structured_workout_viewed',
  'short_workout_viewed',
  'step_by_step_workout_viewed',
  'audio_play_started',
  'workout_shared'
]
Breakdown by: tenant, user properties
```

**Metrics to Track**:

- Most popular workout viewing formats
- Audio engagement rates
- Sharing behavior patterns
- Feature adoption curves for new users
- Power user behavior identification

**Suggested Charts**:

- Pie chart of workout format preferences
- Time series of feature adoption
- Cohort analysis of feature engagement
- User journey flow between features

### 3. **Billing Conversion Dashboard**

**Purpose**: Track the effectiveness of pricing strategies and identify conversion opportunities.

**Key Reports**:

```javascript
// Billing Funnel
Events: [
  'page', // Filter by path: '/dashboard/billing'
  'billing_pricing_tier_clicked',
  'billing_subscription_upgrade_started',
  'billing_checkout_session_created'
]
Breakdown by: currentPlan, clickedPlan, tenant
```

**Metrics to Track**:

- Page view to click conversion rate
- Click to upgrade start conversion rate
- Checkout session success rate
- Most clicked pricing tiers
- Upgrade vs downgrade patterns
- Revenue impact by tenant

**Suggested Charts**:

- Funnel analysis from page view to successful checkout
- Heat map of pricing tier popularity
- Conversion rates by current plan status
- Revenue attribution by marketing touchpoint

### 4. **User Retention & Satisfaction Dashboard**

**Purpose**: Monitor user satisfaction and identify retention patterns.

**Key Reports**:

```javascript
// Satisfaction Analysis
Events: [
  'user_satisfaction_rating',
  'workout_log_started',
  'exercise_marked_as_complete'
]
Breakdown by: rating, context, tenant
```

**Metrics to Track**:

- Average satisfaction ratings over time
- Rating distribution by workout type
- Correlation between ratings and user retention
- Workout completion rates
- Exercise logging engagement

**Suggested Charts**:

- Line chart of satisfaction ratings over time
- Distribution chart of rating scores
- Retention curve segmented by satisfaction level
- Exercise completion rate trends

### 5. **Performance & Quality Dashboard**

**Purpose**: Monitor application performance and user experience quality.

**Key Reports**:

```javascript
// Performance Metrics
Events: [
  'workout_generated', // duration property
  'setup_step_completed', // stepTiming property
  'billing_subscription_upgrade_failed', // error tracking
];
Properties: (duration, stepTiming, error);
```

**Metrics to Track**:

- Average workout generation time
- Step completion timing distribution
- Error rates and types
- Performance trends over time
- System reliability metrics

**Suggested Charts**:

- Performance metrics timeline
- Distribution charts for timing data
- Error tracking and alerting
- Performance benchmarking by tenant

### 6. **Tenant Comparison Dashboard**

**Purpose**: Compare performance and usage patterns across different tenants.

**Key Reports**:

```javascript
// Cross-Tenant Analysis
All Events broken down by: tenant
```

**Metrics to Track**:

- User engagement by tenant
- Feature adoption differences
- Conversion rate variations
- Revenue metrics by tenant
- Support ticket correlation

**Suggested Charts**:

- Comparative metrics table by tenant
- Trend lines for each tenant
- Benchmark comparisons
- Outlier identification alerts

## Recent Analytics Improvements (January 2025)

### Duplicate Event Cleanup

The following redundant events were **REMOVED** to prevent multiple API calls for the same data:

#### Removed Events

- ❌ **`Profile Page Viewed`** - Replaced by automatic `page` tracking
- ❌ **`Workout Generation Page Viewed`** - Replaced by automatic `page` tracking
- ❌ **`Workout History Viewed`** - Replaced by automatic `page` tracking
- ❌ **`Workouts Library Viewed`** - Replaced by automatic `page` tracking
- ❌ **`Sign Up Page Viewed`** - Replaced by automatic `page` tracking
- ❌ **`Sign In Page Viewed`** - Replaced by automatic `page` tracking
- ❌ **`Sign In Phone Page Viewed`** - Replaced by automatic `page` tracking

#### Benefits of This Cleanup

- **Reduced API Calls**: From 6+ calls per page load down to 1 single `page` call
- **Better Performance**: Eliminates redundant network requests
- **Cleaner Data**: No duplicate page view events in analytics
- **Consistent Tracking**: All page views now use the same standardized format

### Implementation Details

- **Deduplication Logic**: `AnalyticsContext.tsx` uses `useRef` to track the last URL and only fires when it changes
- **React Re-render Protection**: Prevents multiple calls during component re-renders
- **URL Change Detection**: Monitors both pathname and search parameters for accurate tracking

---

## Implementation Notes

### Data Quality Assurance

- All events include `eventTimestamp` for precise timing analysis
- `tenant` property enables multi-tenant reporting and filtering
- Consistent event naming convention using snake_case
- Error handling prevents analytics failures from breaking user experience

### Privacy Compliance

- User identification only occurs after consent via authentication
- Personal data is limited to necessary analytics fields
- Tenant isolation maintains data security
- Event data retention follows standard practices

### Performance Considerations

- Analytics hooks use `useCallback` to prevent unnecessary re-renders
- Tenant-enhanced analytics hook (`useAnalyticsWithTenant`) automatically includes tenant in all events
- Conditional analytics support for performance testing
- Background event firing doesn't block user interactions
- **Page view tracking is centralized** to prevent duplicate API calls

### Best Practices for Analytics Implementation

#### ✅ DO

- Use the centralized `page` tracking for all page views
- Track specific user actions (clicks, form submissions, feature usage)
- Include relevant context properties (workoutId, mode, etc.)
- Use the `useAnalyticsWithTenant()` hook for automatic tenant inclusion
- Test analytics events in development using browser console

#### ❌ DON'T

- Add manual page view tracking events (e.g., "Page Viewed", "Screen Viewed")
- Duplicate events that are already captured by automatic tracking
- Track page views in `useEffect` hooks within page components
- Create multiple analytics calls for the same user action
- Add analytics that could impact user experience performance

#### Migration Guide for New Pages

When adding new pages or components:

1. **Page Views**: No action needed - automatic via `AnalyticsContext`
2. **User Actions**: Add specific event tracking with descriptive names
3. **Form Interactions**: Track field selections and form completions
4. **Feature Usage**: Track meaningful user interactions only

```typescript
// ✅ Good: Specific action tracking
const handleWorkoutStart = () => {
  analytics.track('workout_log_started', {
    workoutId,
    mode: 'quick',
  });
  startWorkout();
};

// ❌ Bad: Redundant page view tracking
useEffect(() => {
  analytics.track('Workout Page Viewed'); // Already handled by AnalyticsContext
}, []);
```

This comprehensive analytics implementation provides rich insights into user behavior, feature adoption, conversion funnels, and business metrics while maintaining strong performance and privacy standards.
