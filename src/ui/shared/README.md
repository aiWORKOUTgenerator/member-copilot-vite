# Shared UI Component Library

## Icon System

The application uses a reusable icon system that provides a consistent way to handle icons throughout the codebase. There are two main ways to use icons:

### 1. Using Pre-defined Icons

The simplest approach is to use our predefined icons from the IconSet:

```tsx
import { ArrowRightIcon, MenuIcon, UserIcon } from '@/app/ui/shared';

// In your component:
<ArrowRightIcon size="md" className="text-primary" />;
```

Available sizes:

- `xs`: 16px
- `sm`: 20px
- `md`: 24px
- `lg`: 32px
- `xl`: 40px

You can also pass any custom className to apply additional styling:

```tsx
<SuccessIcon size="lg" className="text-green-500 animate-pulse" />
```

### 2. Using the Base Icon Component

For custom SVG paths or when using external libraries like react-icons:

```tsx
import { Icon } from "@/app/ui/shared";
import { FiHome } from "react-icons/fi";

// For react-icons:
<Icon size="md" className="text-primary">
  <FiHome />
</Icon>

// For custom SVG paths:
<Icon size="md" className="text-primary">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
</Icon>
```

### 3. Creating Your Own Icon Components

If you need a new reusable icon that's not in our set, add it to `IconSet.tsx`:

```tsx
export const NewIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="..." /> {/* SVG path data */}
  </Icon>
);
```

Then add it to the exports in `src/ui/shared/index.ts`.

## Authentication

### Auth Service

The application uses a centralized authentication service that wraps Clerk's functionality. Use this service to manage authentication across the application:

```tsx
import { useAuth } from '@/services/auth';

function MyComponent() {
  const { user, isLoaded, isSignedIn, isSigningOut, signOut } = useAuth();

  // Check if user is authenticated
  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  // Sign out with redirect
  const handleLogout = () => {
    signOut('/login'); // Redirects to /login after sign out
  };

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
}
```

### SignOutButton Component

For a reusable sign out button with built-in loading state and styling:

```tsx
import { SignOutButton } from "@/app/ui/shared";

// Basic usage
<SignOutButton />

// Customized
<SignOutButton
  variant="ghost"
  size="sm"
  className="text-red-500"
  redirectPath="/login"
  showIcon={false}
>
  Logout
</SignOutButton>
```

## Best Practices

1. **Consistency**: Use the shared icon components instead of inline SVGs
2. **Sizing**: Use the predefined sizes (`xs`, `sm`, `md`, `lg`, `xl`) for consistent icon sizing
3. **Colors**: Use Tailwind's text-color utilities (e.g., `text-primary`, `text-error`) to style icons
4. **Accessibility**: Include proper aria labels on interactive elements that use icons
5. **Authentication**: Use the centralized auth service instead of direct Clerk calls for consistency
