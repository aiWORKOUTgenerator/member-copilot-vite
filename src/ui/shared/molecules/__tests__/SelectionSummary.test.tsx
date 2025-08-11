import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Target, Battery } from 'lucide-react';
import { SelectionSummary } from '../SelectionSummary';
import type { SelectionSummaryItem } from '@/modules/dashboard/workouts/hooks/useSelectionSummary';

describe('SelectionSummary', () => {
  const mockSelections: SelectionSummaryItem[] = [
    {
      key: 'focus',
      label: 'Focus',
      value: 'Core Abs',
      icon: Target,
    },
    {
      key: 'energy',
      label: 'Energy',
      value: 'High (4/5)',
      icon: Battery,
    },
  ];

  it('renders selection items correctly', () => {
    render(
      <SelectionSummary
        selections={mockSelections}
        isVisible={true}
        variant="compact"
      />
    );

    expect(screen.getByText('Core Abs')).toBeInTheDocument();
    expect(screen.getByText('High (4/5)')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    const { container } = render(
      <SelectionSummary
        selections={mockSelections}
        isVisible={false}
        variant="compact"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('does not render when selections array is empty', () => {
    const { container } = render(
      <SelectionSummary selections={[]} isVisible={true} variant="compact" />
    );

    expect(container.firstChild).toBeNull();
  });

  it('does not render remove buttons (display-only component)', () => {
    render(
      <SelectionSummary
        selections={mockSelections}
        isVisible={true}
        variant="compact"
      />
    );

    // Should not have any buttons since it's display-only
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('shows labels in detailed variant', () => {
    render(
      <SelectionSummary
        selections={mockSelections}
        isVisible={true}
        variant="detailed"
      />
    );

    expect(screen.getByText('Focus:')).toBeInTheDocument();
    expect(screen.getByText('Energy:')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <SelectionSummary
        selections={mockSelections}
        isVisible={true}
        variant="compact"
        className="custom-class"
      />
    );

    const container = screen.getByRole('group');
    expect(container).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(
      <SelectionSummary
        selections={mockSelections}
        isVisible={true}
        variant="compact"
      />
    );

    const container = screen.getByRole('group');
    expect(container).toHaveAttribute('aria-label', 'Selected options');
  });
});
