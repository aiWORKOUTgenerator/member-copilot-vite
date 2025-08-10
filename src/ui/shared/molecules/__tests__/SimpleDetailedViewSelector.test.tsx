import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SimpleDetailedViewSelector } from '../SimpleDetailedViewSelector';

describe('SimpleDetailedViewSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(
      <SimpleDetailedViewSelector value="detailed" onChange={mockOnChange} />
    );

    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.getByText('Detailed')).toBeInTheDocument();
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      'View mode selector'
    );
  });

  it('shows detailed as active when value is detailed', () => {
    render(
      <SimpleDetailedViewSelector value="detailed" onChange={mockOnChange} />
    );

    const detailedButton = screen.getByText('Detailed').closest('button');
    const simpleButton = screen.getByText('Simple').closest('button');

    expect(detailedButton).toHaveClass(
      'bg-base-100',
      'text-base-content',
      'shadow-sm'
    );
    expect(detailedButton).toHaveAttribute('aria-pressed', 'true');
    expect(simpleButton).toHaveClass('text-base-content/60');
    expect(simpleButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows simple as active when value is simple', () => {
    render(
      <SimpleDetailedViewSelector value="simple" onChange={mockOnChange} />
    );

    const simpleButton = screen.getByText('Simple').closest('button');
    const detailedButton = screen.getByText('Detailed').closest('button');

    expect(simpleButton).toHaveClass(
      'bg-base-100',
      'text-base-content',
      'shadow-sm'
    );
    expect(simpleButton).toHaveAttribute('aria-pressed', 'true');
    expect(detailedButton).toHaveClass('text-base-content/60');
    expect(detailedButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange when clicking simple button', () => {
    render(
      <SimpleDetailedViewSelector value="detailed" onChange={mockOnChange} />
    );

    fireEvent.click(screen.getByText('Simple'));
    expect(mockOnChange).toHaveBeenCalledWith('simple');
  });

  it('calls onChange when clicking detailed button', () => {
    render(
      <SimpleDetailedViewSelector value="simple" onChange={mockOnChange} />
    );

    fireEvent.click(screen.getByText('Detailed'));
    expect(mockOnChange).toHaveBeenCalledWith('detailed');
  });

  it('does not call onChange when clicking already active button', () => {
    render(
      <SimpleDetailedViewSelector value="detailed" onChange={mockOnChange} />
    );

    fireEvent.click(screen.getByText('Detailed'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('supports custom labels', () => {
    render(
      <SimpleDetailedViewSelector
        value="detailed"
        onChange={mockOnChange}
        labels={{ simple: 'Quick', detailed: 'Full' }}
      />
    );

    expect(screen.getByText('Quick')).toBeInTheDocument();
    expect(screen.getByText('Full')).toBeInTheDocument();
    expect(screen.queryByText('Simple')).not.toBeInTheDocument();
    expect(screen.queryByText('Detailed')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <SimpleDetailedViewSelector
        value="detailed"
        onChange={mockOnChange}
        size="sm"
      />
    );

    let buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('text-xs', 'px-3', 'py-1.5');
    });

    rerender(
      <SimpleDetailedViewSelector
        value="detailed"
        onChange={mockOnChange}
        size="lg"
      />
    );

    buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('text-base', 'px-6', 'py-3');
    });
  });

  it('disables buttons when disabled prop is true', () => {
    render(
      <SimpleDetailedViewSelector
        value="detailed"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('does not call onChange when disabled', () => {
    render(
      <SimpleDetailedViewSelector
        value="detailed"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    fireEvent.click(screen.getByText('Simple'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation with Enter key', () => {
    render(
      <SimpleDetailedViewSelector value="detailed" onChange={mockOnChange} />
    );

    const simpleButton = screen.getByText('Simple').closest('button');
    fireEvent.keyDown(simpleButton!, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith('simple');
  });

  it('supports keyboard navigation with Space key', () => {
    render(
      <SimpleDetailedViewSelector value="detailed" onChange={mockOnChange} />
    );

    const simpleButton = screen.getByText('Simple').closest('button');
    fireEvent.keyDown(simpleButton!, { key: ' ' });
    expect(mockOnChange).toHaveBeenCalledWith('simple');
  });

  it('handles keyboard events correctly', () => {
    render(
      <SimpleDetailedViewSelector value="detailed" onChange={mockOnChange} />
    );

    const simpleButton = screen.getByText('Simple').closest('button');
    fireEvent.keyDown(simpleButton!, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith('simple');
  });

  it('does not call onChange on keyboard events when disabled', () => {
    render(
      <SimpleDetailedViewSelector
        value="detailed"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const simpleButton = screen.getByText('Simple').closest('button');
    fireEvent.keyDown(simpleButton!, { key: 'Enter' });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <SimpleDetailedViewSelector
        value="detailed"
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    expect(screen.getByRole('group')).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(
      <SimpleDetailedViewSelector value="detailed" onChange={mockOnChange} />
    );

    const simpleButton = screen.getByText('Simple').closest('button');
    const detailedButton = screen.getByText('Detailed').closest('button');

    expect(simpleButton).toHaveAttribute('aria-label', 'Simple view');
    expect(detailedButton).toHaveAttribute('aria-label', 'Detailed view');
    expect(simpleButton).toHaveAttribute('aria-pressed', 'false');
    expect(detailedButton).toHaveAttribute('aria-pressed', 'true');
  });
});
