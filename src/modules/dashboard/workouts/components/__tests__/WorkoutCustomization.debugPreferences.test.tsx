import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import WorkoutCustomization from '../WorkoutCustomization';
import { AutoScrollProvider } from '@/contexts/AutoScrollContext';
import { getAutoScrollPreferences } from '@/config/autoScroll';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AutoScrollProvider>{children}</AutoScrollProvider>
);

describe('WorkoutCustomization Auto-Scroll Preferences Debug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should show default auto-scroll preferences', () => {
    // Check what the default preferences are
    const defaultPrefs = getAutoScrollPreferences();
    console.log('Default auto-scroll preferences:', defaultPrefs);

    expect(defaultPrefs.enabled).toBe(true);
    expect(defaultPrefs.delay).toBe(1200);
  });

  it('should show auto-scroll preferences in context', () => {
    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={vi.fn()}
          errors={{}}
          mode="quick"
        />
      </TestWrapper>
    );

    // Check if the toggle exists and its state
    const toggle = screen.getByLabelText('Auto-advance');
    console.log('Toggle in quick mode:', {
      exists: !!toggle,
      checked: toggle.checked,
      attributes: Array.from(toggle.attributes).map(
        (attr) => `${attr.name}="${attr.value}"`
      ),
    });

    expect(toggle).toBeInTheDocument();
  });

  it('should show auto-scroll preferences in detailed mode', () => {
    render(
      <TestWrapper>
        <WorkoutCustomization
          options={{}}
          onChange={vi.fn()}
          errors={{}}
          mode="detailed"
        />
      </TestWrapper>
    );

    // Check if the toggle exists and its state
    const toggle = screen.getByLabelText('Auto-advance');
    console.log('Toggle in detailed mode:', {
      exists: !!toggle,
      checked: toggle.checked,
      attributes: Array.from(toggle.attributes).map(
        (attr) => `${attr.name}="${attr.value}"`
      ),
    });

    expect(toggle).toBeInTheDocument();
  });

  it('should handle localStorage preferences', () => {
    // Set localStorage preferences
    localStorage.setItem(
      'auto-scroll-preferences',
      JSON.stringify({ enabled: false, delay: 2000 })
    );

    const prefs = getAutoScrollPreferences();
    console.log('Preferences from localStorage:', prefs);

    expect(prefs.enabled).toBe(false);
    expect(prefs.delay).toBe(2000);
  });
});
