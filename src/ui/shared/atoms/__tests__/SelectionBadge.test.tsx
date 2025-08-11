import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SelectionBadge } from '../SelectionBadge';

describe('SelectionBadge', () => {
  it('renders with value', () => {
    render(<SelectionBadge value="30 min" />);
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('returns null when value is empty', () => {
    const { container } = render(<SelectionBadge value="" />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when value is null', () => {
    const { container } = render(<SelectionBadge value={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when value is undefined', () => {
    const { container } = render(<SelectionBadge />);
    expect(container.firstChild).toBeNull();
  });

  it('applies correct size classes', () => {
    render(<SelectionBadge value="Test" size="xs" />);
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('badge-xs');
  });

  it('defaults to sm size', () => {
    render(<SelectionBadge value="Test" />);
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('badge-sm');
  });

  it('always includes outline and ml-auto classes', () => {
    render(<SelectionBadge value="Test" />);
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('badge-outline', 'ml-auto');
  });

  it('applies additional className', () => {
    render(<SelectionBadge value="Test" className="custom-class" />);
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('custom-class');
  });
});
