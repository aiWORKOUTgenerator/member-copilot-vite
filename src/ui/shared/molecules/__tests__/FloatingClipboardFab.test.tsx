import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingClipboardFab from '../FloatingClipboardFab';

describe('FloatingClipboardFab', () => {
  it('renders an anchor with default href', () => {
    render(<FloatingClipboardFab />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/select-workout');
  });

  it('renders with custom href', () => {
    render(<FloatingClipboardFab href="/custom-path" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/custom-path');
  });

  it('has correct aria-label', () => {
    render(<FloatingClipboardFab />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'Generate new workout');
  });

  it('has correct title attribute', () => {
    render(<FloatingClipboardFab />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('title', 'Generate new workout');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<FloatingClipboardFab onClick={handleClick} />);

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders clipboard icon', () => {
    render(<FloatingClipboardFab />);

    const icon = screen.getByTestId('clipboard-icon');
    expect(icon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<FloatingClipboardFab className="custom-class" />);

    const container = screen.getByRole('link').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});
