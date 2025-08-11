import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useAutoScroll } from '../useAutoScroll';

describe('useAutoScroll', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.scrollIntoView = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should trigger scroll when enabled', () => {
    const { result } = renderHook(() =>
      useAutoScroll({ enabled: true, delay: 1000 })
    );

    act(() => {
      result.current.triggerAutoScroll(mockElement);
      vi.advanceTimersByTime(1000);
    });

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  });

  it('should not trigger scroll when disabled', () => {
    const { result } = renderHook(() => useAutoScroll({ enabled: false }));

    act(() => {
      result.current.triggerAutoScroll(mockElement);
      vi.advanceTimersByTime(2000);
    });

    expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
  });

  it('should respect validation function', () => {
    const onValidate = vi.fn().mockReturnValue(false);
    const { result } = renderHook(() =>
      useAutoScroll({ enabled: true, onValidate })
    );

    act(() => {
      result.current.triggerAutoScroll(mockElement);
      vi.advanceTimersByTime(2000);
    });

    expect(onValidate).toHaveBeenCalled();
    expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
  });

  it('should call onAfterScroll callback', () => {
    const onAfterScroll = vi.fn();
    const { result } = renderHook(() =>
      useAutoScroll({ enabled: true, delay: 500, onAfterScroll })
    );

    act(() => {
      result.current.triggerAutoScroll(mockElement);
      vi.advanceTimersByTime(500);
    });

    expect(onAfterScroll).toHaveBeenCalled();
  });

  it('should respect reduced motion preference', () => {
    // Mock matchMedia to return reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() =>
      useAutoScroll({ enabled: true, delay: 1000 })
    );

    act(() => {
      result.current.triggerAutoScroll(mockElement);
      vi.advanceTimersByTime(1000);
    });

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
      inline: 'nearest',
    });
  });

  it('should handle missing element gracefully', () => {
    const { result } = renderHook(() =>
      useAutoScroll({ enabled: true, delay: 500 })
    );

    act(() => {
      result.current.triggerAutoScroll(null as unknown as HTMLElement);
      vi.advanceTimersByTime(500);
    });

    // Should not throw an error
    expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
  });
});
