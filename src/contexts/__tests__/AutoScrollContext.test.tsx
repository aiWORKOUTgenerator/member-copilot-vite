import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { AutoScrollProvider } from '../AutoScrollContext';
import { useAutoScrollPreferences } from '../../hooks/useAutoScrollPreferences';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { enabled, delay, setEnabled, setDelay } = useAutoScrollPreferences();

  return (
    <div>
      <div data-testid="enabled">{enabled.toString()}</div>
      <div data-testid="delay">{delay}</div>
      <button onClick={() => setEnabled(!enabled)}>Toggle</button>
      <button onClick={() => setDelay(2000)}>Set Delay</button>
    </div>
  );
};

describe('AutoScrollContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should provide default values when no stored preferences', () => {
    render(
      <AutoScrollProvider>
        <TestComponent />
      </AutoScrollProvider>
    );

    expect(screen.getByTestId('enabled')).toHaveTextContent('true');
    expect(screen.getByTestId('delay')).toHaveTextContent('1200');
  });

  it('should load stored preferences from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ enabled: false, delay: 2500 })
    );

    render(
      <AutoScrollProvider>
        <TestComponent />
      </AutoScrollProvider>
    );

    expect(screen.getByTestId('enabled')).toHaveTextContent('false');
    expect(screen.getByTestId('delay')).toHaveTextContent('2500');
  });

  it('should update and persist preferences', () => {
    render(
      <AutoScrollProvider>
        <TestComponent />
      </AutoScrollProvider>
    );

    // Toggle enabled state
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('enabled')).toHaveTextContent('false');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'auto-scroll-preferences',
      JSON.stringify({ enabled: false, delay: 1200 })
    );

    // Change delay
    fireEvent.click(screen.getByText('Set Delay'));
    expect(screen.getByTestId('delay')).toHaveTextContent('2000');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'auto-scroll-preferences',
      JSON.stringify({ enabled: false, delay: 2000 })
    );
  });

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <AutoScrollProvider>
        <TestComponent />
      </AutoScrollProvider>
    );

    // Should still render with default values
    expect(screen.getByTestId('enabled')).toHaveTextContent('true');
    expect(screen.getByTestId('delay')).toHaveTextContent('1200');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load auto-scroll preferences:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      'useAutoScrollPreferences must be used within an AutoScrollProvider'
    );

    consoleSpy.mockRestore();
  });
});
