# Analytics Service

This module provides an abstraction over analytics tracking services to enable consistent event tracking throughout the application while allowing easy switching between different analytics providers.

## Setup

1. The analytics service is implemented as a provider abstraction with Rudderstack as the current implementation.

2. To use the analytics service, you'll need to set the following environment variables:

```
RUDDERSTACK_WRITE_KEY=your_write_key_here
RUDDERSTACK_DATA_PLANE_URL=your_data_plane_url_here
```

3. The `AnalyticsProvider` component will automatically initialize the analytics service when it's rendered in your application.

## Usage

You can use the analytics service in your components by importing the `useAnalytics` hook:

```tsx
import { useAnalytics } from "@/hooks";

function MyComponent() {
  const analytics = useAnalytics();

  const handleButtonClick = () => {
    // Track event
    analytics.track('Button Clicked', {
      buttonName: 'Submit',
      pageSection: 'Form',
    });
  };

  return <button onClick={handleButtonClick}>Submit</button>;
}
```

## Available Methods

The analytics service provides the following methods:

- `initialize()`: Initialize the analytics service
- `page(properties?)`: Track page views
- `identify(userId, traits?)`: Identify a user and associate traits
- `track(event, properties?)`: Track events with optional properties
- `reset()`: Reset the current user identity

## Adding a New Analytics Provider

To add a new analytics provider:

1. Create a new implementation of the `AnalyticsService` interface
2. Update the `AnalyticsFactory` to support the new provider type
3. Update the environment variables accordingly

## Architecture

- `AnalyticsService`: Interface that defines the analytics API
- `RudderstackAnalyticsService`: Concrete implementation for Rudderstack
- `AnalyticsFactory`: Factory for creating provider instances
- `initAnalytics`: Helper to initialize the analytics service
- `AnalyticsProvider`: React component that initializes analytics on the client
- `useAnalytics`: Hook for using analytics in components
